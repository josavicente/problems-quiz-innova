import seed from '../../problems.seed.json';
import { assertValidProblems } from './validation';

export type Locale = 'ca' | 'es';
export type Text = Record<Locale, string>;
export type VisualModel = 'numberLine' | 'barModel' | 'array' | 'groups' | 'mixed';
export interface Problem {
  id: string;
  level: number;
  title: Text;
  statement: Text;
  question: Text;
  answer: { value: number; unit: Text };
  steps: { expression: string; result: number }[];
  visualModel: VisualModel;
  hints: [Text, Text, Text];
  workedSolution: Text;
}
const t = (ca: string, es: string): Text => ({ ca, es });
type Translation = { title: string; statement: string; question: string; unit: string; hints: [string, string, string]; solution: string };

// Translations are indexed by the stable IDs of the original Catalan seed.
const spanish: Record<string, Translation> = {
  'L1-01': { title: 'Las pegatinas', statement: 'Jana tiene 26 pegatinas y su amiga le regala 17 pegatinas más.', question: '¿Cuántas pegatinas tiene ahora?', unit: 'pegatinas', hints: ['Empieza con las 26 pegatinas que ya tiene.', 'Para sumar 17 puedes dar un salto de 10 y otro de 7.', '26 → 36 → 43.'], solution: '26 + 10 = 36; 36 + 7 = 43. En total tiene 43 pegatinas.' },
  'L1-02': { title: 'Las canicas', statement: 'Pol tiene 65 canicas y pierde 23 jugando en el patio.', question: '¿Cuántas canicas le quedan?', unit: 'canicas', hints: ['Si pierde canicas, el número final será menor.', 'Resta primero 20 y después 3.', '65 → 45 → 42.'], solution: '65 − 20 = 45; 45 − 3 = 42. Le quedan 42 canicas.' },
  'L1-03': { title: 'Los libros nuevos', statement: 'En el aula hay 34 libros y la escuela trae 28 más.', question: '¿Cuántos libros hay ahora en el aula?', unit: 'libros', hints: ['Hay que juntar los libros que había con los nuevos.', 'Descompón 28 en 20 y 8.', '34 → 54 → 60 → 62.'], solution: '34 + 20 = 54; después +6 hasta 60 y +2 hasta 62.' },
  'L1-04': { title: 'Las manzanas', statement: 'En el comedor hay 80 manzanas. A la hora de comer se comen 35.', question: '¿Cuántas manzanas quedan?', unit: 'manzanas', hints: ['Como se las comen, hay que restar.', 'Resta 30 y después 5.', '80 → 50 → 45.'], solution: '80 − 30 = 50; 50 − 5 = 45. Quedan 45 manzanas.' },
  'L1-05': { title: 'Las entradas del museo', statement: 'Un grupo compra 47 entradas para visitar un museo. Después compra 16 más.', question: '¿Cuántas entradas han comprado?', unit: 'entradas', hints: ['Hay que sumar las dos compras.', 'Puedes separar 16 en 10 y 6.', '47 → 57 → 60 → 63.'], solution: '47 + 10 = 57; 57 + 3 = 60; 60 + 3 = 63.' },
  'L1-06': { title: 'El autobús', statement: 'En un autobús viajan 72 personas. En una parada bajan 29.', question: '¿Cuántas personas continúan en el autobús?', unit: 'personas', hints: ['El número de personas disminuye.', 'Puedes restar 30 y después añadir 1.', '72 − 30 = 42; 42 + 1 = 43.'], solution: 'Restar 29 equivale a restar 30 y añadir 1: 43 personas.' },
  'L2-01': { title: 'El puesto de fruta', statement: 'En un puesto del mercado tienen 84 naranjas. Hay el doble de naranjas que de manzanas.', question: '¿Cuántas manzanas hay?', unit: 'manzanas', hints: ['Las naranjas representan dos partes iguales.', 'Busca la mitad de 84.', 'Mitad de 80: 40; mitad de 4: 2.'], solution: '84 = 80 + 4; las mitades son 40 y 2; 40 + 2 = 42 manzanas.' },
  'L2-02': { title: 'La caja de cromos', statement: 'Sara tiene 72 cromos. Tiene el doble de cromos que su primo.', question: '¿Cuántos cromos tiene el primo?', unit: 'cromos', hints: ['Si Sara tiene el doble, su primo tiene la mitad.', 'Descompón 72 en 60 y 12.', '30 + 6 = 36.'], solution: 'La mitad de 60 es 30 y la mitad de 12 es 6. Su primo tiene 36 cromos.' },
  'L2-03': { title: 'El huerto de la escuela', statement: 'En el huerto ya han plantado 45 flores. Quieren llegar a tener 70.', question: '¿Cuántas flores les faltan por plantar?', unit: 'flores', hints: ['Hay que encontrar la distancia entre 45 y 70.', 'Da saltos desde 45 hasta 70.', '45 → 50 (+5) → 70 (+20).'], solution: '5 + 20 = 25. Les faltan 25 flores.' },
  'L2-04': { title: 'Las galletas', statement: 'Se han hecho 96 galletas y se reparten por igual en dos cajas.', question: '¿Cuántas galletas hay en cada caja?', unit: 'galletas', hints: ['Las dos cajas tienen la misma cantidad.', 'Divide 96 en 80 y 16 para hallar su mitad.', '40 + 8 = 48.'], solution: 'La mitad de 80 es 40 y la mitad de 16 es 8. Cada caja tiene 48 galletas.' },
  'L2-05': { title: 'Las entradas de la fiesta', statement: 'En la fiesta de la escuela se pueden vender 90 entradas. Ya se han vendido 38.', question: '¿Cuántas entradas quedan por vender?', unit: 'entradas', hints: ['Busca cuántas entradas faltan hasta 90.', 'Empieza en 38 y llega primero a 40.', '38 → 40 (+2) → 90 (+50).'], solution: '2 + 50 = 52. Quedan 52 entradas.' },
  'L2-06': { title: 'Los cromos de Nil', statement: 'Nil tiene 29 cromos. Su hermana tiene el doble.', question: '¿Cuántos cromos tiene su hermana?', unit: 'cromos', hints: ['El doble significa tener dos veces la misma cantidad.', 'Puedes calcular el doble de 30 y ajustar.', '30 × 2 = 60; como 29 es 1 menos, resta 2.'], solution: 'El doble de 29 es 58, porque 29 + 29 = 58.' },
  'L3-01': { title: 'Los días de lluvia', statement: 'En febrero llovió 18 días y en marzo 21 días. Durante los tres primeros meses del año llovió un total de 52 días.', question: '¿Cuántos días llovió en enero?', unit: 'días', hints: ['Primero junta los días de febrero y marzo.', '18 + 21 = 39. Ahora compara 39 con 52.', '39 → 40 (+1) → 50 (+10) → 52 (+2).'], solution: 'Febrero y marzo suman 39 días; de 39 a 52 hay 13. En enero llovió 13 días.' },
  'L3-02': { title: 'Las pelotas de la escuela', statement: 'La escuela tiene 36 pelotas rojas y 28 azules. Durante el curso se estropean 19.', question: '¿Cuántas pelotas quedan en buen estado?', unit: 'pelotas', hints: ['Primero calcula todas las pelotas.', '36 + 28 = 64. Después resta las que se estropean.', '64 − 20 = 44; añade 1.'], solution: 'Había 64 pelotas. Restamos 19 y quedan 45.' },
  'L3-03': { title: 'La biblioteca', statement: 'En la biblioteca había 95 libros. El lunes prestan 38 y el martes devuelven 14.', question: '¿Cuántos libros hay ahora en la biblioteca?', unit: 'libros', hints: ['Primero salen libros de la biblioteca.', 'Calcula 95 − 38. Después añade los devueltos.', '95 − 38 = 57; 57 + 14 = 71.'], solution: 'Después del préstamo hay 57 libros; con los 14 devueltos, 71.' },
  'L3-04': { title: 'El cine', statement: 'Un cine tiene 120 entradas para una película. Por la mañana venden 45 y por la tarde 38.', question: '¿Cuántas entradas quedan por vender?', unit: 'entradas', hints: ['Primero busca cuántas entradas se han vendido.', '45 + 38 = 83. Ahora llega hasta 120.', '83 → 90 (+7) → 100 (+10) → 120 (+20).'], solution: 'Se han vendido 83 entradas y quedan 37.' },
  'L3-05': { title: 'La excursión en bicicleta', statement: 'El sábado, Laia recorre 24 kilómetros en bicicleta. El domingo recorre 13 más que el sábado.', question: '¿Cuántos kilómetros recorre entre los dos días?', unit: 'kilómetros', hints: ['El domingo no recorre 13 km: recorre 13 más que el sábado.', 'Calcula primero los kilómetros del domingo.', '24 + 13 = 37; 24 + 37 = 61.'], solution: 'El domingo recorre 37 km. En total, 24 + 37 = 61 km.' },
  'L3-06': { title: 'Las sillas del concierto', statement: 'Para un concierto hay 130 sillas. Entran 47 personas y, un rato después, 36 personas más.', question: '¿Cuántas sillas quedan libres?', unit: 'sillas', hints: ['Suma las personas de los dos grupos.', '47 + 36 = 83; las demás sillas están libres.', '83 → 100 (+17) → 130 (+30).'], solution: 'Hay 83 sillas ocupadas; 130 − 83 = 47 sillas libres.' },
  'L4-01': { title: 'Los lápices de colores', statement: 'La maestra compra 6 cajas de lápices de colores. Cada caja contiene 8.', question: '¿Cuántos lápices compra en total?', unit: 'lápices', hints: ['Puedes hacer 6 filas de 8 puntos.', 'Descompón 8 en 5 + 3.', '6 × 5 = 30 y 6 × 3 = 18.'], solution: 'Con 6 grupos de 8 lápices, 30 + 18 = 48 lápices.' },
  'L4-02': { title: 'La pastelería', statement: 'En una pastelería hacen 72 magdalenas y las reparten por igual en 9 bandejas.', question: '¿Cuántas magdalenas hay en cada bandeja?', unit: 'magdalenas', hints: ['Las 9 bandejas deben tener la misma cantidad.', '¿Qué número multiplicado por 9 da 72?', '9 × 8 = 72.'], solution: 'Si 9 × 8 = 72, cada bandeja contiene 8 magdalenas.' },
  'L4-03': { title: 'El salón de actos', statement: 'En el salón de actos hay 5 filas de 9 sillas cada una.', question: '¿Cuántas sillas hay en total?', unit: 'sillas', hints: ['Representa 5 filas de 9 sillas.', 'Puedes separar 9 en 5 y 4.', '5 × 5 = 25; 5 × 4 = 20.'], solution: '25 + 20 = 45 sillas.' },
  'L4-04': { title: 'Las cartas', statement: 'Se reparten 56 cartas entre 7 niños, de manera que todos reciben la misma cantidad.', question: '¿Cuántas cartas recibe cada niño?', unit: 'cartas', hints: ['Hay 7 grupos iguales.', '¿Qué tabla de multiplicar puede ayudarte?', '7 × 8 = 56.'], solution: 'Cada niño recibe 8 cartas.' },
  'L4-05': { title: 'Las cestas', statement: 'Hay 4 cestas con 12 mandarinas cada una.', question: '¿Cuántas mandarinas hay en total?', unit: 'mandarinas', hints: ['Hay cuatro grupos de 12.', 'Descompón 12 en 10 y 2.', '4 × 10 = 40; 4 × 2 = 8.'], solution: '40 + 8 = 48 mandarinas.' },
  'L4-06': { title: 'Los bloques de construcción', statement: 'Hay 63 bloques de construcción para hacer 9 torres iguales.', question: '¿Cuántos bloques tendrá cada torre?', unit: 'bloques', hints: ['Las torres deben ser iguales.', 'Piensa en la tabla del 9.', '9 × 7 = 63.'], solution: '63 bloques entre 9 torres son 7 bloques por torre.' },
  'L5-01': { title: 'La colección de cromos', statement: 'Marc tiene 90 cromos y su hermana tiene la mitad. Ella regala 17 a una amiga.', question: '¿Cuántos cromos le quedan a la hermana?', unit: 'cromos', hints: ['Primero calcula los cromos de la hermana.', 'La mitad de 90 es 45.', '45 − 17 = 28.'], solution: 'La hermana tenía 45 cromos y después de regalar 17 le quedan 28.' },
  'L5-02': { title: 'El torneo de fútbol', statement: 'En un torneo participan 6 equipos de 7 jugadores. El día del torneo, 9 jugadores no pueden asistir.', question: '¿Cuántos jugadores participarán finalmente?', unit: 'jugadores', hints: ['Primero calcula cuántos jugadores hay inscritos.', '6 × 7 = 42. Ahora resta los que no pueden venir.', '42 − 10 + 1 = 33.'], solution: 'En total hay 42 jugadores; sin los 9 ausentes, participan 33.' },
  'L5-03': { title: 'Los rotuladores', statement: 'La escuela compra 5 cajas con 8 rotuladores cada una. Durante la semana utilizan 13.', question: '¿Cuántos rotuladores quedan sin utilizar?', unit: 'rotuladores', hints: ['Calcula primero los rotuladores de todas las cajas.', '5 × 8 = 40.', '40 − 13 = 27.'], solution: 'Empiezan con 40 rotuladores. Después de utilizar 13, quedan 27.' },
  'L5-04': { title: 'Las bolsas de mandarinas', statement: 'Una frutería reparte 48 mandarinas en 6 bolsas iguales. Después vende 3 bolsas completas.', question: '¿Cuántas mandarinas quedan en la frutería?', unit: 'mandarinas', hints: ['Primero calcula las mandarinas de cada bolsa.', '48 ÷ 6 = 8. Se venden 3 bolsas de 8.', '3 × 8 = 24 vendidas; 48 − 24 = 24.'], solution: 'Cada bolsa tiene 8 mandarinas. Se venden 24, y quedan 24.' },
  'L5-05': { title: 'El torneo escolar', statement: 'Se han inscrito 4 equipos de 9 jugadores en un torneo escolar. Después se añaden 7 jugadores de reserva.', question: '¿Cuántos jugadores hay inscritos en total?', unit: 'jugadores', hints: ['Primero calcula los jugadores de los equipos.', '4 × 9 = 36.', '36 + 7 = 43.'], solution: 'Hay 36 jugadores de los equipos y 7 reservas: 43 en total.' },
  'L5-06': { title: 'Las galletas de la fiesta', statement: 'Hay 3 bandejas con 12 galletas cada una. Se rompen 8 y las que quedan se reparten entre 4 niños a partes iguales.', question: '¿Cuántas galletas recibe cada niño?', unit: 'galletas', hints: ['Primero calcula todas las galletas.', '3 × 12 = 36. Después quita las rotas.', '36 − 8 = 28; 28 ÷ 4 = 7.'], solution: 'Hay 36 galletas; quedan 28 enteras, y cada niño recibe 7.' },
};

