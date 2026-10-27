# PRD — Matemàtiques contextualitzades: web interactiva per a 3r de Primària

**Versió:** 1.0 · **Data:** 27/10/2026 · **Estat:** Brief per a implementació amb Codex  
**Idioma d'aquest PRD:** castellà · **Idioma de la interfície i els exercicis:** català (`ca-ES`).

## 0. Resumen ejecutivo

Construir una web infantil, sin registro y usable desde móvil, tableta y ordenador, para practicar **problemas matemáticos contextualizados de 3r de Primària** con un enfoque centrado en **comprender, representar, razonar, calcular y comprobar**. La app debe ayudar al niño a resolver, no sustituir su razonamiento: muestra pistas graduales y modelos visuales interactivos (línea numérica vacía, barras, rectángulos y repartos), pero permite encontrar caminos alternativos.

**Alcance MVP:** 5 niveles × 6 problemas = **30 problemas**, todos en catalán, con enunciado, respuesta numérica, unidad, 3 pistas, pasos de solución y estrategia visual sugerida. El banco validado se entrega en `problems.seed.json`.

**Principio de diseño:** práctica tranquila, autónoma y comprensible; nada de rankings, límite de tiempo, anuncios ni diseños que penalicen el error.

## 1. Origen: decisiones extraídas de la conversación

### Confirmado expresamente por el usuario
1. El material de referencia es una ficha titulada **«Situacions contextualitzades» de 3r de Primària**, escrita en catalán.
2. El usuario pidió **10 problemas del mismo estilo**: pequeñas historias cercanas al día a día, preguntas claras, cálculos adecuados para el curso y espacio para responder.
3. Después solicitó **las soluciones explicadas con estrategias asociadas a Innovamat**, no solo el resultado.
4. Finalmente solicitó **una web interactiva con distintos niveles y 5–6 problemas por nivel** y un informe utilizable con Codex.

### Material ya trabajado, reutilizado como semilla
Los diez problemas del hilo se distribuyen así:

| Problema original | ID del banco |
|---|---|
| Dies de pluja | `L3-01` |
| Parada de fruita | `L2-01` |
| Pilotes de l'escola | `L3-02` |
| Biblioteca | `L3-03` |
| Llapis de colors | `L4-01` |
| Pastisseria | `L4-02` |
| Entrades del cinema | `L3-04` |
| Excursió en bicicleta | `L3-05` |
| Col·lecció de cromos | `L5-01` |
| Torneig de futbol | `L5-02` |

### Suposiciones de producto propuestas (no decisiones previas del usuario)
- Cinco niveles de seis ejercicios cada uno para un MVP cerrado y fácil de evaluar.
- Sin autenticación ni servidor en V1; progreso local en el dispositivo.
- Avance orientativo al siguiente nivel con **4/6 problemas resueltos correctamente**, sin penalización por pistas ni bloqueo irreversible.
- React + TypeScript + Vite como solución ligera, desplegable de forma estática.
- Interacción visual guiada en vez de un motor capaz de entender cualquier procedimiento matemático escrito libremente.

Estas elecciones facilitan empezar rápido y son reversibles.

## 2. Problema y objetivos

### Problema del usuario
En papel, los problemas se resuelven con números y dibujos, pero no hay ayuda instantánea ni una manera cómoda de practicar repetidamente y visualizar estrategias variadas. Una app que pida únicamente el número correcto se convertiría en un test de cálculo y **no alcanzaría el objetivo pedagógico**.

### Objetivos
- Practicar la interpretación de enunciados en catalán.
- Relacionar datos, pregunta y operaciones mediante modelos visuales.
- Consolidar sumas, restas, dobles, mitades, multiplicaciones y repartos.
- Dar autonomía sin desincentivar el ensayo, el error ni las estrategias alternativas.
- Facilitar al adulto ver qué habilidades necesitan más práctica sin etiquetar o diagnosticar al niño.

