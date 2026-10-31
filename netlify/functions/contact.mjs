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
  const service = String(data.service || "").trim();
  const details = String(data.details || "").trim();

  if (!name || !phone || !locality || !service || !details) {
    return Response.json({ error: "Completá todos los campos obligatorios." }, { status: 400 });
  }

  if (name.length > 100 || phone.length > 40 || locality.length > 100 ||
      service.length > 120 || details.length > 3000) {
    return Response.json({ error: "Alguno de los campos supera el largo permitido." }, { status: 400 });
  }

  const token = Netlify.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = Netlify.env.get("TELEGRAM_CHAT_ID");
  if (!token || !chatId) {
    console.error("Faltan TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID.");
    return Response.json({ error: "El servicio de contacto todavía no está configurado." }, { status: 503 });
  }

  const text = [
    "🔥 NUEVA CONSULTA WEB — GASISTA MATRICULADO ZONA OESTE",
    "",
    `👤 Nombre: ${name}`,
    `📱 Teléfono: ${phone}`,
    `📍 Localidad: ${locality}`,
    `🛠 Servicio: ${service}`,
    "",
    "📝 Descripción:",
    details
  ].join("\n");

  try {
    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text })
    });

    const telegramResult = await telegramResponse.json().catch(() => ({}));
    if (!telegramResponse.ok || !telegramResult.ok) {
      console.error("Telegram rechazó el envío:", telegramResponse.status);
      return Response.json({ error: "No se pudo entregar el mensaje. Intentá nuevamente." }, { status: 502 });
    }
  } catch (error) {
    console.error("Error al contactar Telegram:", error);
    return Response.json({ error: "No se pudo conectar para enviar la consulta." }, { status: 502 });
  }

  return Response.json({ ok: true });
};