const original: Problem[] = seed.problems.map((p) => {
  const es = spanish[p.id];
  if (!es) throw new Error(`Missing Spanish translation for ${p.id}`);
  return {
    id: p.id, level: p.level, title: t(p.title, es.title),
    // Make the occupancy assumption explicit: everyone takes one chair.
    statement: p.id === 'L3-06'
      ? t('Per a un concert hi ha 130 cadires. Hi entren 47 persones i, una estona després, 36 persones més. Cadascuna ocupa una cadira.', 'Para un concierto hay 130 sillas. Entran 47 personas y, un rato después, 36 personas más. Cada persona ocupa una silla.')
      : t(p.statement, es.statement),
    question: t(p.question, es.question), answer: { value: p.answer.value, unit: t(p.answer.unit, es.unit) },
    steps: p.steps, visualModel: p.visualModel as VisualModel,
    hints: [t(p.hints[0], es.hints[0]), t(p.hints[1], es.hints[1]), t(p.hints[2], es.hints[2])],
    workedSolution: t(p.workedSolution, es.solution),
  };
});

type NewProblem = {
  id: string; title: Text; statement: Text; question: Text; unit: Text;
  steps: { expression: string; result: number }[]; visualModel: VisualModel;
  hints: [Text, Text, Text]; solution: Text;
};
const step = (expression: string, result: number) => ({ expression, result });
const newProblems: NewProblem[] = [
  {
    id: 'L1-07', title: t('Els llapis de la classe', 'Los lápices de la clase'),
    statement: t('A la classe hi ha 38 llapis i n’arriben 25 més.', 'En clase hay 38 lápices y llegan 25 más.'), question: t('Quants llapis hi ha ara?', '¿Cuántos lápices hay ahora?'), unit: t('llapis', 'lápices'),
    steps: [step('38 + 25', 63)], visualModel: 'numberLine', hints: [t('Ajunta els llapis que hi havia i els nous.', 'Junta los lápices que había y los nuevos.'), t('Pots descompondre 25 en 20 i 5.', 'Puedes descomponer 25 en 20 y 5.'), t('38 + 20 = 58; després suma 5.', '38 + 20 = 58; después suma 5.')], solution: t('38 + 20 = 58 i 58 + 5 = 63. Hi ha 63 llapis.', '38 + 20 = 58 y 58 + 5 = 63. Hay 63 lápices.')
  },
  {
    id: 'L1-08', title: t('Les plantes del pati', 'Las plantas del patio'), statement: t('Al pati hi ha 91 plantes. Se’n trasplanten 46 a un altre jardí.', 'En el patio hay 91 plantas. Se trasplantan 46 a otro jardín.'), question: t('Quantes plantes queden al pati?', '¿Cuántas plantas quedan en el patio?'), unit: t('plantes', 'plantas'), steps: [step('91 - 46', 45)], visualModel: 'numberLine', hints: [t('Les plantes trasplantades ja no són al pati.', 'Las plantas trasplantadas ya no están en el patio.'), t('Resta primer 40 i després 6.', 'Resta primero 40 y después 6.'), t('91 − 40 = 51; després resta 6.', '91 − 40 = 51; después resta 6.')], solution: t('91 − 40 = 51 i 51 − 6 = 45. Queden 45 plantes.', '91 − 40 = 51 y 51 − 6 = 45. Quedan 45 plantas.')
  },
  {
    id: 'L1-09', title: t('La col·lecció de petxines', 'La colección de conchas'), statement: t('La Mar té 57 petxines i en troba 18 més.', 'Mar tiene 57 conchas y encuentra 18 más.'), question: t('Quantes petxines té ara?', '¿Cuántas conchas tiene ahora?'), unit: t('petxines', 'conchas'), steps: [step('57 + 18', 75)], visualModel: 'numberLine', hints: [t('Les petxines noves s’afegeixen a la col·lecció.', 'Las conchas nuevas se añaden a la colección.'), t('Arriba primer a la desena següent.', 'Llega primero a la siguiente decena.'), t('57 + 3 = 60; queden 15 per afegir.', '57 + 3 = 60; quedan 15 por añadir.')], solution: t('57 + 3 = 60 i 60 + 15 = 75. Té 75 petxines.', '57 + 3 = 60 y 60 + 15 = 75. Tiene 75 conchas.')
  },
  {
    id: 'L1-10', title: t('Les peces del puzle', 'Las piezas del puzle'), statement: t('Un puzle té 70 peces. Ja n’han col·locat 27.', 'Un puzle tiene 70 piezas. Ya han colocado 27.'), question: t('Quantes peces falten per col·locar?', '¿Cuántas piezas faltan por colocar?'), unit: t('peces', 'piezas'), steps: [step('70 - 27', 43)], visualModel: 'numberLine', hints: [t('Les peces col·locades ja no falten.', 'Las piezas colocadas ya no faltan.'), t('Pots restar 30 i recuperar 3.', 'Puedes restar 30 y recuperar 3.'), t('70 − 30 = 40; afegeix 3.', '70 − 30 = 40; añade 3.')], solution: t('70 − 30 + 3 = 43. Falten 43 peces.', '70 − 30 + 3 = 43. Faltan 43 piezas.')
  },
  {
    id: 'L1-11', title: t('Els contes de préstec', 'Los cuentos de préstamo'), statement: t('Una biblioteca presta 49 contes dilluns i 32 dimarts.', 'Una biblioteca presta 49 cuentos el lunes y 32 el martes.'), question: t('Quants contes ha prestat entre els dos dies?', '¿Cuántos cuentos ha prestado entre los dos días?'), unit: t('contes', 'cuentos'), steps: [step('49 + 32', 81)], visualModel: 'numberLine', hints: [t('Ajunta els préstecs dels dos dies.', 'Junta los préstamos de los dos días.'), t('De 49 a 50 falta 1.', 'De 49 a 50 falta 1.'), t('49 + 1 = 50; encara cal sumar 31.', '49 + 1 = 50; aún hay que sumar 31.')], solution: t('49 + 1 = 50 i 50 + 31 = 81. Ha prestat 81 contes.', '49 + 1 = 50 y 50 + 31 = 81. Ha prestado 81 cuentos.')
  },
  {
    id: 'L1-12', title: t('Les ampolles per reciclar', 'Las botellas para reciclar'), statement: t('Han recollit 86 ampolles i en porten 41 al contenidor.', 'Han recogido 86 botellas y llevan 41 al contenedor.'), question: t('Quantes ampolles queden per portar?', '¿Cuántas botellas quedan por llevar?'), unit: t('ampolles', 'botellas'), steps: [step('86 - 41', 45)], visualModel: 'numberLine', hints: [t('Les ampolles portades ja no queden per portar.', 'Las botellas llevadas ya no quedan por llevar.'), t('Resta 40 i després 1.', 'Resta 40 y después 1.'), t('86 − 40 = 46; resta 1.', '86 − 40 = 46; resta 1.')], solution: t('86 − 40 = 46 i 46 − 1 = 45. Queden 45 ampolles.', '86 − 40 = 46 y 46 − 1 = 45. Quedan 45 botellas.')
  },
  {
    id: 'L2-07', title: t('Les caixes de colors', 'Las cajas de colores'), statement: t('Una caixa té 37 colors. Una altra caixa té el doble de colors.', 'Una caja tiene 37 lápices de colores. Otra caja tiene el doble.'), question: t('Quants colors té la segona caixa?', '¿Cuántos lápices tiene la segunda caja?'), unit: t('colors', 'lápices'), steps: [step('37 * 2', 74)], visualModel: 'barModel', hints: [t('El doble són dues quantitats iguals.', 'El doble son dos cantidades iguales.'), t('Calcula el doble de 30 i el doble de 7.', 'Calcula el doble de 30 y el doble de 7.'), t('30 + 30 = 60 i 7 + 7 = 14.', '30 + 30 = 60 y 7 + 7 = 14.')], solution: t('60 + 14 = 74. La segona caixa té 74 colors.', '60 + 14 = 74. La segunda caja tiene 74 lápices.')
  },
  {
    id: 'L2-08', title: t('Les cireres del mercat', 'Las cerezas del mercado'), statement: t('Es reparteixen 88 cireres per igual en dos cistells.', 'Se reparten 88 cerezas por igual en dos cestas.'), question: t('Quantes cireres hi ha a cada cistell?', '¿Cuántas cerezas hay en cada cesta?'), unit: t('cireres', 'cerezas'), steps: [step('88 / 2', 44)], visualModel: 'barModel', hints: [t('Cada cistell té la mateixa quantitat.', 'Cada cesta tiene la misma cantidad.'), t('Busca les meitats de 80 i de 8.', 'Busca las mitades de 80 y de 8.'), t('La meitat de 80 és 40 i la de 8 és 4.', 'La mitad de 80 es 40 y la de 8 es 4.')], solution: t('40 + 4 = 44. Cada cistell té 44 cireres.', '40 + 4 = 44. Cada cesta tiene 44 cerezas.')
  },
  {
    id: 'L2-09', title: t('Els punts del joc', 'Los puntos del juego'), statement: t('Un equip té 67 punts i vol arribar a 100.', 'Un equipo tiene 67 puntos y quiere llegar a 100.'), question: t('Quants punts li falten?', '¿Cuántos puntos le faltan?'), unit: t('punts', 'puntos'), steps: [step('100 - 67', 33)], visualModel: 'numberLine', hints: [t('Busca la distància de 67 fins a 100.', 'Busca la distancia de 67 hasta 100.'), t('Fes primer un salt fins a 70.', 'Da primero un salto hasta 70.'), t('67 → 70 (+3) → 100 (+30).', '67 → 70 (+3) → 100 (+30).')], solution: t('3 + 30 = 33. Li falten 33 punts.', '3 + 30 = 33. Le faltan 33 puntos.')
  },
  {
    id: 'L2-10', title: t('Les polseres bessones', 'Las pulseras gemelas'), statement: t('Una polsera té 46 peces. Una altra té el doble de peces.', 'Una pulsera tiene 46 piezas. Otra tiene el doble de piezas.'), question: t('Quantes peces té la segona polsera?', '¿Cuántas piezas tiene la segunda pulsera?'), unit: t('peces', 'piezas'), steps: [step('46 * 2', 92)], visualModel: 'barModel', hints: [t('El doble és dues vegades 46.', 'El doble es dos veces 46.'), t('Descompon 46 en 40 i 6.', 'Descompón 46 en 40 y 6.'), t('El doble de 40 és 80; el de 6 és 12.', 'El doble de 40 es 80; el de 6 es 12.')], solution: t('80 + 12 = 92. Té 92 peces.', '80 + 12 = 92. Tiene 92 piezas.')
  },
  {
    id: 'L2-11', title: t('Les files de gots', 'Las filas de vasos'), statement: t('En una festa hi ha una fila de 28 gots. En una altra fila hi ha el doble de gots.', 'En una fiesta hay una fila de 28 vasos. En otra fila hay el doble de vasos.'), question: t('Quants gots hi ha a la segona fila?', '¿Cuántos vasos hay en la segunda fila?'), unit: t('gots', 'vasos'), steps: [step('28 * 2', 56)], visualModel: 'barModel', hints: [t('La segona fila conté dues vegades la primera.', 'La segunda fila contiene dos veces la primera.'), t('Pots doblar 20 i després 8.', 'Puedes doblar 20 y después 8.'), t('20 + 20 = 40; 8 + 8 = 16.', '20 + 20 = 40; 8 + 8 = 16.')], solution: t('40 + 16 = 56. Hi ha 56 gots.', '40 + 16 = 56. Hay 56 vasos.')
  },
  {
    id: 'L2-12', title: t('Les places de l’autocar', 'Las plazas del autocar'), statement: t('Un autocar té 85 places i 59 ja estan ocupades.', 'Un autocar tiene 85 plazas y 59 ya están ocupadas.'), question: t('Quantes places lliures queden?', '¿Cuántas plazas libres quedan?'), unit: t('places', 'plazas'), steps: [step('85 - 59', 26)], visualModel: 'numberLine', hints: [t('Busca les places que falten des de 59 fins a 85.', 'Busca las plazas que faltan desde 59 hasta 85.'), t('Salta de 59 a 60 i després fins a 85.', 'Salta de 59 a 60 y después hasta 85.'), t('59 → 60 (+1) → 85 (+25).', '59 → 60 (+1) → 85 (+25).')], solution: t('1 + 25 = 26. Queden 26 places.', '1 + 25 = 26. Quedan 26 plazas.')
  },
];