### No objetivos (MVP)
- Reproducir la interfaz, recursos, marca o contenidos licenciados de Innovamat.
- Ofrecer tutoría abierta de IA ni generar problemas mediante IA en producción.
- Reconocimiento de escritura manual u OCR.
- Calificar la calidad de cualquier razonamiento escrito libremente.
- Cuentas infantiles, seguimiento entre dispositivos, ranking social o pagos.
- Currículum escolar completo, más allá de problemas contextualizados del ámbito definido.

## 3. Público y contexto de uso

**Usuario principal:** niño/a de aproximadamente 8–9 años de 3r de Primària que lee catalán y ya trabaja operaciones básicas.  
**Usuario secundario:** adulto que acompaña la práctica desde casa o el aula.

**Sesión ideal:** un nivel de 6 problemas, realizado sin cronómetro ni obligación de completarlo de una vez.  
**Dispositivos:** tableta y ordenador prioritarios; móvil con adaptación responsive.  
**Accesibilidad:** texto legible (preferiblemente ≥18 px en lectura principal), contraste suficiente, botones grandes, navegación por teclado, foco visible, soporte de lector de pantalla, sin dependencia exclusiva del color y controles compatibles con tacto.

## 4. Progresión de contenido

| Nivel | Nombre visible (catalán) | Conceptos | Problemas |
|---|---|---|---:|
| 1 | **Sumem i restem** | Una operación; números en torno a 0–100; saltos y descomposición | 6 |
| 2 | **Dobles, meitats i complements** | El doble, la mitad y diferencias hasta una cantidad objetivo | 6 |
| 3 | **Problemes de dos passos** | Sumas y restas combinadas con cantidades del orden de 120–130 | 6 |
| 4 | **Multipliquem i repartim** | Grupos iguales, modelo rectangular y repartos exactos | 6 |
| 5 | **El repte final** | Mezcla de operaciones; dos pasos y algunos retos de tres pasos | 6 |

**Contenido:** importación desde `problems.seed.json`, fuente única de la verdad. No incrustar enunciados y respuestas dentro de componentes UI.

**Criterio de progresión propuesto:** el siguiente nivel se recomienda tras acertar al menos 4 de sus 6 problemas; mostrar `Dominat` con 5–6 aciertos y `Segueix practicant` con menos. Las pistas no restan puntos. Permitir reintentar respuestas erróneas y repetir niveles sin castigo. El adulto puede abrir niveles si necesita ajustar el recorrido. **No confundir aciertos con dominio profundo del razonamiento**: el dato es solo una señal de práctica.

## 5. Experiencia de usuario: flujo principal

1. **Inicio.** Cabecera `Matemàtiques per pensar`; tarjetas de niveles con nombre, icono, progreso y CTA `Comença` / `Continua`.
2. **Pantalla de problema.** Indicador discreto `Problema 2 de 6`, enunciado y pregunta, ilustración simple opcional, botón `Què sabem?`, zona para responder, botón `Comprova`, botón `Necessito una pista`.
3. **Comprensión.** Al pulsar `Què sabem?`, resaltar datos y pregunta; evitar indicar inmediatamente la operación.
4. **Representación.** Acceso a una herramienta visual sugerida, pero con selector para cambiar entre `Línia numèrica`, `Barres`, `Files i columnes` y `Repartiment` cuando tengan sentido.
5. **Resolución.** El niño introduce su respuesta numérica; la UI deja clara la unidad sin obligar a escribirla literalmente. Puede usar el modelo para explorar.
6. **Feedback.** `Molt bé! Com ho has pensat?` al acertar, más una explicación opcional desplegable. Si falla: `Revisa les dades. Vols una pista?`, sin revelar la respuesta ni restar puntos.
7. **Ayuda escalonada.** Tres pistas: comprender el contexto, elegir modelo/paso, ejemplo de cálculo próximo a la solución. Después, botón explícito `Veure una possible solució`, sin presentar el método como el único válido.
8. **Cierre de nivel.** Resumen de resultados, habilidades practicadas, problemas para revisar y acciones `Torna-ho a provar` / `Següent nivell`.
9. **Persistencia.** Guardar automáticamente nivel, problema actual, intentos, pistas usadas y completados. Disponer de `Reinicia el progrés` detrás de confirmación.

