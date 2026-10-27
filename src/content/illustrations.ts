import type { Locale, Text } from './problems';

/** An illustrative context, never a source of quantities for solving a problem. */
export type Illustration = { src: string; alt: Text };

const scenes = {
  classroom: {
    src: '/illustrations/classroom.jpg',
    alt: { ca: 'Una aula amb llibres i material escolar damunt d’una taula.', es: 'Un aula con libros y material escolar sobre una mesa.' },
  },
  library: {
    src: '/illustrations/library.jpg',
    alt: { ca: 'Una biblioteca amb llibres i infants llegint.', es: 'Una biblioteca con libros y niños leyendo.' },
  },
  market: {
    src: '/illustrations/market.jpg',
    alt: { ca: 'Una parada de fruita en un mercat.', es: 'Un puesto de fruta en un mercado.' },
  },
  playground: {
    src: '/illustrations/playground.jpg',
    alt: { ca: 'Un pati d’escola amb infants i pilotes.', es: 'Un patio de escuela con niños y pelotas.' },
  },
  bakery: {
    src: '/illustrations/bakery.jpg',
    alt: { ca: 'Una pastisseria il·lustrada amb animals i safates de dolços.', es: 'Una pastelería ilustrada con animales y bandejas de dulces.' },
  },
  stickers: {
    src: '/illustrations/stickers.jpg',
    alt: { ca: 'Un àlbum obert i adhesius de colors damunt d’una taula.', es: 'Un álbum abierto y pegatinas de colores sobre una mesa.' },
  },
  rain: {
    src: '/illustrations/rain.jpg',
    alt: { ca: 'La pluja cau al carrer, vista des d’una finestra.', es: 'La lluvia cae en la calle, vista desde una ventana.' },
  },
  bus: {
    src: '/illustrations/bus.jpg',
    alt: { ca: 'Un autobús arriba a una parada on hi ha persones esperant.', es: 'Un autobús llega a una parada donde hay personas esperando.' },
  },
  concert: {
    src: '/illustrations/concert.jpg',
    alt: { ca: 'Una sala amb files de seients i un escenari.', es: 'Una sala con filas de asientos y un escenario.' },
  },
  cards: {
    src: '/illustrations/cards.jpg',
    alt: { ca: 'Un infant mira una col·lecció de cromos sobre una taula.', es: 'Un niño mira una colección de cromos sobre una mesa.' },
  },
  art: {
    src: '/illustrations/art.jpg',
    alt: { ca: 'Material de dibuix i manualitats damunt d’una taula.', es: 'Material de dibujo y manualidades sobre una mesa.' },
  },
  puzzle: { src: '/illustrations/puzzle.jpg', alt: { ca: 'Uns infants completen un trencaclosques.', es: 'Unos niños completan un puzle.' } },
  garden: { src: '/illustrations/garden.jpg', alt: { ca: 'Uns infants cuiden un hort amb flors i plantes.', es: 'Unos niños cuidan un huerto con flores y plantas.' } },
  recycling: { src: '/illustrations/recycling.jpg', alt: { ca: 'Uns infants porten ampolles als contenidors de reciclatge.', es: 'Unos niños llevan botellas a los contenedores de reciclaje.' } },
  beach: { src: '/illustrations/beach.jpg', alt: { ca: 'Una criatura recull petxines a la platja.', es: 'Una niña recoge conchas en la playa.' } },
  cinema: { src: '/illustrations/cinema.jpg', alt: { ca: 'Un grup de persones mira una pel·lícula al cinema.', es: 'Un grupo de personas ve una película en el cine.' } },
  games: { src: '/illustrations/games.jpg', alt: { ca: 'Uns infants juguen amb cartes i joguines.', es: 'Unos niños juegan con cartas y juguetes.' } },
  marbles: { src: '/illustrations/marbles.jpg', alt: { ca: 'Uns infants juguen a bales al pati.', es: 'Unos niños juegan a las canicas en el patio.' } },
  apples: { src: '/illustrations/apples.jpg', alt: { ca: 'Un cistell de pomes al menjador escolar.', es: 'Una cesta de manzanas en el comedor escolar.' } },
  museum: { src: '/illustrations/museum.jpg', alt: { ca: 'Un grup d’infants visita un museu.', es: 'Un grupo de niños visita un museo.' } },
  fair: { src: '/illustrations/fair.jpg', alt: { ca: 'Una festa escolar amb paradetes i garlandes.', es: 'Una fiesta escolar con puestos y guirnaldas.' } },
  fruit: { src: '/illustrations/fruit.jpg', alt: { ca: 'Una parada de fruita amb cireres i pomes.', es: 'Un puesto de fruta con cerezas y manzanas.' } },
  boardgame: { src: '/illustrations/boardgame.jpg', alt: { ca: 'Uns infants juguen a un joc de taula.', es: 'Unos niños juegan a un juego de mesa.' } },
  bracelets: { src: '/illustrations/bracelets.jpg', alt: { ca: 'Uns infants fan polseres amb peces de colors.', es: 'Unos niños hacen pulseras con piezas de colores.' } },
  cups: { src: '/illustrations/cups.jpg', alt: { ca: 'Uns infants preparen una taula amb gots.', es: 'Unos niños preparan una mesa con vasos.' } },
  bicycles: { src: '/illustrations/bicycles.jpg', alt: { ca: 'Uns infants fan una excursió en bicicleta.', es: 'Unos niños hacen una excursión en bicicleta.' } },
  sports: { src: '/illustrations/sports.jpg', alt: { ca: 'Uns infants juguen en equips al camp d’esports.', es: 'Unos niños juegan en equipos en el campo de deportes.' } },
  calendar: { src: '/illustrations/calendar.jpg', alt: { ca: 'Un calendari penjat a la paret d’una aula.', es: 'Un calendario colgado en la pared de un aula.' } },
  mosaic: { src: '/illustrations/mosaic.jpg', alt: { ca: 'Uns infants fan un mosaic de rajoles al passadís.', es: 'Unos niños hacen un mosaico de baldosas en el pasillo.' } },
  seeds: { src: '/illustrations/seeds.jpg', alt: { ca: 'Bosses de llavors i eines de jardineria a l’hort.', es: 'Bolsas de semillas y herramientas de jardinería en el huerto.' } },
  collection: { src: '/illustrations/collection.jpg', alt: { ca: 'Uns infants recullen aliments i omplen bosses.', es: 'Unos niños recogen alimentos y llenan bolsas.' } },
  jerseys: { src: '/illustrations/jerseys.jpg', alt: { ca: 'Uns infants pleguen samarretes d’equip al camp d’esports.', es: 'Unos niños doblan camisetas de equipo en el campo de deportes.' } },
  bookstall: { src: '/illustrations/bookstall.jpg', alt: { ca: 'Uns infants miren llibres en una parada escolar.', es: 'Unos niños miran libros en un puesto escolar.' } },
} satisfies Record<string, Illustration>;

