const procesarRespuesta = async (texto: string) => {
  agregarMensaje('px', texto);
  setOpciones([]);
  cambiarExpresion('pensando', 2000);

  const historial = [...mensajes, { de: 'px', texto }].map(m => ({
    role: m.de === 'verly' ? 'assistant' : 'user',
    content: m.texto,
  }));

  const contexto = `Página actual: ${window.location.pathname}. ${sesion.nombre ? `Cliente: ${sesion.nombre}.` : ''} ${sesion.tipoCara ? `Cara: ${sesion.tipoCara}.` : ''}`;

  try {
    const res = await fetch('/api/verly', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: historial, lang, contexto }),
    });
    const data = await res.json();
    agregarMensaje('verly', data.texto);
    cambiarExpresion('feliz', 2000);
  } catch {
    agregarMensaje('verly', lang === 'es' ? 'Lo siento, hubo un error.' : 'Sorry, there was an error.');
  }
};