// These problems have more than one step. The scaffold presents one possible
// route without requiring the child to reproduce it in a visual model.
function multi(id: string, title: Text, statement: Text, question: Text, unit: Text, steps: NewProblem['steps'], visualModel: VisualModel): NewProblem {
  const first = steps[0];
  const last = steps[steps.length - 1];
  // Show equal-sharing steps as an inverse multiplication. The division
  // remains internal catalogue data and is never presented to the child.
  const writtenStep = (s: NewProblem['steps'][number]) => {
    const share = /^\s*(\d+)\s*\/\s*(\d+)\s*$/.exec(s.expression);
    return share ? `${share[2]} × ${s.result} = ${share[1]}` : `${s.expression.replaceAll('*', '×')} = ${s.result}`;
  };
  const operations = steps.map(writtenStep).join('; ');
  const prior = steps.slice(0, -1).map((s) => `${s.expression.replaceAll('*', '×').replaceAll('/', '÷')} = ${s.result}`).join('; ');
  const expression = first.expression.replaceAll('*', '×').replaceAll('/', '÷');
  return {
    id, title, statement, question, unit, steps, visualModel,
    hints: [
      steps.length === 1
        ? t('Pensa en la relació entre els grups i la quantitat total.', 'Piensa en la relación entre los grupos y la cantidad total.')
        : t('Què necessites saber abans de respondre la pregunta?', '¿Qué necesitas saber antes de responder la pregunta?'),
      steps.length === 1
        ? t('Representa els grups iguals per veure com es relacionen.', 'Representa los grupos iguales para ver cómo se relacionan.')
        : t(`Un primer pas possible és calcular ${expression}.`, `Un primer paso posible es calcular ${expression}.`),
      steps.length === 1
        ? t(`Pots calcular ${expression}.`, `Puedes calcular ${expression}.`)
        : t(`${prior}. Per acabar, calcula ${last.expression.replaceAll('*', '×').replaceAll('/', '÷')}.`, `${prior}. Para acabar, calcula ${last.expression.replaceAll('*', '×').replaceAll('/', '÷')}.`),
    ],
    solution: t(`${operations}. La resposta és ${last.result} ${unit.ca}.`, `${operations}. La respuesta es ${last.result} ${unit.es}.`),
  };
}

