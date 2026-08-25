// app/api/admin-auth/route.ts
// Login del panel admin RETIRADO. La administración se hace desde OptiOS.
// Este endpoint ya no autentica ni pone cookies.
import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ error: 'Panel retirado. Usa OptiOS.' }, { status: 410 });
}

export async function DELETE() {
  return NextResponse.json({ ok: true });
}
