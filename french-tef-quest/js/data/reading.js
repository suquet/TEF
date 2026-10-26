/* Reading passages. All texts are ORIGINAL practice texts inspired by common themes.
   Names and facts are fictional. Each sentence: [fr, en, es]. Questions: q, o (options), a (index of correct), ex / exs (explanations en / es). */
window.TEF = window.TEF || {};
TEF.articles = [
  {
    id: "ia-bureau", cat: "tech", lvl: "B1", mins: 2,
    title: ["Les assistants IA arrivent au bureau", "AI assistants arrive at the office", "Los asistentes de IA llegan a la oficina"],
    kw: [["gagner du temps", "to save time", "ahorrar tiempo"], ["résumer", "to summarize", "resumir"], ["s'inquiéter", "to worry", "preocuparse"], ["vérifier", "to check", "verificar"]],
    s: [
      ["De plus en plus d'entreprises utilisent des assistants d'intelligence artificielle pour gagner du temps.", "More and more companies are using artificial intelligence assistants to save time.", "Cada vez más empresas utilizan asistentes de inteligencia artificial para ahorrar tiempo."],
      ["Ces outils rédigent des courriels, résument des réunions et organisent les rendez-vous.", "These tools write emails, summarize meetings and organize appointments.", "Estas herramientas redactan correos, resumen reuniones y organizan citas."],
      ["Beaucoup d'employés apprécient cette aide, mais certains s'inquiètent pour la protection de leurs données.", "Many employees appreciate this help, but some worry about the protection of their data.", "Muchos empleados valoran esta ayuda, pero algunos se preocupan por la protección de sus datos."],
      ["Les experts conseillent donc de vérifier chaque résultat avant de l'envoyer à un client.", "Experts therefore advise checking every result before sending it to a client.", "Por eso, los expertos aconsejan verificar cada resultado antes de enviarlo a un cliente."],
      ["Selon eux, la technologie ne remplacera pas les humains; elle changera plutôt la nature de leur travail.", "According to them, technology will not replace humans; it will rather change the nature of their work.", "Según ellos, la tecnología no reemplazará a los humanos; más bien cambiará la naturaleza de su trabajo."]
    ],
    qs: [
      { q: "Que conseillent les experts?", o: ["De vérifier les résultats", "D'arrêter d'utiliser l'IA", "D'embaucher plus de clients"], a: 0, ex: "They advise checking every result before sending it to a client.", exs: "Aconsejan verificar cada resultado antes de enviarlo a un cliente." },
      { q: "De quoi certains employés s'inquiètent-ils?", o: ["Du prix des outils", "De la protection de leurs données", "Du manque de temps"], a: 1, ex: "Some employees worry about data protection.", exs: "Algunos empleados se preocupan por la protección de sus datos." }
    ]
  },
  {
    id: "mot-de-passe", cat: "tech", lvl: "B1", mins: 2,
    title: ["Un mot de passe ne suffit plus", "A password is no longer enough", "Una contraseña ya no basta"],
    kw: [["piraté", "hacked", "hackeado"], ["suspect", "suspicious", "sospechoso"], ["la prudence", "caution", "la prudencia"], ["éviter", "to avoid", "evitar"]],
    s: [
      ["Chaque jour, de nombreux comptes en ligne sont piratés.", "Every day, many online accounts are hacked.", "Cada día, muchas cuentas en línea son hackeadas."],
      ["Un mot de passe trop simple est une porte ouverte pour les pirates informatiques.", "A password that is too simple is an open door for hackers.", "Una contraseña demasiado simple es una puerta abierta para los hackers."],
      ["C'est pourquoi les spécialistes recommandent l'authentification à deux facteurs.", "That is why specialists recommend two-factor authentication.", "Por eso los especialistas recomiendan la autenticación de dos factores."],
      ["Avec cette méthode, il faut entrer un code reçu sur le téléphone en plus du mot de passe.", "With this method, you must enter a code received on your phone in addition to the password.", "Con este método, hay que ingresar un código recibido en el teléfono además de la contraseña."],
      ["Il est aussi important de ne jamais cliquer sur un lien suspect dans un courriel.", "It is also important never to click on a suspicious link in an email.", "También es importante no hacer clic nunca en un enlace sospechoso de un correo."],
      ["Un peu de prudence peut éviter beaucoup de problèmes.", "A little caution can avoid a lot of problems.", "Un poco de prudencia puede evitar muchos problemas."]
    ],
    qs: [
      { q: "Que faut-il entrer en plus du mot de passe?", o: ["Un code reçu sur le téléphone", "Une adresse courriel", "Un numéro de carte"], a: 0, ex: "Two-factor authentication needs a code sent to your phone.", exs: "La autenticación de dos factores requiere un código enviado a su teléfono." },
      { q: "Pourquoi un mot de passe simple est-il dangereux?", o: ["Il est difficile à retenir", "Il facilite la tâche des pirates", "Il coûte plus cher"], a: 1, ex: "A simple password is an open door for hackers.", exs: "Una contraseña simple es una puerta abierta para los hackers." }
    ]
  },
  {
    id: "studio-aurore", cat: "game", lvl: "B1", mins: 2,
    title: ["Un studio montréalais lance son premier jeu", "A Montréal studio launches its first game", "Un estudio de Montreal lanza su primer juego"],
    kw: [["indépendant", "independent", "independiente"], ["une inondation", "a flood", "una inundación"], ["abordable", "affordable", "asequible"], ["un commentaire", "a comment, review", "un comentario"]],
    s: [
      ["Studio Aurore, un petit studio indépendant fictif de Montréal, présente son premier jeu vidéo.", "Studio Aurore, a small fictional independent studio in Montréal, presents its first video game.", "Studio Aurore, un pequeño estudio independiente ficticio de Montreal, presenta su primer videojuego."],
      ["Le jeu raconte l'histoire d'un robot qui doit sauver sa ville des inondations.", "The game tells the story of a robot that must save its city from floods.", "El juego cuenta la historia de un robot que debe salvar su ciudad de las inundaciones."],
      ["Les joueurs pourront jouer seuls ou en équipe, sur ordinateur et sur console.", "Players will be able to play alone or in a team, on computer and on console.", "Los jugadores podrán jugar solos o en equipo, en computadora y en consola."],
      ["Le prix sera d'environ vingt dollars, ce qui est abordable pour un jeu de cette qualité.", "The price will be about twenty dollars, which is affordable for a game of this quality.", "El precio será de unos veinte dólares, lo cual es asequible para un juego de esta calidad."],
      ["Les premiers commentaires en ligne sont très positifs.", "The first online reviews are very positive.", "Los primeros comentarios en línea son muy positivos."]
    ],
    qs: [
      { q: "Quelle est l'histoire du jeu?", o: ["Un robot veut sauver sa ville", "Un joueur gagne un tournoi", "Une équipe construit un studio"], a: 0, ex: "A robot must save its city from floods.", exs: "Un robot debe salvar su ciudad de las inundaciones." },
      { q: "Comment peut-on jouer?", o: ["Seulement en ligne", "Seul ou en équipe", "Seulement sur console"], a: 1, ex: "Alone or in a team, on computer and console.", exs: "Solo o en equipo, en computadora y consola." }
    ]
  },
  {
    id: "jeux-cerveau", cat: "game", lvl: "B2", mins: 2,
    title: ["Le jeu vidéo, bon pour le cerveau?", "Are video games good for the brain?", "¿Los videojuegos son buenos para el cerebro?"],
    kw: [["reprocher", "to blame, to reproach", "reprochar"], ["la concentration", "focus", "la concentración"], ["un équilibre", "a balance", "un equilibrio"], ["avec modération", "in moderation", "con moderación"]],
    s: [
      ["Pendant longtemps, on a reproché aux jeux vidéo de rendre les jeunes paresseux.", "For a long time, video games were blamed for making young people lazy.", "Durante mucho tiempo se reprochó a los videojuegos hacer perezosos a los jóvenes."],
      ["Aujourd'hui, plusieurs recherches suggèrent que certains jeux améliorent la concentration et la rapidité de réaction.", "Today, several studies suggest that some games improve focus and reaction speed.", "Hoy, varias investigaciones sugieren que algunos juegos mejoran la concentración y la rapidez de reacción."],
      ["Les jeux de stratégie, par exemple, obligent les joueurs à planifier et à prendre des décisions rapidement.", "Strategy games, for example, force players to plan and make decisions quickly.", "Los juegos de estrategia, por ejemplo, obligan a los jugadores a planificar y tomar decisiones rápidamente."],
      ["Cependant, les spécialistes rappellent qu'il faut garder un équilibre avec le sommeil, le sport et les amis.", "However, specialists remind us that we must keep a balance with sleep, sports and friends.", "Sin embargo, los especialistas recuerdan que hay que mantener un equilibrio con el sueño, el deporte y los amigos."],
      ["Jouer deux heures par jour avec modération n'est pas la même chose que jouer toute la nuit.", "Playing two hours a day in moderation is not the same as playing all night.", "Jugar dos horas al día con moderación no es lo mismo que jugar toda la noche."]
    ],
    qs: [
      { q: "Que suggèrent plusieurs recherches?", o: ["Les jeux rendent paresseux", "Certains jeux améliorent la concentration", "Les jeux remplacent le sport"], a: 1, ex: "Some games improve focus and reaction speed.", exs: "Algunos juegos mejoran la concentración y la rapidez de reacción." },
      { q: "Que rappellent les spécialistes?", o: ["Il faut garder un équilibre", "Il faut jouer toute la nuit", "Il faut éviter les jeux de stratégie"], a: 0, ex: "Keep a balance with sleep, sports and friends.", exs: "Mantener un equilibrio con el sueño, el deporte y los amigos." }
    ]
  },
  {
    id: "series-films", cat: "ent", lvl: "B1", mins: 2,
    title: ["Soirée cinéma : séries ou films?", "Movie night: series or films?", "Noche de cine: ¿series o películas?"],
    kw: [["hésiter", "to hesitate", "dudar"], ["s'attacher à", "to get attached to", "encariñarse con"], ["un salon", "a living room", "una sala"], ["une salle", "a theatre", "una sala de cine"]],
    s: [
      ["La fin de semaine dernière, nous avons hésité entre regarder un film ou commencer une nouvelle série.", "Last weekend, we hesitated between watching a movie or starting a new series.", "El fin de semana pasado dudamos entre ver una película o empezar una nueva serie."],
      ["Une série permet de suivre des personnages pendant des dizaines d'heures et de s'attacher à eux.", "A series lets you follow characters for dozens of hours and get attached to them.", "Una serie permite seguir a los personajes durante decenas de horas y encariñarse con ellos."],
      ["Un film, en revanche, raconte une histoire complète en moins de deux heures.", "A film, on the other hand, tells a complete story in under two hours.", "Una película, en cambio, cuenta una historia completa en menos de dos horas."],
      ["Avec la diffusion en continu, on peut tout regarder sans quitter son salon.", "With streaming, you can watch everything without leaving your living room.", "Con el streaming, se puede ver todo sin salir de la sala."],
      ["Pourtant, beaucoup de gens disent que rien ne remplace l'ambiance d'une salle de cinéma.", "Yet many people say that nothing replaces the atmosphere of a movie theatre.", "Sin embargo, mucha gente dice que nada reemplaza el ambiente de una sala de cine."]
    ],
    qs: [
      { q: "Quel est l'avantage d'un film selon le texte?", o: ["Il raconte une histoire complète rapidement", "Il dure des dizaines d'heures", "Il coûte moins cher"], a: 0, ex: "A film tells a complete story in under two hours.", exs: "Una película cuenta una historia completa en menos de dos horas." },
      { q: "Que disent beaucoup de gens?", o: ["Le salon est trop petit", "Rien ne remplace la salle de cinéma", "Les séries sont ennuyeuses"], a: 1, ex: "They say nothing replaces the atmosphere of a cinema.", exs: "Dicen que nada reemplaza el ambiente de un cine." }
    ]
  },
  {
    id: "festival-rivage", cat: "ent", lvl: "B1", mins: 2,
    title: ["Le festival Rivage revient cet été", "The Rivage festival returns this summer", "El festival Rivage regresa este verano"],
    kw: [["une programmation", "a lineup", "una programación"], ["gratuitement", "for free", "gratis"], ["un bénévole", "a volunteer", "un voluntario"], ["le transport en commun", "public transit", "el transporte público"]],
    s: [
      ["Le festival Rivage, un événement fictif, réunit chaque été des artistes francophones de partout au Canada.", "The Rivage festival, a fictional event, brings together francophone artists from all over Canada every summer.", "El festival Rivage, un evento ficticio, reúne cada verano a artistas francófonos de todo Canadá."],
      ["Cette année, la programmation comprend du rap, de l'électro et de la musique traditionnelle.", "This year, the lineup includes rap, electro and traditional music.", "Este año, la programación incluye rap, electrónica y música tradicional."],
      ["Les billets pour la fin de semaine coûtent soixante dollars, mais les enfants entrent gratuitement.", "Weekend tickets cost sixty dollars, but children get in for free.", "Las entradas para el fin de semana cuestan sesenta dólares, pero los niños entran gratis."],
      ["Les organisateurs encouragent les visiteurs à utiliser le transport en commun pour se rendre sur le site.", "The organizers encourage visitors to use public transit to get to the site.", "Los organizadores animan a los visitantes a usar el transporte público para llegar al sitio."],
      ["Si vous voulez pratiquer votre français, c'est une occasion idéale pour parler avec des artistes et des bénévoles.", "If you want to practise your French, it is an ideal chance to talk with artists and volunteers.", "Si quieres practicar tu francés, es una ocasión ideal para hablar con artistas y voluntarios."]
    ],
    qs: [
      { q: "Combien coûtent les billets pour la fin de semaine?", o: ["Quarante dollars", "Soixante dollars", "Seize dollars"], a: 1, ex: "Soixante = 60. Watch out for seize (16) and soixante (60)!", exs: "Soixante = 60. ¡Cuidado con seize (16) y soixante (60)!" },
      { q: "Qui entre gratuitement?", o: ["Les bénévoles", "Les étudiants", "Les enfants"], a: 2, ex: "Children get in for free.", exs: "Los niños entran gratis." }
    ]
  },
  {
    id: "mode-hybride", cat: "biz", lvl: "B1", mins: 2,
    title: ["Travailler en mode hybride", "Working in hybrid mode", "Trabajar en modalidad híbrida"],
    kw: [["le télétravail", "remote work", "el teletrabajo"], ["un horaire", "a schedule", "un horario"], ["un gestionnaire", "a manager", "un gerente"], ["craindre", "to fear", "temer"]],
    s: [
      ["Depuis quelques années, le télétravail est devenu courant dans de nombreuses entreprises.", "For a few years now, remote work has become common in many companies.", "Desde hace algunos años, el teletrabajo se ha vuelto común en muchas empresas."],
      ["Beaucoup d'employés choisissent maintenant un horaire hybride : deux jours au bureau et trois jours à la maison.", "Many employees now choose a hybrid schedule: two days at the office and three days at home.", "Muchos empleados eligen ahora un horario híbrido: dos días en la oficina y tres días en casa."],
      ["Cette formule réduit le temps de déplacement et permet une meilleure conciliation travail-famille.", "This formula reduces commuting time and allows a better work-family balance.", "Esta fórmula reduce el tiempo de traslado y permite una mejor conciliación trabajo-familia."],
      ["En revanche, certains gestionnaires craignent que la communication entre collègues diminue.", "On the other hand, some managers fear that communication between colleagues will decrease.", "En cambio, algunos gerentes temen que la comunicación entre colegas disminuya."],
      ["Pour résoudre ce problème, plusieurs équipes organisent des réunions courtes mais régulières.", "To solve this problem, several teams organize short but regular meetings.", "Para resolver este problema, varios equipos organizan reuniones cortas pero regulares."]
    ],
    qs: [
      { q: "Que permet l'horaire hybride?", o: ["Réduire le temps de déplacement", "Travailler moins d'heures", "Changer d'entreprise"], a: 0, ex: "It reduces commuting time and improves work-family balance.", exs: "Reduce el tiempo de traslado y mejora la conciliación trabajo-familia." },
      { q: "Que craignent certains gestionnaires?", o: ["Un salaire plus bas", "Une communication plus faible", "Un manque de bureaux"], a: 1, ex: "They fear communication between colleagues will decrease.", exs: "Temen que la comunicación entre colegas disminuya." }
    ]
  },
  {
    id: "lancer-produit", cat: "biz", lvl: "B2", mins: 3,
    title: ["Lancer un produit sur le marché canadien", "Launching a product in the Canadian market", "Lanzar un producto en el mercado canadiense"],
    kw: [["le public", "the audience", "el público"], ["l'étiquetage", "labelling", "el etiquetado"], ["un partenaire", "a partner", "un socio"], ["ajuster", "to adjust", "ajustar"]],
    s: [
      ["Avant de lancer un produit au Canada, une entreprise doit bien comprendre son public.", "Before launching a product in Canada, a company must understand its audience well.", "Antes de lanzar un producto en Canadá, una empresa debe comprender bien a su público."],
      ["Le pays est bilingue; il est donc souvent nécessaire d'offrir le contenu en français et en anglais.", "The country is bilingual; it is therefore often necessary to offer content in French and English.", "El país es bilingüe; por lo tanto, a menudo es necesario ofrecer el contenido en francés e inglés."],
      ["Au Québec, la loi protège la langue française et impose des règles précises pour l'affichage et l'étiquetage.", "In Québec, the law protects the French language and sets precise rules for signage and labelling.", "En Quebec, la ley protege el idioma francés e impone reglas precisas para la rotulación y el etiquetado."],
      ["Une bonne campagne combine donc des messages clairs, des partenaires locaux et un budget réaliste.", "A good campaign therefore combines clear messages, local partners and a realistic budget.", "Una buena campaña combina, por lo tanto, mensajes claros, socios locales y un presupuesto realista."],
      ["Enfin, il faut mesurer les résultats chaque semaine afin d'ajuster la stratégie.", "Finally, you must measure results every week in order to adjust the strategy.", "Por último, hay que medir los resultados cada semana para ajustar la estrategia."]
    ],
    qs: [
      { q: "Pourquoi offrir le contenu en deux langues?", o: ["Parce que le pays est bilingue", "Parce que c'est moins cher", "Parce que les clients sont jeunes"], a: 0, ex: "Canada is bilingual, so content is often offered in both languages.", exs: "Canadá es bilingüe, por eso el contenido suele ofrecerse en ambos idiomas." },
      { q: "Pourquoi mesurer les résultats chaque semaine?", o: ["Pour embaucher plus de monde", "Pour ajuster la stratégie", "Pour changer de produit"], a: 1, ex: "Measure weekly in order to adjust the strategy (afin d'ajuster).", exs: "Medir cada semana para ajustar la estrategia (afin d'ajuster)." }
    ]
  }
];
TEF.sources = {
  tech: [["Numerama", "https://www.numerama.com"], ["Journal du Geek", "https://www.journaldugeek.com"], ["Frandroid", "https://www.frandroid.com"], ["01net", "https://www.01net.com"]],
  game: [["Jeuxvideo.com", "https://www.jeuxvideo.com"], ["Gamekult", "https://www.gamekult.com"]],
  ent: [["AlloCiné", "https://www.allocine.fr"], ["ICI Radio-Canada", "https://ici.radio-canada.ca"], ["La Presse", "https://www.lapresse.ca"]],
  biz: [["Les Affaires", "https://www.lesaffaires.com"], ["Le Devoir", "https://www.ledevoir.com"], ["La Presse", "https://www.lapresse.ca"]],
  easy: [["RFI Journal en français facile", "https://francaisfacile.rfi.fr"], ["TV5MONDE Apprendre", "https://apprendre.tv5monde.com"], ["1jour1actu", "https://www.1jour1actu.com"]]
};
