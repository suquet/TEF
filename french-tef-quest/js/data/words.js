/* Vocabulary bank. Add words with W(fr, type, category, en, es, exampleFr, exampleEn, exampleEs)
   categories: tech, game, ent, biz, life, link */
window.TEF = window.TEF || {};
(function () {
  const W = (f, t, c, e, s, x, xe, xs) => ({ f, t, c, e, s, x, xe, xs });
  const list = [
    // TECH
    W("un appareil", "nm", "tech", "device", "dispositivo, aparato", "Mon appareil se met à jour automatiquement.", "My device updates automatically.", "Mi dispositivo se actualiza automáticamente."),
    W("une mise à jour", "nf", "tech", "update", "actualización", "Il faut installer la mise à jour avant ce soir.", "You need to install the update before tonight.", "Hay que instalar la actualización antes de esta noche."),
    W("télécharger", "v", "tech", "to download", "descargar", "J'ai téléchargé l'application hier.", "I downloaded the app yesterday.", "Descargué la aplicación ayer."),
    W("un mot de passe", "nm", "tech", "password", "contraseña", "N'oubliez pas de changer votre mot de passe.", "Don't forget to change your password.", "No olvide cambiar su contraseña."),
    W("un pirate informatique", "nm", "tech", "hacker", "hacker, pirata informático", "Un pirate informatique a volé des données.", "A hacker stole some data.", "Un hacker robó algunos datos."),
    W("l'intelligence artificielle", "nf", "tech", "artificial intelligence", "inteligencia artificial", "L'intelligence artificielle change notre façon de travailler.", "Artificial intelligence is changing the way we work.", "La inteligencia artificial está cambiando nuestra forma de trabajar."),
    W("un logiciel", "nm", "tech", "software", "programa, software", "Ce logiciel est gratuit pour les étudiants.", "This software is free for students.", "Este software es gratuito para los estudiantes."),
    W("un courriel", "nm", "tech", "email (Canadian French)", "correo electrónico", "Je vous enverrai un courriel demain matin.", "I will send you an email tomorrow morning.", "Le enviaré un correo electrónico mañana por la mañana."),
    W("en ligne", "loc", "tech", "online", "en línea", "Elle suit un cours en ligne.", "She is taking an online course.", "Ella toma un curso en línea."),
    W("un écran tactile", "nm", "tech", "touchscreen", "pantalla táctil", "L'écran tactile ne répond plus.", "The touchscreen no longer responds.", "La pantalla táctil ya no responde."),
    W("une panne", "nf", "tech", "breakdown, outage", "avería, caída del servicio", "Une panne a coupé le service pendant deux heures.", "An outage cut the service for two hours.", "Una caída cortó el servicio durante dos horas."),
    W("le stockage", "nm", "tech", "storage", "almacenamiento", "Je manque de stockage sur mon téléphone.", "I'm running out of storage on my phone.", "Me falta almacenamiento en mi teléfono."),
    // GAMES
    W("un joueur", "nm", "game", "player (f: une joueuse)", "jugador (f: jugadora)", "Les joueurs attendent la sortie du jeu avec impatience.", "Players are impatiently waiting for the game's release.", "Los jugadores esperan con impaciencia el lanzamiento del juego."),
    W("une manette", "nf", "game", "game controller", "mando, control", "J'ai branché ma manette à la console.", "I plugged my controller into the console.", "Conecté mi mando a la consola."),
    W("un niveau", "nm", "game", "level", "nivel", "Ce niveau est vraiment difficile.", "This level is really hard.", "Este nivel es realmente difícil."),
    W("battre un record", "v", "game", "to break a record", "batir un récord", "Elle a battu son record de vitesse.", "She broke her speed record.", "Ella batió su récord de velocidad."),
    W("une partie", "nf", "game", "a game, a round", "partida", "On fait une partie en ligne ce soir?", "Shall we play a game online tonight?", "¿Jugamos una partida en línea esta noche?"),
    W("un jeu vidéo", "nm", "game", "video game", "videojuego", "Ce jeu vidéo a remporté plusieurs prix.", "This video game won several awards.", "Este videojuego ganó varios premios."),
    W("la sortie", "nf", "game", "release, launch", "lanzamiento, salida", "La sortie du jeu est prévue en novembre.", "The game's release is planned for November.", "El lanzamiento del juego está previsto para noviembre."),
    W("un pointage", "nm", "game", "score (Canadian French)", "puntuación", "Mon pointage a doublé grâce à ce bonus.", "My score doubled thanks to this bonus.", "Mi puntuación se duplicó gracias a este bonus."),
    W("un tournoi", "nm", "game", "tournament", "torneo", "Le tournoi réunit les meilleures équipes du pays.", "The tournament brings together the country's best teams.", "El torneo reúne a los mejores equipos del país."),
    W("relever un défi", "v", "game", "to take up a challenge", "afrontar un desafío", "Il adore relever des défis difficiles.", "He loves taking on difficult challenges.", "Le encanta afrontar desafíos difíciles."),
    // ENTERTAINMENT
    W("une émission", "nf", "ent", "TV or radio show", "programa", "Cette émission passe tous les jeudis soir.", "This show airs every Thursday night.", "Este programa se emite todos los jueves por la noche."),
    W("une bande-annonce", "nf", "ent", "trailer", "tráiler", "La bande-annonce a été vue un million de fois.", "The trailer has been viewed a million times.", "El tráiler ha sido visto un millón de veces."),
    W("à l'affiche", "loc", "ent", "now showing", "en cartelera", "Quel film est à l'affiche cette semaine?", "Which movie is playing this week?", "¿Qué película está en cartelera esta semana?"),
    W("un réalisateur", "nm", "ent", "film director (f: une réalisatrice)", "director de cine (f: directora)", "La réalisatrice présentera son film à Toronto.", "The director will present her film in Toronto.", "La directora presentará su película en Toronto."),
    W("la diffusion en continu", "nf", "ent", "streaming (Canadian French)", "streaming, transmisión", "La diffusion en continu a changé nos habitudes.", "Streaming has changed our habits.", "El streaming ha cambiado nuestros hábitos."),
    W("un spectacle", "nm", "ent", "show, performance", "espectáculo", "Nous avons réservé des billets pour le spectacle.", "We booked tickets for the show.", "Reservamos entradas para el espectáculo."),
    W("un billet", "nm", "ent", "ticket", "entrada, boleto", "Les billets se sont vendus en quelques minutes.", "The tickets sold out in a few minutes.", "Las entradas se agotaron en pocos minutos."),
    W("un succès", "nm", "ent", "hit, success", "éxito", "Cette série est un énorme succès.", "This series is a huge hit.", "Esta serie es un enorme éxito."),
    W("sortir en salle", "v", "ent", "to be released in theatres", "estrenarse en cines", "Le film sortira en salle au printemps.", "The film will be released in theatres in the spring.", "La película se estrenará en cines en primavera."),
    W("un abonnement", "nm", "ent", "subscription", "suscripción", "J'ai annulé mon abonnement le mois dernier.", "I cancelled my subscription last month.", "Cancelé mi suscripción el mes pasado."),
    // BUSINESS
    W("une entreprise", "nf", "biz", "company", "empresa", "Cette entreprise recrute des ingénieurs.", "This company is hiring engineers.", "Esta empresa contrata ingenieros."),
    W("un client", "nm", "biz", "customer (f: une cliente)", "cliente", "Notre priorité, c'est la satisfaction du client.", "Our priority is customer satisfaction.", "Nuestra prioridad es la satisfacción del cliente."),
    W("un chiffre d'affaires", "nm", "biz", "revenue, turnover", "facturación, ingresos", "Le chiffre d'affaires a augmenté de dix pour cent.", "Revenue increased by ten percent.", "La facturación aumentó un diez por ciento."),
    W("une réunion", "nf", "biz", "meeting", "reunión", "La réunion commence à neuf heures.", "The meeting starts at nine o'clock.", "La reunión empieza a las nueve."),
    W("un délai", "nm", "biz", "deadline, time limit", "plazo", "Nous devons respecter le délai.", "We must meet the deadline.", "Debemos cumplir el plazo."),
    W("un partenariat", "nm", "biz", "partnership", "alianza, asociación", "Les deux sociétés ont signé un partenariat.", "The two companies signed a partnership.", "Las dos empresas firmaron una alianza."),
    W("un investissement", "nm", "biz", "investment", "inversión", "Cet investissement devrait rapporter gros.", "This investment should pay off big.", "Esta inversión debería dar muchos beneficios."),
    W("négocier", "v", "biz", "to negotiate", "negociar", "Elle a négocié un meilleur contrat.", "She negotiated a better contract.", "Ella negoció un mejor contrato."),
    W("une offre d'emploi", "nf", "biz", "job posting", "oferta de empleo", "J'ai répondu à une offre d'emploi intéressante.", "I responded to an interesting job posting.", "Respondí a una oferta de empleo interesante."),
    W("embaucher", "v", "biz", "to hire", "contratar", "L'entreprise va embaucher dix personnes.", "The company will hire ten people.", "La empresa contratará a diez personas."),
    W("atteindre un objectif", "v", "biz", "to reach a goal", "alcanzar un objetivo", "Nous avons atteint notre objectif trimestriel.", "We reached our quarterly goal.", "Alcanzamos nuestro objetivo trimestral."),
    W("le marché", "nm", "biz", "market", "mercado", "Le marché canadien est en pleine croissance.", "The Canadian market is growing rapidly.", "El mercado canadiense está en pleno crecimiento."),
    // LIFE & IMMIGRATION
    W("un permis de travail", "nm", "life", "work permit", "permiso de trabajo", "Il a demandé un permis de travail.", "He applied for a work permit.", "Él solicitó un permiso de trabajo."),
    W("la résidence permanente", "nf", "life", "permanent residence", "residencia permanente", "Elle rêve d'obtenir la résidence permanente.", "She dreams of getting permanent residence.", "Ella sueña con obtener la residencia permanente."),
    W("un dossier", "nm", "life", "file, application", "expediente, dossier", "Mon dossier est complet.", "My application file is complete.", "Mi expediente está completo."),
    W("s'installer", "v", "life", "to settle in", "instalarse", "Nous voulons nous installer près du lac.", "We want to settle near the lake.", "Queremos instalarnos cerca del lago."),
    W("un loyer", "nm", "life", "rent", "alquiler", "Le loyer a encore augmenté cette année.", "The rent went up again this year.", "El alquiler volvió a subir este año."),
    W("un déménagement", "nm", "life", "a move (house)", "mudanza", "Le déménagement est prévu pour juillet.", "The move is planned for July.", "La mudanza está prevista para julio."),
    W("un rendez-vous", "nm", "life", "appointment", "cita", "J'ai un rendez-vous chez le médecin à quinze heures.", "I have a doctor's appointment at three p.m.", "Tengo una cita con el médico a las tres de la tarde."),
    W("une démarche", "nf", "life", "procedure, step (admin)", "trámite, gestión", "Les démarches administratives prennent du temps.", "Administrative procedures take time.", "Los trámites administrativos llevan tiempo."),
    W("bilingue", "adj", "life", "bilingual", "bilingüe", "Un candidat bilingue a plus de chances.", "A bilingual candidate has a better chance.", "Un candidato bilingüe tiene más posibilidades."),
    W("se débrouiller", "v", "life", "to get by, to manage", "arreglárselas, defenderse", "Je me débrouille assez bien en français.", "I get by fairly well in French.", "Me defiendo bastante bien en francés."),
    // CONNECTORS (great for TEF writing and speaking)
    W("d'ailleurs", "adv", "link", "by the way, besides", "por cierto, además", "D'ailleurs, j'allais justement t'appeler.", "By the way, I was just about to call you.", "Por cierto, justamente iba a llamarte."),
    W("pourtant", "adv", "link", "yet, and yet", "sin embargo", "Il s'est entraîné; pourtant, il a échoué.", "He trained; yet he failed.", "Se entrenó; sin embargo, fracasó."),
    W("en revanche", "loc", "link", "on the other hand", "en cambio", "Le salaire est bas; en revanche, l'ambiance est super.", "The salary is low; on the other hand, the atmosphere is great.", "El salario es bajo; en cambio, el ambiente es genial."),
    W("néanmoins", "adv", "link", "nevertheless", "no obstante", "Le projet est risqué; néanmoins, il vaut la peine.", "The project is risky; nevertheless, it is worth it.", "El proyecto es arriesgado; no obstante, vale la pena."),
    W("par conséquent", "loc", "link", "therefore", "por consiguiente", "Le vol est annulé; par conséquent, nous restons ici.", "The flight is cancelled; therefore, we are staying here.", "El vuelo está cancelado; por consiguiente, nos quedamos aquí."),
    W("afin de", "loc", "link", "in order to (+ infinitive)", "con el fin de", "Je pratique chaque jour afin de réussir l'examen.", "I practise every day in order to pass the exam.", "Practico todos los días para aprobar el examen."),
    W("malgré", "prep", "link", "despite (+ noun)", "a pesar de", "Malgré la fatigue, elle a continué à étudier.", "Despite the tiredness, she kept studying.", "A pesar del cansancio, siguió estudiando."),
    W("bien que", "loc", "link", "although (+ subjunctive)", "aunque (+ subjuntivo)", "Bien qu'il soit tard, je veux finir cet exercice.", "Although it is late, I want to finish this exercise.", "Aunque es tarde, quiero terminar este ejercicio."),
    W("en effet", "loc", "link", "indeed", "en efecto", "En effet, les prix ont beaucoup augmenté.", "Indeed, prices have gone up a lot.", "En efecto, los precios han subido mucho."),
    W("quant à", "loc", "link", "as for", "en cuanto a", "Quant à moi, je préfère travailler le matin.", "As for me, I prefer working in the morning.", "En cuanto a mí, prefiero trabajar por la mañana.")
  ];

  // Interleave categories so each daily batch of 5 is varied.
  const groups = {};
  list.forEach(w => (groups[w.c] = groups[w.c] || []).push(w));
  const keys = Object.keys(groups);
  const out = [];
  let more = true;
  for (let i = 0; more; i++) {
    more = false;
    keys.forEach(k => { if (groups[k][i]) { out.push(groups[k][i]); more = true; } });
  }
  TEF.words = out;
  TEF.cats = { tech: "Tech", game: "Games", ent: "Entertainment", biz: "Business", life: "Life in Canada", link: "Connectors" };
})();