/**
 * Explicit editorial mapping. A null value means no current illustration is
 * sufficiently relevant to the story; it must not be replaced with an unrelated
 * picture. Scenes are shared, not problem-specific artwork.
 */
export const illustrations: Record<string, Illustration | null> = {
  'L1-01': scenes.stickers, 'L1-02': scenes.marbles, 'L1-03': scenes.classroom,
  'L1-04': scenes.apples, 'L1-05': scenes.museum, 'L1-06': scenes.bus,
  'L1-07': scenes.art, 'L1-08': scenes.garden, 'L1-09': scenes.beach,
  'L1-10': scenes.puzzle, 'L1-11': scenes.library, 'L1-12': scenes.recycling,

  'L2-01': scenes.market, 'L2-02': scenes.cards, 'L2-03': scenes.garden,
  'L2-04': scenes.bakery, 'L2-05': scenes.fair, 'L2-06': scenes.cards,
  'L2-07': scenes.art, 'L2-08': scenes.fruit, 'L2-09': scenes.boardgame,
  'L2-10': scenes.bracelets, 'L2-11': scenes.cups, 'L2-12': scenes.bus,

  'L3-01': scenes.rain, 'L3-02': scenes.playground, 'L3-03': scenes.library,
  'L3-04': scenes.cinema, 'L3-05': scenes.bicycles, 'L3-06': scenes.concert,
  'L3-07': scenes.bookstall, 'L3-08': scenes.classroom, 'L3-09': scenes.sports,
  'L3-10': scenes.concert, 'L3-11': scenes.art, 'L3-12': scenes.collection,

  'L4-01': scenes.art, 'L4-02': scenes.bakery, 'L4-03': scenes.concert,
  'L4-04': scenes.games, 'L4-05': scenes.fruit, 'L4-06': scenes.games,
  'L4-07': scenes.garden, 'L4-08': scenes.sports, 'L4-09': scenes.art,
  'L4-10': scenes.calendar, 'L4-11': scenes.mosaic, 'L4-12': scenes.seeds,

  'L5-01': scenes.cards, 'L5-02': scenes.playground, 'L5-03': scenes.art,
  'L5-04': scenes.market, 'L5-05': scenes.playground, 'L5-06': scenes.bakery,
  'L5-07': scenes.concert, 'L5-08': scenes.fruit, 'L5-09': scenes.cards,
  'L5-10': scenes.fair, 'L5-11': scenes.jerseys, 'L5-12': scenes.library,
};

export const problemsNeedingIllustrations = Object.entries(illustrations)
  .filter(([, illustration]) => illustration === null)
  .map(([id]) => id);

export function illustrationFor(id: string, locale: Locale): { src: string; alt: string } | null {
  const illustration = illustrations[id];
  return illustration ? { src: illustration.src, alt: illustration.alt[locale] } : null;
}
