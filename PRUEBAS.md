# Evidencia y pendientes

## Ejecutado

23 pruebas Node pasan (0 fallos): validación de entradas; movimiento y límites; colisiones; cruce aéreo y orientación; aterrizaje; startup y alcance de ataques; bloqueo y retroceso; 32 poderes y recursos; ataques aéreos; victoria, empate y abandono; determinismo; predicción sin modificar daño; registro de toques breves; defensa por retroceso desde ambos lados y en el propio cuadro de impacto; salas y códigos; preparación mutua; rechazo de un tercer jugador; secuencias y estados falsificados; reanudación con rotación de token; expiración, revancha y limpieza.

Se abrió un servidor WebSocket real en localhost y dos clientes automatizados, con coincidencia del estado final. También se rechazó un origen externo no autorizado. Esto **no** prueba dos redes domésticas ni dos móviles físicos.

`pnpm audit --prod`: ningún aviso conocido devuelto para ws 8.22.0 en la consulta realizada. No equivale a una auditoría de penetración.

Verificación de sintaxis y archivos referenciados: pasa. PeerJS/CDN de señalización retirados.

## Simulación de red

Enlace fiable modelado con jitter (amplitud 35% del RTT), 3% de eventos con retraso adicional de 120 ms y conservación del orden para aproximar bloqueos de retransmisión TCP. No es una captura ni una emulación real de paquetes de una red móvil.

| RTT configurado | Confirmación media de entrada | Percentil 95 | Resultado final |
|---|---|---|---|
| 30 ms | 53 ms | 117 ms | Coincide |
| 80 ms | 107 ms | 183 ms | Coincide |
| 150 ms | 181 ms | 267 ms | Coincide |
| 250 ms | 283 ms | 383 ms | Coincide |

Detalles reproducibles: tests/network.test.cjs. Reporte generado: artifacts/network-simulation.json.

## Revisión visual realizada

Vista del navegador integrado Chromium en 390×844 y 844×390; no son dispositivos Android/iPhone. Se observó práctica, cuadros de salto, barras y botones circulares. La versión de controles unificados muestra solo joystick y seis botones de ataque. Captura: artifacts/controles-unificados.png. Sin avisos/error de consola en esa revisión. Se observaron 60 FPS en una captura de práctica; durante carga también hubo mediciones inferiores. No se garantiza 60 FPS en teléfonos.

El navegador integrado se reinició durante la sesión. No quedó aislada la causa; está pendiente una prueba prolongada de estabilidad y memoria. No se atribuye ni se descarta una causa del juego sin evidencia.

## Criterios pendientes de verificación

- URL pública y HTTPS/WSS de producción.
- Creación, unión, preparación, combate y revancha en el despliegue público.
- Dos móviles físicos desde redes distintas.
- Safari/iOS y Chrome/Android físicos, multitáctil real y cambios de orientación.
- Desconexión real de Wi-Fi/datos y reanudación en móviles.
- Perfil de memoria, batería y FPS sostenidos en móviles de gama media.
- Cuotas y plan gratuito de la cuenta donde se despliegue.

No se declara completamente operativo hasta verificar estos puntos o documentar expresamente los que permanezcan sin comprobar.
