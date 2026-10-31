export default async (request) => {
  if (request.method !== "POST") {
    return Response.json({ error: "Método no permitido." }, { status: 405 });
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const name = String(data.name || "").trim();
  const phone = String(data.phone || "").trim();
  const locality = String(data.locality || "").trim();
  const email = String(data.email || "").trim();
  const message = String(data.message || "").trim();

  if (!name || !phone || !locality || !message) {
    return Response.json({ error: "Completá los campos obligatorios." }, { status: 400 });
  }

  const token = Netlify.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = Netlify.env.get("TELEGRAM_CHAT_ID");
  if (!token || !chatId) {
    console.error("Faltan TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID.");
    return Response.json({ error: "El servicio de contacto no está configurado." }, { status: 503 });
  }

  const text = [
    "🔥 Nueva consulta web — Gasista Matriculado Zona Oeste",
    "",
    `Nombre: ${name}`,
    `Teléfono: ${phone}`,
    `Localidad: ${locality}`,
    `Email: ${email || "No informado"}`,
    `Trabajo: ${message}`
  ].join("\n");

  const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text })
  });

  if (!telegramResponse.ok) {
    console.error("Telegram rechazó el envío:", telegramResponse.status);
    return Response.json({ error: "No se pudo entregar el mensaje." }, { status: 502 });
  }

  return Response.json({ ok: true });
};
