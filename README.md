# Aguante · Barrio Fighters

Juego de lucha 2D original para navegador. Ocho personajes, siete escenarios, tres especiales y una ulti por personaje. Rondas de 60 segundos, 100 de vida, mejor de tres.

## Estado real de entrega

La implementación y 23 pruebas automatizadas locales pasan. Se preparó un servidor autoritativo Node/WebSocket y el despliegue Render Free. **No hay despliegue público confirmado todavía.** Render está conectado y el propietario autorizó el espacio «Lautaro dominguez». Está pendiente conectar GitHub y subir el repositorio para que Render pueda descargarlo. No se presenta una URL localhost como enlace público.

## Jugar

En la web definitiva: elegir personaje y apodo opcional, crear sala, compartir el código de 12 caracteres, entrar desde el otro teléfono y confirmar ESTOY LISTO en ambos. Cuenta atrás de tres segundos. Revancha por acuerdo de los dos.

- Joystick arriba: salto vertical. Diagonales superiores: salto hacia un lado.
- Izquierda/derecha: caminar. Abajo: agacharse. Retroceder respecto al rival: cubrir un impacto automáticamente mientras se camina hacia atrás. La dirección cambia al cruzar al adversario.
- No hay botones táctiles separados de salto ni guardia.
- Golpe y patada cargan energía. P1/P2/P3 tienen recarga; ULTI consume 100 y causa 32 de daño antes del bloqueo.
- Teclado: A/D mover, W saltar, S guardia, J/K ataques, U/I/O especiales, L ulti.
- Audio grabado tras el primer toque; frases propias de Lautaro y Patricio en pantalla.

## Ejecutar y comprobar el código

Node 22 o superior y pnpm 11.25.0. `pnpm install --frozen-lockfile`, `pnpm build`, `pnpm verify`, `pnpm test`, `pnpm start`.

El servidor sirve frontend y `/socket` desde el mismo origen. Puerto local 8787; producción usa PORT del proveedor. `/healthz` es la comprobación de salud. En Render, HTTPS/WSS los termina el proxy del proveedor; no se inventan certificados locales.

El frontend Sites puede configurarse con una URL WSS externa en dist/config.json. Actualmente ese archivo tiene websocket:null para no fingir una conexión disponible. El servidor Node responde su propia configuración same-origin y funciona localmente.

## Arquitectura

- dist/engine.js: simulación pura, paso fijo 60 Hz, estados, hitboxes, recursos y rondas. No contiene DOM, reloj del navegador ni azar de combate.
- server/rooms.cjs: salas, sesiones, secuencias, preparación, reconexión y TTL.
- server/index.cjs: HTTP/WebSocket, validación de origen, límites, tamaño de mensajes y métricas locales.
- dist/client.js: menú, transporte, predicción visual del movimiento propio e interpolación del rival.
- dist/arcade.js, animation.js, controls.js y voices.js: dibujo, cuadros de animación, joystick/anillos y audio.
- dist/input-buffer.js: conserva pulsaciones breves hasta una actualización. El servidor conserva sus eventos hasta el siguiente paso elegible.

Solo el servidor acepta entradas y calcula daño/resultado. Modificar vida en el navegador altera únicamente esa presentación. No se implementa ni anuncia rollback competitivo. A RTT elevado, los impactos se confirman con retraso real: no se oculta esa limitación.

## Seguridad y privacidad

Códigos aleatorios de unos 60 bits y tokens de reanudación de 256 bits. Los tokens se envían solo al cliente propietario por WebSocket y se conservan en memoria; no en URLs, archivos o registros. Reanudación hasta 20 segundos tras una caída de transporte; recargar la página pierde la sesión local. Los reinicios del servidor pierden las salas, que no son una base de datos permanente.

Máximo dos jugadores por sala, 100 salas, seis conexiones por IP, tamaño de mensaje 2048 bytes, límites de entradas e intentos, e ignorado de secuencias duplicadas o antiguas. Las salas inactivas caducan. Los apodos se validan y se muestran como texto. Los secretos de infraestructura se gestionan mediante las conexiones del propietario, nunca en el repositorio.

## Publicación preparada

render.yaml selecciona **plan: free**. No se configuró tarjeta, facturación automática ni instancia de pago. Render puede dormir tras 15 minutos sin tráfico, tardar alrededor de un minuto en despertar y reiniciarse; las cuotas gratuitas pueden suspender el servicio. La cuenta y cuotas del propietario deben verificarse al desplegar. Un único servidor sirve el juego completo y evita que jugadores deban registrarse.

Fuentes oficiales: https://render.com/docs/free · https://render.com/docs/websocket · https://render.com/docs/faq

No se usan recursos de SNK. Créditos de audio: dist/CREDITOS.txt. El material gráfico original se conserva también en el proyecto anterior en D:.