newProblems.push(
  multi('L3-07', t('La parada solidària', 'El puesto solidario'), t('A una parada solidària porten 48 llibres al matí i 37 a la tarda. En venen 26.', 'A un puesto solidario llevan 48 libros por la mañana y 37 por la tarde. Venden 26.'), t('Quants llibres queden?', '¿Cuántos libros quedan?'), t('llibres', 'libros'), [step('48 + 37', 85), step('85 - 26', 59)], 'numberLine'),
  multi('L3-08', t('Els llibres de l’aula', 'Los libros del aula'), t('A l’aula hi ha 128 llibres. En deixen 45 en préstec i després en reben 16 de nous.', 'En el aula hay 128 libros. Prestan 45 y después reciben 16 nuevos.'), t('Quants llibres hi ha ara a l’aula?', '¿Cuántos libros hay ahora en el aula?'), t('llibres', 'libros'), [step('128 - 45', 83), step('83 + 16', 99)], 'numberLine'),
  multi('L3-09', t('La cursa escolar', 'La carrera escolar'), t('En una cursa hi ha 100 places. S’hi apunten 34 infants al matí i 29 a la tarda.', 'En una carrera hay 100 plazas. Se apuntan 34 niños por la mañana y 29 por la tarde.'), t('Quantes places queden lliures?', '¿Cuántas plazas quedan libres?'), t('places', 'plazas'), [step('34 + 29', 63), step('100 - 63', 37)], 'numberLine'),
  multi('L3-10', t('Els seients del teatre', 'Los asientos del teatro'), t('Un teatre té 125 seients. Se’n reserven 52 al matí i 39 a la tarda.', 'Un teatro tiene 125 asientos. Se reservan 52 por la mañana y 39 por la tarde.'), t('Quants seients queden lliures?', '¿Cuántos asientos quedan libres?'), t('seients', 'asientos'), [step('52 + 39', 91), step('125 - 91', 34)], 'numberLine'),
  multi('L3-11', t('El material d’art', 'El material de arte'), t('Hi ha 76 fulls de paper. Se n’utilitzen 28 i després n’arriben 35 de nous.', 'Hay 76 hojas de papel. Se utilizan 28 y después llegan 35 nuevas.'), t('Quants fulls hi ha ara?', '¿Cuántas hojas hay ahora?'), t('fulls', 'hojas'), [step('76 - 28', 48), step('48 + 35', 83)], 'numberLine'),
  multi('L3-12', t('La campanya de recollida', 'La campaña de recogida'), t('En una campanya recullen 27 aliments dilluns, 46 dimarts i 18 dimecres.', 'En una campaña recogen 27 alimentos el lunes, 46 el martes y 18 el miércoles.'), t('Quants aliments han recollit en total?', '¿Cuántos alimentos han recogido en total?'), t('aliments', 'alimentos'), [step('27 + 46', 73), step('73 + 18', 91)], 'numberLine'),
  multi('L4-07', t('Les files del jardí', 'Las filas del jardín'), t('En un jardí hi ha 7 files amb 6 plantes a cada fila.', 'En un jardín hay 7 filas con 6 plantas en cada fila.'), t('Quantes plantes hi ha en total?', '¿Cuántas plantas hay en total?'), t('plantes', 'plantas'), [step('7 * 6', 42)], 'array'),
  multi('L4-08', t('Els equips de relleus', 'Los equipos de relevos'), t('Es reparteixen 54 participants en 6 equips iguals.', 'Se reparten 54 participantes en 6 equipos iguales.'), t('Quants participants hi ha a cada equip?', '¿Cuántos participantes hay en cada equipo?'), t('participants', 'participantes'), [step('54 / 6', 9)], 'groups'),
  multi('L4-09', t('Les capses de retoladors', 'Las cajas de rotuladores'), t('Hi ha 8 capses amb 7 retoladors a cadascuna.', 'Hay 8 cajas con 7 rotuladores en cada una.'), t('Quants retoladors hi ha en total?', '¿Cuántos rotuladores hay en total?'), t('retoladors', 'rotuladores'), [step('8 * 7', 56)], 'array'),
  multi('L4-10', t('Els dies del calendari', 'Los días del calendario'), t('Un calendari de projecte reparteix 48 dies en 8 períodes iguals.', 'Un calendario de proyecto reparte 48 días en 8 periodos iguales.'), t('Quants dies té cada període?', '¿Cuántos días tiene cada periodo?'), t('dies', 'días'), [step('48 / 8', 6)], 'groups'),
  multi('L4-11', t('Les rajoles del passadís', 'Las baldosas del pasillo'), t('Un mosaic té 9 files de 4 rajoles.', 'Un mosaico tiene 9 filas de 4 baldosas.'), t('Quantes rajoles té el mosaic?', '¿Cuántas baldosas tiene el mosaico?'), t('rajoles', 'baldosas'), [step('9 * 4', 36)], 'array'),
  multi('L4-12', t('Les bosses de llavors', 'Las bolsas de semillas'), t('Es reparteixen 42 llavors en 7 bosses iguals.', 'Se reparten 42 semillas en 7 bolsas iguales.'), t('Quantes llavors hi ha a cada bossa?', '¿Cuántas semillas hay en cada bolsa?'), t('llavors', 'semillas'), [step('42 / 7', 6)], 'groups'),
  multi('L5-07', t('Les entrades del concert', 'Las entradas del concierto'), t('Es preparen 7 sobres amb 8 entrades cadascun. Se’n venen 19.', 'Se preparan 7 sobres con 8 entradas cada uno. Se venden 19.'), t('Quantes entrades queden?', '¿Cuántas entradas quedan?'), t('entrades', 'entradas'), [step('7 * 8', 56), step('56 - 19', 37)], 'mixed'),
  multi('L5-08', t('Les caixes de fruita', 'Las cajas de fruta'), t('Es reparteixen 72 pomes en 8 caixes iguals. Una escola compra 4 caixes completes.', 'Se reparten 72 manzanas en 8 cajas iguales. Una escuela compra 4 cajas completas.'), t('Quantes pomes compra l’escola?', '¿Cuántas manzanas compra la escuela?'), t('pomes', 'manzanas'), [step('72 / 8', 9), step('9 * 4', 36)], 'mixed'),
  multi('L5-09', t('Els cromos de l’intercanvi', 'Los cromos del intercambio'), t('La Jana té la meitat dels 64 cromos d’en Pol. Després rep 18 cromos i en regala 7.', 'Jana tiene la mitad de los 64 cromos de Pol. Después recibe 18 cromos y regala 7.'), t('Quants cromos té ara la Jana?', '¿Cuántos cromos tiene ahora Jana?'), t('cromos', 'cromos'), [step('64 / 2', 32), step('32 + 18', 50), step('50 - 7', 43)], 'mixed'),
  multi('L5-10', t('La fira de l’escola', 'La feria de la escuela'), t('A la fira han d’omplir 100 bosses. Ja han omplert 5 taules amb 9 bosses plenes a cadascuna i després han omplert 28 bosses més.', 'En la feria deben llenar 100 bolsas. Ya han llenado 5 mesas con 9 bolsas llenas en cada una y después han llenado 28 bolsas más.'), t('Quantes bosses queden per omplir?', '¿Cuántas bolsas quedan por llenar?'), t('bosses', 'bolsas'), [step('5 * 9', 45), step('45 + 28', 73), step('100 - 73', 27)], 'mixed'),
  multi('L5-11', t('Les samarretes de l’equip', 'Las camisetas del equipo'), t('Hi ha 6 equips amb 7 samarretes cadascun i 16 samarretes de reserva.', 'Hay 6 equipos con 7 camisetas cada uno y 16 camisetas de reserva.'), t('Quantes samarretes hi ha en total?', '¿Cuántas camisetas hay en total?'), t('samarretes', 'camisetas'), [step('6 * 7', 42), step('42 + 16', 58)], 'mixed'),
  multi('L5-12', t('Els llibres per prestatge', 'Los libros por estante'), t('Una biblioteca col·loca 63 llibres en 7 prestatges iguals. Després omple 5 prestatges nous amb la mateixa quantitat a cadascun.', 'Una biblioteca coloca 63 libros en 7 estantes iguales. Después llena 5 estantes nuevos con la misma cantidad en cada uno.'), t('Quants llibres hi ha als 5 prestatges nous?', '¿Cuántos libros hay en los 5 estantes nuevos?'), t('llibres', 'libros'), [step('63 / 7', 9), step('9 * 5', 45)], 'mixed'),
);