**Textos de interacción:** todo lo visible al menor va en catalán. El adulto puede leer información funcional simple en catalán en la V1; no es necesario multilenguaje.

## 6. Herramientas de representación visual

### A. Línia numèrica buida (`numberLine`)
- Mostrar un punto inicial y la posibilidad de añadir un **salto con etiqueta** (`+10`, `−5`, etc.).
- Cada salto cambia el punto final mostrado; salto positivo a la derecha y negativo a la izquierda.
- Permitir borrar/deshacer saltos y proponer alternativas (`−20 +1` en vez de `−19`).
- En modo ayuda, reproducir paso a paso los saltos de la explicación.
- Para un MVP se puede utilizar SVG con distancias visuales aproximadas/no estrictamente proporcionales, pero **orden y signo siempre matemáticamente coherentes**.

### B. Barres (`barModel`)
- Representar `todo` y `partes iguales` para dobles/mitades.
- Mostrar el 84 como 2 bloques iguales, permitir explorar la división en dos mitades.
- No usar el esquema para insinuar incorrectamente que 84 taronges y 42 pomes son objetos a sumar: son cantidades comparadas.

### C. Files i columnes (`array`)
- Rejilla con filas × columnas para multiplicar.
- Permitir dividir visualmente una dimensión: `6 × (5 + 3)`.
- Evitar producir cuadrículas enormes en pantallas móviles; bloques simplificados si hace falta.

### D. Repartiment (`groups`)
- Mostrar objetos como fichas neutras y contenedores, repartibles mediante interacción sencilla.
- Modo manual para cantidades pequeñas; para grandes, añadir acciones de reparto por lotes, sin exigir 72 arrastres.
- Presentar igualdad entre grupos y relación con multiplicación inversa.

### E. Problema mixto (`mixed`)
- Organizar en pasos `Primer... / Després...`, combinando dos modelos si procede.
- El niño decide qué calcular primero; el sistema solo valida los pasos propuestos si el ejercicio lo pide de manera explícita.

**Punto crítico:** **no validar un procedimiento como incorrecto solo porque sus saltos o agrupaciones son distintos de los de la solución de referencia**. En MVP se validará el resultado numérico final y la coherencia matemática básica de cada manipulación; la explicación guiada es una posibilidad, no la única.

## 7. Catálogo inicial de problemas

La redacción, soluciones detalladas, unidades, estrategias y tres pistas por ítem están en `problems.seed.json`.

| ID | Nombre | Respuesta |
|---|---|---|
| `L1-01` | Els adhesius | **43 adhesius** |
| `L1-02` | Les bales | **42 bales** |
| `L1-03` | Els llibres nous | **62 llibres** |
| `L1-04` | Les pomes | **45 pomes** |
| `L1-05` | Les entrades del museu | **63 entrades** |
| `L1-06` | L’autobús | **43 persones** |
| `L2-01` | La parada de fruita | **42 pomes** |
| `L2-02` | La capsa de cromos | **36 cromos** |
| `L2-03` | L’hort de l’escola | **25 flors** |
| `L2-04` | Les galetes | **48 galetes** |
| `L2-05` | Les entrades de la festa | **52 entrades** |
| `L2-06` | Els cromos d’en Nil | **58 cromos** |
| `L3-01` | Els dies de pluja | **13 dies** |
| `L3-02` | Les pilotes de l’escola | **45 pilotes** |
| `L3-03` | La biblioteca | **71 llibres** |
| `L3-04` | El cinema | **37 entrades** |
| `L3-05` | L’excursió en bicicleta | **61 quilòmetres** |
| `L3-06` | Les cadires del concert | **47 cadires** |
| `L4-01` | Els llapis de colors | **48 llapis** |
| `L4-02` | La pastisseria | **8 magdalenes** |
| `L4-03` | La sala d’actes | **45 cadires** |
| `L4-04` | Les cartes | **8 cartes** |
| `L4-05` | Les cistelles | **48 mandarines** |
| `L4-06` | Els blocs de construcció | **7 blocs** |
| `L5-01` | La col·lecció de cromos | **28 cromos** |
| `L5-02` | El torneig de futbol | **33 jugadors** |
| `L5-03` | Els retoladors | **27 retoladors** |
| `L5-04` | Les bosses de mandarines | **24 mandarines** |
| `L5-05` | El torneig escolar | **43 jugadors** |
| `L5-06` | Les galetes de la festa | **7 galetes** |

