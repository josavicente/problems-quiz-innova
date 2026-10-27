# Matemàtiques per pensar

Una aplicación web para practicar problemas contextualizados de 3.º de Primaria. Ofrece 60 ejercicios en cinco niveles, en catalán por defecto y castellano como alternativa. No requiere cuenta ni servidor para comprobar respuestas.

La versión inicial es la **0.1.0**; los cambios se resumen en [CHANGELOG.md](CHANGELOG.md) y en el apartado de novedades de la pantalla de inicio.

## Ejecutar

Se necesita Node.js 20 o posterior y npm.

```sh
npm install
npm run dev
```

Abre la dirección local que muestra Vite. El proyecto también puede construirse para alojamiento estático con `npm run build`; los archivos resultantes están en `dist/`.

## Verificar

```sh
npm run typecheck
npm run test
npx playwright install chromium webkit
npm run test:e2e
npm run build
```

Las pruebas del catálogo comprueban la distribución, las traducciones presentes y las operaciones mediante un parser limitado. Las pruebas de navegador comprueban práctica, idioma, persistencia, resumen y reinicio. Tres recorridos usan WebKit y tacto emulado en tamaños de iPad vertical y horizontal; esta emulación no sustituye una prueba en un iPad físico. La auditoría automática de accesibilidad cubre las pantallas principales y los modelos, pero no sustituye una revisión manual con lector de pantalla.

## Funcionamiento y privacidad

Las respuestas se validan localmente y las representaciones visuales ayudan a organizar el razonamiento y trasladarlo al papel. Los resultados y pasos intermedios se calculan en papel; las herramientas no los muestran automáticamente. Los repartos se representan mediante grupos iguales y multiplicaciones con incógnita, sin introducir la división formal. La corrección se realiza cuando se pulsa «Comprova» o se consulta expresamente una posible solución. El panel de acompañamiento muestra solo datos locales y no hace diagnósticos. El progreso y la preferencia de idioma se almacenan en el navegador del dispositivo; borrar los datos del navegador puede eliminarlos. No se envían respuestas a servicios externos.

El contenido bilingüe está en `src/content/problems.ts`; los primeros 30 ejercicios parten de `problems.seed.json`. Los modelos visuales están en `src/visual/`. Las ilustraciones se sirven desde `public/illustrations/`.

## Estado y limitaciones

Los 60 problemas tienen una ilustración contextual; las escenas se comparten entre ejercicios relacionados, en lugar de existir 60 imágenes diferentes. Los textos nuevos y sus traducciones se han revisado en el proyecto, aunque sigue siendo recomendable una revisión pedagógica y lingüística independiente. La lectura en voz alta y la instalación sin conexión son mejoras posteriores. No se ha realizado una prueba en un iPad físico ni con lectores de pantalla reales.
