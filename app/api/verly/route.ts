// app/api/verly/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Contador diario global en la base (confiable entre despliegues/instancias).
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const TOPE_DIARIO = 500; // máximo de mensajes al chat por día (protege el costo)

async function superaTopeDiario(): Promise<boolean> {
  try {
    const hoy = new Date().toISOString().slice(0, 10);
    const { data } = await sb.from('chat_uso').select('total').eq('fecha', hoy).maybeSingle();
    const actual = data?.total ?? 0;
    if (actual >= TOPE_DIARIO) return true;
    await sb.from('chat_uso').upsert({ fecha: hoy, total: actual + 1 }, { onConflict: 'fecha' });
    return false;
  } catch {
    return false; // si el contador falla, no bloqueamos al cliente
  }
}

// ── Rate limiting: 15 mensajes por minuto por IP ──────────────────────────
const botAttempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxAttempts = 15;
  const record = botAttempts.get(ip);
  if (!record || now > record.resetAt) {
    botAttempts.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }
  if (record.count >= maxAttempts) return true;
  record.count++;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { texto: 'Demasiados mensajes. Espera un momento.' },
        { status: 429 }
      );
    }

    const { messages, lang, contexto } = await req.json();

    // Tope global diario (protege el costo de la API)
    if (await superaTopeDiario()) {
      return NextResponse.json(
        { texto: lang === 'es' ? 'El chat no está disponible por ahora. Escríbenos por WhatsApp.' : 'Chat is unavailable right now. Please reach us on WhatsApp.' },
        { status: 429 }
      );
    }

    // Validación de input
    if (!Array.isArray(messages) || messages.length > 20) {
      return NextResponse.json(
        { texto: lang === 'es' ? 'Lo siento, hubo un error.' : 'Sorry, there was an error.' },
        { status: 400 }
      );
    }

    // Limitar tamaño de cada mensaje
    const mensajesLimpios = messages
      .slice(-10) // solo los últimos 10 para no mandar historiales enormes
      .map((m: any) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: String(m.content || '').slice(0, 500), // máx 500 chars por mensaje
      }));

    const contextoLimpio = String(contexto || '').slice(0, 300);

    const systemPrompt = lang === 'es'
      ? `Eres Verly, el asistente virtual de Verly Optical. Eres amable, experto en óptica y hablas español de forma natural y cercana.
Ayudas a clientes a encontrar lentes perfectos para su estilo de vida.
Contexto del negocio:
- Armazones desde $13 USD
- Micas: Standard (+$0), Thin & Durable (+$29), ClearView Plus (+$39), Ultra Thin (+$59), Ultra Thin Pro (+$89)
- Filtros: Essential AR (+$11), Blue Light (+$18), Fotocromático (+$49), Anti-Fog (+$15), Premium AR (+$24), Polarizado (+$70), Fashion Tint (+$28)
- Envío 5-7 días a USA. Sin aseguranza. La receta se ingresa en el configurador del armazón.
- No pidas la graduación en el chat — guía al cliente a elegir armazón primero.
- Respuestas cortas, máximo 3 oraciones.
${contextoLimpio ? `Contexto: ${contextoLimpio}` : ''}`
      : `You are Verly, the virtual assistant of Verly Optical. You are friendly, knowledgeable about optics, and speak natural English.
You help customers find perfect glasses for their lifestyle.
Business info:
- Frames from $13 USD
- Lenses: Standard (+$0), Thin & Durable (+$29), ClearView Plus (+$39), Ultra Thin (+$59), Ultra Thin Pro (+$89)
- Filters: Essential AR (+$11), Blue Light (+$18), Photochromic (+$49), Anti-Fog (+$15), Premium AR (+$24), Polarized (+$70), Fashion Tint (+$28)
- Shipping 5-7 days to USA. No insurance needed. Prescription entered in the frame configurator.
- Don't ask for prescription in chat — guide customer to choose a frame first.
- Short responses, max 3 sentences.
${contextoLimpio ? `Context: ${contextoLimpio}` : ''}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: systemPrompt,
        messages: mensajesLimpios,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic error: ${response.status}`);
    }

    const data = await response.json();
    const texto = data.content?.[0]?.text ||
      (lang === 'es' ? 'Lo siento, hubo un error.' : 'Sorry, there was an error.');

    return NextResponse.json({ texto });

  } catch (error) {
    console.error('VerlyBot error:', error);
    return NextResponse.json(
      { texto: 'Lo siento, intenta de nuevo en un momento.' },
      { status: 500 }
    );
  }
}