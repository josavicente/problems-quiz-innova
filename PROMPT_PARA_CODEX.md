# Instrucción inicial para Codex

Quiero construir una aplicación web interactiva para ayudar a un niño de 3r de Primària a practicar problemas matemáticos contextualizados **en catalán**.

**Antes de escribir código**, lee los archivos adjuntos:
- `PRD_Matematiques_Interactives_3r.md` (requisitos, experiencia, decisiones, criterios de aceptación).
- `problems.seed.json` (fuente de verdad de 30 problemas: 5 niveles × 6).

## Objetivo inmediato

Implementa un MVP usable con React + TypeScript + Vite. Todo el contenido dirigido al menor debe estar en catalán. La web debe ser responsive y accesible, sin autenticación, backend ni APIs de IA.

## Reglas que no se negocian

1. Priorizar comprensión del problema, representación, razonamiento, cálculo y comprobación; **no** convertir la aplicación en un test de cálculo rápido.
2. Mostrar 3 pistas escalonadas, sin revelar la solución con el primer error.
3. Validar de forma determinista la respuesta final, pero **no penalizar métodos alternativos válidos**.
4. Implementar una línea numérica vacía con saltos positivos/negativos y edición/deshacer. Modelos interactivos de barras, rectángulos y reparto para sus respectivos casos.
5. No copiar marcas, ilustraciones o interfaz de Innovamat; usar recursos originales.
6. Guardar progreso en `localStorage` con control para reiniciarlo.
7. Incluir tests automáticos de datos (todos los cálculos), lógica, y al menos un flujo E2E.
8. Mantener la estructura separada entre contenido, dominio pedagógico y componentes visuales.

## Modo de trabajo

- Haz una primera lectura del PRD y propón una secuencia de implementación de hitos pequeños.
- Empieza construyendo base del proyecto, tipos, carga de datos y tests de contenido.
- Continúa con navegación entre niveles, resolución, pistas, feedback y progreso.
- Después implementa los modelos visuales y su edición.
- Finalmente revisa responsive, accesibilidad, tests y flujo completo.
- Si detectas una incoherencia pedagógica o un ejercicio ambiguo, arréglalo de forma explícita e informa del cambio; **no** corrijas silenciosamente una solución inventando datos.
- Documenta instalación, ejecución, pruebas, decisiones técnicas y cualquier limitación de la versión.

## Entrega mínima esperada

- Proyecto ejecutable con `npm install`, `npm run dev`, `npm run test`, `npm run build`.
- 5 niveles, 6 problemas cada uno.
- Flujo de inicio → problema → pistas/modelos → respuesta → feedback → siguiente → resumen.
- Persistencia local y opción de reset.
- Componentes pedagógicos reutilizables y pruebas de las operaciones.
- README que indique qué está terminado y qué queda pendiente.

**Importante:** no sacrifiques la usabilidad real de los modelos visuales para incorporar gamificación estética. Las representaciones deben ayudar a pensar y funcionar de verdad.
