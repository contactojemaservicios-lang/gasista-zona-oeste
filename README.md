# Gasista Matriculado Zona Oeste

Sitio web estático de Gasista Matriculado Zona Oeste.

## Estructura

- `index.html`: página principal.
- `netlify/functions/contact.mjs`: recepción de consultas y envío a Telegram.
- `netlify.toml`: configuración de publicación en Netlify.

## Configuración en Netlify

Definir las variables de entorno `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID` con alcance para Functions. No guardar secretos en el repositorio.

El sitio publica desde la raíz del repositorio y utiliza la rama `main`.