## 8. Modelo de datos y reglas del motor

Cada problema incluye:

```ts
type VisualModel = 'numberLine' | 'barModel' | 'array' | 'groups' | 'mixed';

type Problem = {
  id: string;                    // Ej. L3-01
  level: 1 | 2 | 3 | 4 | 5;
  title: string;                 // Catalán
  statement: string;             // Catalán
  question: string;              // Catalán
  answer: { value: number; unit: string };
  steps: Array<{ expression: string; result: number }>;
  strategies: string[];
  visualModel: VisualModel;
  hints: [string, string, string];
  workedSolution: string;
};

type Attempt = {
  problemId: string;
  answerInput: string;
  correct: boolean;
  hintsUsed: number;
  createdAt: string;             // ISO timestamp
};

type ProgressV1 = {
  schemaVersion: 1;
  currentProblemId?: string;
  attempts: Attempt[];
  completedProblemIds: string[];
};
```

**Reglas:**
- Validar respuesta con conversión numérica segura de entrada: aceptar `42` o espacios exteriores; rechazar texto extra, respuestas vacías y caracteres no numéricos. No exigir la unidad textual.
- La puntuación de un problema es correcta si **algún intento final** fue correcto; preservar el número de intentos en el historial local.
- Respuesta y solución deben mantenerse separados de la vista hasta acierto o petición explícita de ver solución.
- La validación es exacta y determinista. No usar modelos de IA para calcular ni calificar.
- **Nunca evaluar dinámicamente expresiones provenientes de usuarios ni usar `eval()`**. Las `steps` son datos de contenido confiable, no código ejecutable; pueden renderizarse como texto o validarse en pruebas offline mediante un parser controlado.
- Versionar `localStorage` (`math-practice:v1`) y proveer tolerancia a datos inválidos/corruptos.
- El nivel 5 contiene ejercicios mixtos de 3 pasos. El motor debe aceptar arrays de pasos de longitud variable.

## 9. Pantallas y componentes sugeridos

```text
src/
  app/
    App.tsx
    routes.tsx
  components/
    LevelCard.tsx
    ProblemCard.tsx
    AnswerInput.tsx
    HintPanel.tsx
    Feedback.tsx
    LevelSummary.tsx
    visual/
      NumberLine.tsx
      BarModel.tsx
      ArrayModel.tsx
      GroupModel.tsx
      MixedModel.tsx
  data/
    problems.seed.json
  domain/
    types.ts
    validation.ts
    progress.ts
    levels.ts
  hooks/
    useProgress.ts
  styles/
    index.css
  tests/
    problems.test.ts
    validation.test.ts
    progress.test.ts
    accessibility.test.tsx
  e2e/
    core-flow.spec.ts
```

**Stack recomendado:** React + TypeScript + Vite + CSS moderno (Tailwind opcional) + SVG para representaciones; Vitest + Testing Library + Playwright. Hospedaje estático en Vercel, Netlify o similar. No es necesario backend para esta versión.

