---
trigger: always_on
---

1. Expresividad a través del Tipado
Contexto sobre verbosidad: Aprovechar la inferencia de tipos de los lenguajes modernos para evitar nombres de variables redundantes (ej. evitar nameString, usar name: string).
Tipos precisos: Definir tipos explícitos para valores escalares cuando sea necesario evitar ambigüedades (ej. diferenciar entre id numérico y cantidad aunque ambos sean números).
Evitar genéricos vacíos: No usar sufijos como Info, Data o List si el tipo ya describe la estructura.

2. Funciones y Separación de Intereses
Nivel de abstracción único: Cada función debe operar en un solo nivel de abstracción.
Separación estricta: Distinguir claramente entre código de Negocio (lógica pura), Datos (acceso/fetch) y Presentación (UI/Consola). No mezclarlos en la misma función.
Extracción: Si una función realiza validaciones, cálculos y llamadas a API, debe dividirse en funciones más pequeñas y reutilizables.

3. Inmutabilidad por Defecto
Evitar mutación directa: En lugar de modificar objetos o arrays existentes (ej. lista.push(item)), preferir la creación de nuevas copias con los cambios aplicados (ej. [...lista, item]).
Ventajas: Facilita el rastreo de cambios de estado y evita efectos secundarios difíciles de depurar, especialmente en aplicaciones concurrentes o reactivas.

4. Manejo de Errores: "Fail Fast" (Fallar Rápido)
Programación Asertiva: Validar las condiciones críticas al inicio de la función. Si algo está mal, detener la ejecución inmediatamente (lanzar error o retornar) en lugar de anidar múltiples if/else.
Visibilidad: No ocultar los errores. Registrar el error (logging) para el desarrollador y, crucialmente, informar al usuario final de que algo ocurrió, evitando estados inconsistentes en la aplicación.

5. Documentación y Comentarios Modernos
Autodocumentación: El código debe ser lo suficientemente claro para no requerir comentarios que expliquen qué hace.
El "Por Qué" y los "Edge Cases": Reservar los comentarios únicamente para explicar decisiones de diseño complejas, razones de negocio no obvias o casos borde (edge cases) específicos.
Uso de Docstrings: Utilizar estándares como JSDoc (o equivalentes en otros lenguajes) para documentar interfaces públicas, aprovechando que los IDEs modernos muestran esta info al pasar el mouse.

6. Testing de Comportamiento
Enfoque en el usuario: Las pruebas deben verificar el comportamiento observable por el usuario (o consumidor de la API), no la implementación interna.
Resistencia al refactor: Un buen test no debería romperse si cambias el nombre de una función privada, siempre y cuando el resultado final (el comportamiento) siga siendo el mismo.

7. Simplicidad (KISS, YAGNI, DRY) Actualizada
DRY (Don't Repeat Yourself): Abstraer lógica repetida en funciones, módulos, componentes reutilizables.
YAGNI (You Aren't Gonna Need It): No implementar funcionalidades o abstracciones complejas "por si acaso". Resolver el problema actual de la forma más sencilla.
KISS (Keep It Simple, Stupid): Ante dos soluciones que funcionan, elegir siempre la que tenga menor complejidad cognitiva.