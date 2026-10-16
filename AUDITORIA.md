# Auditoría — 16 de octubre de 2026

Se inventariaron los archivos del juego existente en D:\OpenAI\Proyectos\2026-10-15\se\outputs\barrio-fighters y su copia de trabajo game-release. No se modificó sources/.

## Estado recuperado

- HTML, CSS y JavaScript nativos, canvas 960×500. Sin framework ni compilador de aplicación.
- Ocho personajes: Lautaro, Patricio, El Tano, La Colo, Doc Marta, El Rulo, La Nona y El Chapa.
- Siete escenarios: Villa Riosa, San Jorge/Don Torcuato, La Boca, Barracas, Constitución, Ciudad Oculta y Fuerte Apache. Interpretaciones ficticias ilustradas.
- Tres especiales y una ulti por personaje; 100 de vida, 60 segundos, mejor de tres. Frases de Lautaro y Patricio conservadas.
- Joystick, salto, agachado, guardia y botones circulares de recarga. Dibujos originales organizados en 30 cuadros por personaje (hay repetición de un cuadro para completar una secuencia).
- Audio de combate grabado, con atribuciones en dist/CREDITOS.txt. Las frases argentinas son texto, no grabaciones personalizadas.
- Repositorio Git inicializado en la copia D:, sin publicación confirmada. .openai/hosting.json conserva el proyecto Sites appgprj_6ad10bb6a4208191872e94d4457a9485. La última consulta devolvió versión 0 y ninguna URL publicada.

## Deficiencias encontradas

- PeerJS/WebRTC con STUN, sin TURN: algunas redes no conectan. El anfitrión decide todos los impactos y puede manipular el resultado.
- No hay apodos, preparación mutua ni sesión de reconexión. La partida comienza al unirse.
- Paquete PeerJS cargado desde CDN; lógica de red, combate y UI mezcladas y extendidas por sustituciones globales.
- No existen controles sólidos de secuencia, frecuencia, TTL de salas o credenciales de reanudación.
- 23,9 MB de recursos iniciales; decodificar simultáneamente ocho hojas de animación y extraer atlas bloquea el hilo principal.
- Las pruebas anteriores de combate son locales y simuladas. No prueban dos móviles en redes distintas ni Safari físico.
- Espacio muy limitado en C:, y escrituras en D: requieren permisos adicionales de Windows. El traslado de aplicaciones es un trabajo separado pendiente.

## Decisión

Conservar gráficos y presentación. Extraer una simulación pura determinista compartida con un servidor Node/WebSocket autoritativo. El cliente solo envía entradas y elecciones; la vida, impactos, rondas y ganador se calculan en el servidor. Predicción visual de movimiento local e interpolación del rival; no se anuncia rollback competitivo.

Render Free admite Node y WebSockets; duerme tras 15 minutos sin tráfico, puede reiniciarse y ofrece 750 horas por mes y espacio de trabajo. Requiere una cuenta del propietario para desplegar. No se configura tarjeta ni plan de pago. Cloudflare Durable Objects es una alternativa gratuita con cuotas pero exige cuenta y bindings no expuestos por el flujo Sites actual. Las funciones de Vercel no son un servidor WebSocket persistente. Sites se conserva como frontend; también se prepara el servidor para servir todo desde el mismo origen en Render.

Fuentes oficiales verificadas:
- https://render.com/docs/free
- https://render.com/docs/websocket
- https://render.com/docs/faq
- https://developers.cloudflare.com/durable-objects/platform/pricing/
- https://vercel.com/kb/guide/do-vercel-serverless-functions-support-websocket-connections

Ninguna prueba de pestañas locales se presentará como prueba de dispositivos físicos ni de redes domésticas distintas.