## 10. Requisitos funcionales priorizados

| Prioridad | ID | Requisito |
|---|---|---|
| P0 | RF-01 | Catálogo de 5 niveles y 6 problemas en catalán por nivel |
| P0 | RF-02 | Navegación, reanudación y avance de problemas |
| P0 | RF-03 | Entrada y validación determinista de respuesta |
| P0 | RF-04 | Tres pistas secuenciales y solución opcional |
| P0 | RF-05 | Progreso local persistente y resumen por nivel |
| P0 | RF-06 | Herramienta funcional de línea numérica con saltos editables |
| P0 | RF-07 | Modelos de barras, cuadrículas y reparto con interacción sencilla |
| P0 | RF-08 | Accesibilidad básica y diseño responsive |
| P0 | RF-09 | Tests de resultados, lógica y flujo principal |
| P1 | RF-10 | Panel sencillo de acompañamiento para adultos |
| P1 | RF-11 | Texto leído en voz alta usando voz del dispositivo, bajo control del usuario |
| P1 | RF-12 | Proponer ejercicios fallados para repasar sin repetir los acertados |
| P2 | RF-13 | Nuevas colecciones temáticas y dificultad adaptable |
| P2 | RF-14 | Perfiles locales en un mismo dispositivo y exportación de progreso |

## 11. Requisitos no funcionales y privacidad

- **Privacidad:** no pedir nombre real, edad exacta, email, ubicación ni imágenes; no enviar respuestas a terceros; sin cuentas ni analítica de terceros por defecto. Si se añade sincronización o analítica, hacer una revisión específica de privacidad y consentimiento antes del despliegue.
- **Seguridad:** sin HTML sin sanear ni ejecución de fórmulas arbitrarias; dependencias mínimas; evitar exponer datos personales inexistentes.
- **Rendimiento:** arranque ágil en tabletas habituales; assets ligeros; precarga del siguiente problema para evitar esperas.
- **Disponibilidad:** funcionamiento sin backend. Una PWA instalable/offline puede quedar para una iteración si no complica el MVP.
- **Diseño:** amable y sobrio; sin efectos distractores, cronómetro, rachas obligatorias o recompensas que desplacen el aprendizaje.
- **Accesibilidad:** cumplir prácticas WCAG 2.2 AA para controles y contenido en lo razonable; todos los modelos visuales deben tener descripción textual equivalente.

## 12. Analítica y medida de éxito

Para V1, recoger únicamente en el dispositivo:
- Problemas completados por nivel.
- Respuestas acertadas a la primera y tras nuevos intentos.
- Número de pistas solicitadas por tema o modelo.
- Ejercicios que el niño abandona o repite.

**Cuidado en la interpretación:** acertar tras una pista sigue siendo un progreso. Un fallo no demuestra desconocimiento y una respuesta correcta no acredita por sí sola comprensión profunda. Evitar rankings y comparaciones sociales.

## 13. Criterios de aceptación para el MVP

1. En la pantalla inicial aparecen **5 niveles y exactamente 6 ejercicios distintos por nivel**.
2. El contenido infantil está completamente en catalán y puede utilizarse sin cuenta.
3. Los 30 ejercicios tienen respuesta numérica, unidad, tres pistas y solución explicada.
4. Se validan correctamente los 30 resultados; el catálogo supera tests de consistencia.
5. Al fallar, no se revela automáticamente el resultado; se puede reintentar y consultar pistas.
6. Las pistas se muestran en orden y no penalizan la puntuación.
7. El niño puede resolver correctamente un problema aunque utilice un camino diferente al ejemplo.
8. La línea numérica permite introducir o seleccionar saltos positivos/negativos, editar y deshacer.
9. Los modelos visuales de multiplicación, mitades y reparto representan correctamente los números del catálogo.
10. Cambiar de pantalla, recargar o cerrar/reabrir el navegador conserva progreso en el mismo dispositivo.
11. Reiniciar el progreso requiere confirmación y funciona.
12. Se puede completar un nivel con ratón, teclado o interacción táctil, sin bloquear el uso de lector de pantalla.
13. Funciona en anchos de pantalla representativos de móvil, tableta y escritorio.
14. No hay servicios externos necesarios para enviar/verificar una respuesta.
15. El flujo completo está cubierto por al menos una prueba E2E, además de tests unitarios de dominio.