// The written solution is deliberately separate from these prompts. Build the
// scaffold from the reference steps without displaying any calculated value:
// the learner supplies intermediate quantities and results on paper.
function paperHints(problem: Problem): [Text, Text, Text] {
  const operation = problem.steps[0].expression.match(/^\s*\d+\s*([+\-*/])\s*\d+\s*$/)?.[1];
  const strategies: Record<string, Text> = {
    '+': t('Pensa quines quantitats has d’ajuntar.', 'Piensa qué cantidades tienes que juntar.'),
    '-': t('Pensa quina quantitat has de treure o comparar.', 'Piensa qué cantidad tienes que quitar o comparar.'),
    '*': t('Pensa en els grups iguals i quants elements hi ha a cada grup.', 'Piensa en los grupos iguales y cuántos elementos hay en cada grupo.'),
    '/': t('Pensa com repartir la quantitat en parts iguals.', 'Piensa cómo repartir la cantidad en partes iguales.'),
  };
  const firstExpression = (locale: Locale) => {
    const given = new Set((`${problem.statement[locale]} ${problem.question[locale]}`.match(/\d+/g) ?? []).map(Number));
    const match = problem.steps[0].expression.match(/^\s*(\d+)\s*([+\-*/])\s*(\d+)\s*$/);
    if (!match) throw new Error(`Unsupported step for ${problem.id}: ${problem.steps[0].expression}`);
    const show = (value: string) => given.has(Number(value)) ? value : '□';
    if (match[2] === '/') {
      // A half, a double or two equal parts gives the number of groups even
      // when the story spells it out instead of using the digit 2.
      const mentionsTwo = /\b(doble|meitat|mitad|dues|dos)\b/i.test(`${problem.statement[locale]} ${problem.question[locale]}`);
      const groups = match[3] === '2' && mentionsTwo ? '2' : show(match[3]);
      return `□ × ${groups} = ${show(match[1])}`;
    }
    const symbol: Record<string, string> = { '+': '+', '-': '−', '*': '×' };
    return `${show(match[1])} ${symbol[match[2]]} ${show(match[3])} = □`;
  };
  const contextualHint = (locale: Locale) => {
    const original = problem.hints[0][locale];
    const given = new Set((`${problem.statement[locale]} ${problem.question[locale]}`.match(/\d+/g) ?? []).map(Number));
    const results = new Set(problem.steps.map((step) => step.result));
    const numbers = (original.match(/\d+/g) ?? []).map(Number);
    const safe = !/[=→÷/]/.test(original) && numbers.every((number) => given.has(number) && !results.has(number));
    if (safe) return original;
    return locale === 'ca'
      ? `Rellegeix la pregunta: «${problem.question.ca}». Encercla en paper les dades que et poden ajudar.`
      : `Vuelve a leer la pregunta: «${problem.question.es}». Rodea en papel los datos que te pueden ayudar.`;
  };
  return [
    t(contextualHint('ca'), contextualHint('es')),
    t(`${strategies[operation ?? '']?.ca ?? 'Relaciona les dades amb la pregunta.'} Dibuixa o escriu aquesta relació al paper.`, `${strategies[operation ?? '']?.es ?? 'Relaciona los datos con la pregunta.'} Dibuja o escribe esta relación en el papel.`),
    t(`Un primer càlcul possible per escriure al paper: ${firstExpression('ca')}. Omple les caselles amb el que dedueixis o calculis.${problem.steps.length > 1 ? ' Després, pensa què has de fer amb el resultat per respondre la pregunta.' : ''}`, `Un primer cálculo posible para escribir en el papel: ${firstExpression('es')}. Completa las casillas con lo que deduzcas o calcules.${problem.steps.length > 1 ? ' Después, piensa qué hacer con el resultado para responder a la pregunta.' : ''}`),
  ];
}

export const problems: Problem[] = [
  ...original,
  ...newProblems.map((p): Problem => ({
    id: p.id, level: Number(p.id[1]), title: p.title, statement: p.statement, question: p.question,
    answer: { value: p.steps[p.steps.length - 1].result, unit: p.unit },
    steps: p.steps, visualModel: p.visualModel, hints: p.hints, workedSolution: p.solution,
  })),
].map((problem) => ({ ...problem, hints: paperHints(problem) })).sort((a, b) => a.id.localeCompare(b.id));

assertValidProblems(problems);
