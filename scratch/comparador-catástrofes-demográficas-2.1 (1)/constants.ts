import { GenocideData } from './types';

export const GENOCIDE_DATA: GenocideData[] = [
  {
    id: 'holocaust',
    name: 'El Holocausto (Alemania / Polonia, 1941-1945)',
    deaths: 6000000,
    deathsFormatted: '6.000.000',
    startDate: '1941',
    endDate: '1945',
    duration: '4 años',
    perpetrators: 'Alemania Nazi',
    leader: 'Adolf Hitler',
    victims: 'Judíos, romaníes, eslavos, discapacitados y homosexuales',
    location: {
      continent: 'Europa',
      country: 'Alemania / Polonia',
      city: 'Múltiples',
    },
    description: 'Genocidio sistemático patrocinado por el estado contra los judíos europeos.',
    quote: 'La implementación de la "Solución Final" industrializó la muerte a una escala sin precedentes, utilizando una red burocrática y tecnológica para exterminar sistemáticamente a dos tercios de la población judía de Europa.',
    color: '#ef4444', // Red 500
    contextTitle: 'La Industrialización de la Muerte y la Burocracia del Terror',
    contextBody: 'El Holocausto se distingue no solo por el número de víctimas, sino por la forma sistemática, industrial y estatal en que se llevó a cabo. Se utilizaron ferrocarriles, fábricas de muerte (cámaras de gas) y una inmensa burocracia administrativa dedicada exclusivamente a la eficiencia del asesinato masivo. Este evento redefinió el concepto de crímenes contra la humanidad y dejó una cicatriz permanente en la conciencia moral de la civilización occidental.'
  },
  {
    id: 'holodomor',
    name: 'Holodomor (Ucrania, 1932-1933)',
    deaths: 3900000,
    deathsFormatted: '3.900.000',
    startDate: '1932',
    endDate: '1933',
    duration: '1 año',
    perpetrators: 'Unión Soviética',
    leader: 'Iósif Stalin',
    victims: 'Campesinado ucraniano (Kulaks)',
    location: {
      continent: 'Europa',
      country: 'Ucrania',
      city: 'Nacional',
    },
    description: 'Hambruna artificial provocada por las políticas de colectivización soviéticas.',
    quote: 'Conocido como la "Muerte por Hambre", este genocidio fue orquestado mediante la confiscación sistemática de todas las reservas de alimentos de los campesinos ucranianos.',
    color: '#fb923c', // Orange 400 (Antes Orange 500)
    contextTitle: 'El Hambre como Arma Política de Represión Masiva',
    contextBody: 'El Holodomor no fue una falla de cosechas, sino una hambruna provocada por el hombre dirigida específicamente contra el campesinado ucraniano para aplastar sus aspiraciones de independencia. Brigadas de activistas recorrieron las aldeas confiscando hasta la última semilla, y se establecieron "listas negras" de aldeas a las que se prohibía el comercio, condenando a sus habitantes a una muerte lenta y agonizante mientras los silos de grano soviéticos permanecían llenos para la exportación.'
  },
  {
    id: 'bangladesh',
    name: 'Genocidio de Bangladesh (Bangladesh, 1971)',
    deaths: 3000000,
    deathsFormatted: '3.000.000',
    startDate: '1971',
    endDate: '1971',
    duration: '9 meses',
    perpetrators: 'Ejército de Pakistán',
    leader: 'Yahya Khan',
    victims: 'Intelectuales bengalíes y minoría hindú',
    location: {
      continent: 'Asia',
      country: 'Bangladesh',
      city: 'Dhaka',
    },
    description: 'Operación Searchlight y atrocidades durante la Guerra de Liberación.',
    quote: 'La Operación Searchlight marcó el inicio de una campaña brutal dirigida específicamente contra intelectuales, estudiantes y la minoría hindú.',
    color: '#22d3ee', // Cyan 400 (Antes Cyan 500)
    contextTitle: 'La Operación Searchlight y la Eliminación Sistemática de Intelectuales',
    contextBody: 'En un intento desesperado por sofocar el nacionalismo bengalí, el ejército de Pakistán Occidental lanzó una ofensiva militar brutal. Se atacaron específicamente universidades y barrios hindúes. La violencia no fue solo letal sino sexual; se estima que cientos de miles de mujeres fueron violadas sistemáticamente como arma de guerra. El objetivo era descabezar a la sociedad bengalí eliminando a sus futuros líderes, pensadores y académicos.'
  },
  {
    id: 'cambodia',
    name: 'Genocidio Camboyano (Camboya, 1975-1979)',
    deaths: 1700000,
    deathsFormatted: '1.700.000',
    startDate: '1975',
    endDate: '1979',
    duration: '4 años',
    perpetrators: 'Jemeres Rojos',
    leader: 'Pol Pot',
    victims: 'Intelectuales, profesionales, habitantes urbanos y minorías',
    location: {
      continent: 'Asia',
      country: 'Camboya',
      city: 'Nacional',
    },
    description: 'Ingeniería social radical y purga política en la Kampuchea Democrática.',
    quote: 'En su intento de reiniciar la civilización al "Año Cero", el régimen vació las ciudades, abolió el dinero y ejecutó a cualquiera considerado intelectual.',
    color: '#eab308', // Yellow 500
    contextTitle: 'El Año Cero y la Destrucción de la Modernidad',
    contextBody: 'Bajo el régimen de Pol Pot, Camboya se convirtió en un inmenso campo de trabajos forzados. La ideología de los Jemeres Rojos consideraba que la vida urbana, la medicina moderna, la educación y cualquier influencia extranjera eran corruptas. La población fue forzada a trabajar en el campo bajo amenaza de muerte. Se ejecutaba a personas por el simple hecho de hablar un idioma extranjero o usar gafas, perdiendo aproximadamente al 25% de la población total del país.'
  },
  {
    id: 'armenian',
    name: 'Genocidio Armenio (Imp. Otomano, 1915-1917)',
    deaths: 1500000,
    deathsFormatted: '1.500.000',
    startDate: '1915',
    endDate: '1917',
    duration: '2 años',
    perpetrators: 'Imperio Otomano',
    leader: 'Jóvenes Turcos',
    victims: 'Armenios cristianos, asirios y griegos pónticos',
    location: {
      continent: 'Asia',
      country: 'Imp. Otomano',
      city: 'Anatolia',
    },
    description: 'Deportación forzosa y exterminio de súbditos armenios otomanos.',
    quote: 'Considerado el primer genocidio moderno, implicó la deportación masiva de la población armenia hacia el desierto sirio mediante "marchas de la muerte".',
    color: '#c084fc', // Purple 400 (Antes Purple 500)
    contextTitle: 'Las Marchas de la Muerte y el Exterminio de una Minoría',
    contextBody: 'Aprovechando el caos de la Primera Guerra Mundial, el gobierno otomano orquestó la eliminación de la minoría cristiana armenia. Los líderes comunitarios fueron arrestados y ejecutados primero. Luego, la población civil fue forzada a caminar cientos de kilómetros hacia el desierto sin comida ni agua. Aquellos que no morían de agotamiento eran asesinados por escuadrones militares o bandas irregulares, en un intento de homogeneizar étnicamente Anatolia.'
  },
  {
    id: 'rwanda',
    name: 'Genocidio de Ruanda (Ruanda, 1994)',
    deaths: 800000,
    deathsFormatted: '800.000',
    startDate: '1994',
    endDate: '1994',
    duration: '100 días',
    perpetrators: 'Extremistas Hutu',
    leader: 'Théoneste Bagosora',
    victims: 'Población Tutsi y Hutus moderados',
    location: {
      continent: 'África',
      country: 'Ruanda',
      city: 'Kigali',
    },
    description: 'Masacre masiva de la población Tutsi y Hutus moderados.',
    quote: 'Caracterizado por una brutalidad íntima y vertiginosa, donde vecinos asesinaron a vecinos y familias fueron destruidas con machetes en cuestión de semanas.',
    color: '#84cc16', // Lime 500
    contextTitle: 'La Propaganda del Odio y la Masacre de Vecino contra Vecino',
    contextBody: 'El genocidio de Ruanda destaca por su velocidad y la participación civil masiva. Incitados por la Radio Télévision Libre des Mille Collines, que deshumanizaba a los tutsis llamándolos "cucarachas", ciudadanos comunes tomaron machetes contra sus propios vecinos, amigos e incluso familiares. En solo 100 días, se eliminó a aproximadamente el 70% de la población tutsi del país ante la inacción de la comunidad internacional.'
  },
  {
    id: 'darfur',
    name: 'Genocidio de Darfur (Sudán, 2003-Presente)',
    deaths: 400000,
    deathsFormatted: '400.000',
    startDate: '2003',
    endDate: 'Presente',
    duration: '20+ años',
    perpetrators: 'Milicias Janjaweed',
    leader: 'Omar al-Bashir',
    victims: 'Etnias Fur, Masalit y Zaghawa',
    location: {
      continent: 'África',
      country: 'Sudán',
      city: 'Darfur',
    },
    description: 'Limpieza étnica sistemática contra pueblos no árabes.',
    quote: 'Una campaña de tierra quemada donde las milicias montadas a caballo, respaldadas por bombardeos aéreos del gobierno, arrasaron aldeas enteras.',
    color: '#fbbf24', // Amber 400 (Antes Amber 600)
    contextTitle: 'Tierra Quemada y Desplazamiento Forzado en el Desierto',
    contextBody: 'El conflicto en Darfur se convirtió en genocidio cuando el gobierno sudanés armó a las milicias árabes Janjaweed para aplastar una rebelión. La táctica no fue solo combatir rebeldes, sino destruir la base de vida de las etnias Fur, Masalit y Zaghawa. Se quemaron aldeas, se envenenaron pozos de agua y se utilizó la violación masiva como arma para aterrorizar a la población y forzar su desplazamiento perpetuo hacia campos de refugiados.'
  },
  {
    id: 'al_anfal',
    name: 'Campaña de Al-Anfal (Irak, 1986-1989)',
    deaths: 182000,
    deathsFormatted: '182.000',
    startDate: '1986',
    endDate: '1989',
    duration: '3 años',
    perpetrators: 'Régimen Baazista (Irak)',
    leader: 'Saddam Hussein',
    victims: 'Kurdos iraquíes y minorías asiria/caldea',
    location: {
      continent: 'Asia',
      country: 'Irak',
      city: 'Kurdistán',
    },
    description: 'Campaña de exterminio contra la población kurda en el norte de Irak.',
    quote: 'El uso sistemático de armas químicas contra civiles en Halabja se convirtió en el símbolo de la brutalidad de esta campaña de "arabización" forzada.',
    color: '#f59e0b', // Amber 500 (Antes Amber 700 oscuro)
    contextTitle: 'Guerra Quimica y la Brutalidad Estatal',
    contextBody: 'La operación Al-Anfal, liderada en el terreno por Ali Hassan al-Majid ("Ali el Químico") bajo las órdenes de Saddam Hussein, buscaba una "solución final" al conflicto kurdo. Se caracterizó por el uso infame de gas mostaza y agentes nerviosos contra la población civil, la destrucción de 4,000 aldeas, campos de concentración y fusilamientos masivos de hombres en edad militar en los desiertos iraquíes.'
  },
  {
    id: 'rohingya',
    name: 'Genocidio Rohingya (Myanmar, 2017-Presente)',
    deaths: 25000,
    deathsFormatted: '25.000+',
    startDate: '2017',
    endDate: 'Presente',
    duration: 'En curso',
    perpetrators: 'Ejército Myanmar',
    leader: 'Min Aung Hlaing',
    victims: 'Musulmanes Rohingya',
    location: {
      continent: 'Asia',
      country: 'Myanmar',
      city: 'Rakhine',
    },
    description: 'Persecución militar y expulsión masiva de la minoría musulmana.',
    quote: 'Descrito por la ONU como un "ejemplo de libro de texto de limpieza étnica", el ejército lanzó operaciones caracterizadas por incendios y ejecuciones.',
    color: '#2dd4bf', // Teal 400 (Antes Teal 500)
    contextTitle: 'Limpieza Étnica y la Crisis de los Apátridas',
    contextBody: 'Los Rohingya, considerados la minoría más perseguida del mundo, fueron objeto de una brutal campaña militar destinada a borrarlos de la historia de Myanmar. Soldados y turbas locales quemaron aldeas enteras con familias dentro. La brutalidad extrema provocó el éxodo de casi un millón de personas hacia Bangladesh, creando el campo de refugiados más grande del mundo y dejando a todo un pueblo sin estado, sin derechos y sin hogar.'
  },
  {
    id: 'uyghur',
    name: 'Genocidio Uigur (China, 2014-Presente)',
    deaths: 10000,
    deathsFormatted: '10.000+ (Estimado)',
    startDate: '2014',
    endDate: 'Presente',
    duration: 'En curso',
    perpetrators: 'PC Chino',
    leader: 'Xi Jinping',
    victims: 'Uigures y minorías musulmanas',
    location: {
      continent: 'Asia',
      country: 'China',
      city: 'Xinjiang',
    },
    description: 'Internamiento masivo y destrucción cultural.',
    quote: 'Un esfuerzo sistemático por reeducar y asimilar forzosamente a la población uigur mediante una vasta red de campos de internamiento.',
    color: '#60a5fa', // Blue 400 (Antes Blue 500)
    contextTitle: 'Vigilancia Digital y Borrado Cultural Sistemático',
    contextBody: 'En la región de Xinjiang, el gobierno chino ha implementado un sistema de vigilancia de alta tecnología para controlar cada aspecto de la vida de la minoría uigur. Más de un millón de personas han sido detenidas arbitrariamente en campos de "reeducación" diseñados para despojarles de su identidad religiosa y cultural. Las denuncias incluyen esterilizaciones forzadas para reducir la tasa de natalidad de la población uigur, constituyendo una forma moderna y silenciosa de genocidio.'
  },
  {
    id: 'srebrenica',
    name: 'Genocidio de Srebrenica (Bosnia y H., 1995)',
    deaths: 8372,
    deathsFormatted: '8.372',
    startDate: 'Julio 1995',
    endDate: 'Julio 1995',
    duration: '11 días',
    perpetrators: 'Ejército República Srpska',
    leader: 'Ratko Mladić',
    victims: 'Hombres y niños Bosniaks (musulmanes)',
    location: {
      continent: 'Europa',
      country: 'Bosnia y H.',
      city: 'Srebrenica',
    },
    description: 'Masacre de varones bosnios musulmanes en una zona segura de la ONU.',
    quote: 'Considerado el peor crimen en suelo europeo desde la Segunda Guerra Mundial, miles de hombres y niños fueron ejecutados sistemáticamente y enterrados en fosas comunes.',
    color: '#94a3b8', // Slate 400 (Antes Slate 500 oscuro)
    contextTitle: 'La Falla de la Protección Internacional y la Masacre Sistemática',
    contextBody: 'En julio de 1995, las fuerzas serbobosnias invadieron Srebrenica, una zona declarada "segura" por las Naciones Unidas y protegida por cascos azules holandeses. Separaron a los hombres y niños varones de las mujeres, y en el transcurso de pocos días, ejecutaron a más de 8.000 de ellos en campos, escuelas y almacenes. Esta atrocidad expuso trágicamente la incapacidad de la comunidad internacional para prevenir el genocidio incluso con presencia militar en el terreno.'
  },
  {
    id: 'yazidi',
    name: 'Genocidio Yazidí (Irak, 2014)',
    deaths: 5000,
    deathsFormatted: '5.000+',
    startDate: '2014',
    endDate: '2014',
    duration: 'Meses',
    perpetrators: 'Estado Islámico',
    leader: 'Abu Bakr al-Baghdadi',
    victims: 'Pueblo Yazidí',
    location: {
      continent: 'Asia',
      country: 'Irak',
      city: 'Sinjar',
    },
    description: 'Masacre y esclavitud sexual de la minoría yazidí.',
    quote: 'En un ataque relámpago, los hombres fueron ejecutados en fosas comunes y miles de mujeres fueron vendidas en mercados de esclavos.',
    color: '#818cf8', // Indigo 400 (Antes Indigo 500)
    contextTitle: 'Esclavitud Sexual Institucionalizada en el Siglo XXI',
    contextBody: 'El ataque de ISIS contra los Yazidíes en el Monte Sinjar fue impulsado por una ideología extremista que consideraba a este grupo religioso como "adoradores del diablo". Lo que distinguió a esta atrocidad fue la reactivación sistemática de la esclavitud. Mientras los hombres eran fusilados inmediatamente, las mujeres y niñas fueron capturadas, transportadas y vendidas con contratos de venta formales, sufriendo abusos inimaginables en un intento deliberado de destruir la estructura genética y social de la comunidad.'
  }
];