## 14. Roadmap de construcción con Codex

**Fase 0. Base técnica y contenido.** Crear Vite + React + TypeScript, añadir catálogo, validador del esquema y pruebas automáticas para las 30 respuestas. Entregable: home con niveles y datos coherentes.

**Fase 1. Flujo de práctica.** Pantalla de ejercicio, campo de respuesta, pistas escalonadas, feedback, solución expandible, navegación, localStorage y cierre de nivel. Entregable: experiencia completa sin modelos visuales sofisticados.

**Fase 2. Laboratorio visual.** SVG de línea numérica editable y modelos de barra, cuadrícula y reparto; integración de cada uno con ejercicios apropiados. Entregable: manipulación que ayude a pensar y no se limite a una animación decorativa.

**Fase 3. Calidad.** Tests de UI/E2E, responsive, teclado, accesibilidad, revisar microcopys en catalán y desplegar una preview. Entregable: MVP enseñable y testeable con un adulto y un niño.

**Fase 4 (opcional).** Reforzar temas difíciles, PWA, lectura en voz alta y opciones locales para varias personas.

## 15. Riesgos y trade-offs

| Decisión | Ventaja | Contra | Por qué es asumible |
|---|---|---|---|
| Catálogo cerrado de 30 | Calidad controlada, dificultad progresiva | Se agota tras repetir mucho | Permite validar aprendizaje real antes de generar contenido nuevo |
| Sin backend | Rápido, barato y privado | Progreso restringido al navegador | Encaja con un MVP doméstico y se puede migrar después |
| Validar resultado, no trazos libres | Comportamiento fiable | No mide razonamiento completo | Se compensa con modelos interactivos, preguntas de reflexión y observación del adulto |
| Inspiración pedagógica, sin clonación | Independencia de licencia y marca | No hay equivalencia con Innovamat | Se preservan principios de sentido numérico sin copiar materiales |
| 5 niveles graduales | Camino claro | Diferentes alumnos progresan a distinta velocidad | Repetición libre y accesos ajustables por adulto |

## 16. Fuentes orientativas para el enfoque pedagógico

Referencias públicas sobre estrategias didácticas, **no material para copiar visualmente o de manera literal**:
- Innovamat, **«La suma: claus i estratègies per aconseguir comprensió i fluïdesa»** (13/03/2025): https://www.innovamat.com/ca/blog/suma-estrategies-fluidesa-comprensio/
- Innovamat, **«Recursos de numeració i càlcul per a mestres»**: https://www.innovamat.com/ca/recursos-formatius-de-numeracio-i-calcul/
- Innovamat, **«Estrategias Cálculo Aritmético en Primaria»**: https://www.innovamat.com/blog/estrategias-calculo-aritmetico-innovamat/

El producto propuesto **no tiene afiliación con Innovamat**. No utilizar su logotipo, tipografía, ilustraciones, materiales originales o nombres comerciales como marca propia.

## 17. Definición de terminado y primer corte

Se considera listo para prueba doméstica cuando se puede: abrir la web, elegir un nivel, resolver cualquiera de los 30 problemas, pedir pistas, manipular los modelos relevantes, ver una explicación, retomar tras recargar y terminar un nivel con resumen; y cuando los tests automatizados pasan.

**Orden recomendado a Codex:** primero asegurar contenido + recorrido + feedback; después construir interacciones visuales. Una recta numérica correcta y usable aporta más valor que muchos efectos gráficos sin función pedagógica.
