/* Listening drills, dictation, writing prompts, quiz bank, phrase bank. */
window.TEF = window.TEF || {};

/* ---------- LISTENING ---------- */
TEF.listen = [
  {
    id: "gare", type: "Announcement", title: "Train station announcement", lvl: "A2",
    lines: [{ sp: "A", t: "Mesdames et messieurs, le train à destination d'Ottawa part du quai quatre à seize heures trente. En raison de travaux, il aura vingt minutes de retard. Nous vous prions de nous excuser pour ce désagrément." }],
    en: "Ladies and gentlemen, the train to Ottawa leaves from platform four at 4:30 p.m. Because of construction, it will be twenty minutes late. We apologize for the inconvenience.",
    es: "Señoras y señores, el tren con destino a Ottawa sale de la plataforma cuatro a las 16:30. Debido a obras, tendrá veinte minutos de retraso. Les pedimos disculpas por las molestias.",
    qs: [
      { q: "De quel quai part le train?", o: ["Quai 2", "Quai 4", "Quai 14"], a: 1, ex: "Quatre = 4 (not quatorze = 14).", exs: "Quatre = 4 (no quatorze = 14)." },
      { q: "Combien de minutes de retard?", o: ["Dix", "Vingt", "Trente"], a: 1, ex: "Vingt minutes late.", exs: "Veinte minutos de retraso." }
    ]
  },
  {
    id: "clinique", type: "Voicemail", title: "Clinic voicemail", lvl: "A2",
    lines: [{ sp: "A", t: "Bonjour, ici Karine de la clinique Saint-Laurent. Je vous appelle pour confirmer votre rendez-vous de mardi, à neuf heures quinze. N'oubliez pas d'apporter votre carte d'assurance maladie. Si vous ne pouvez pas venir, rappelez-nous au plus tard lundi midi." }],
    en: "Hello, this is Karine from the Saint-Laurent clinic. I'm calling to confirm your appointment on Tuesday at 9:15. Don't forget to bring your health insurance card. If you can't come, call us back by Monday noon at the latest.",
    es: "Buenos días, le habla Karine de la clínica Saint-Laurent. Llamo para confirmar su cita del martes a las 9:15. No olvide traer su tarjeta de seguro médico. Si no puede venir, llámenos a más tardar el lunes al mediodía.",
    qs: [
      { q: "Quand est le rendez-vous?", o: ["Lundi à midi", "Mardi à 9 h 15", "Mardi à 9 h 50"], a: 1, ex: "Mardi, neuf heures quinze.", exs: "Martes, nueve y cuarto." },
      { q: "Que faut-il apporter?", o: ["Un chèque", "Une carte d'identité", "La carte d'assurance maladie"], a: 2, ex: "La carte d'assurance maladie.", exs: "La tarjeta de seguro médico." }
    ]
  },
  {
    id: "jeu", type: "Dialogue", title: "Two friends talk about a game", lvl: "B1",
    lines: [
      { sp: "A", t: "Tu as vu la bande-annonce du nouveau jeu?" },
      { sp: "B", t: "Oui! Je pense l'acheter dès sa sortie, le douze novembre." },
      { sp: "A", t: "Moi, j'attends les commentaires avant de décider. Les derniers jeux de ce studio avaient des bogues." },
      { sp: "B", t: "C'est vrai, mais celui-là a l'air beaucoup mieux préparé." }
    ],
    en: "A: Did you see the trailer for the new game? B: Yes! I'm thinking of buying it as soon as it comes out, on November twelfth. A: Me, I'm waiting for reviews before deciding. This studio's last games had bugs. B: True, but this one looks much better prepared.",
    es: "A: ¿Viste el tráiler del nuevo juego? B: ¡Sí! Pienso comprarlo apenas salga, el doce de noviembre. A: Yo espero los comentarios antes de decidir. Los últimos juegos de este estudio tenían errores. B: Es cierto, pero este parece mucho mejor preparado.",
    qs: [
      { q: "Quand sort le jeu?", o: ["Le deux novembre", "Le douze novembre", "Le vingt novembre"], a: 1, ex: "Douze = 12. Deux = 2.", exs: "Douze = 12. Deux = 2." },
      { q: "Pourquoi le premier ami attend-il?", o: ["Il n'a pas d'argent", "Il veut lire les commentaires", "Il n'aime pas les bandes-annonces"], a: 1, ex: "He wants to read reviews first.", exs: "Quiere leer los comentarios primero." }
    ]
  },
  {
    id: "radio", type: "Radio", title: "Business news bulletin", lvl: "B2",
    lines: [{ sp: "A", t: "Voici les nouvelles économiques. Le prix de l'essence a légèrement baissé cette semaine. Du côté des entreprises, une société de logiciels ontarienne annonce l'embauche de deux cents personnes d'ici la fin de l'année. Enfin, les ventes au détail ont progressé de deux pour cent le mois dernier." }],
    en: "Here is the business news. The price of gas dropped slightly this week. On the corporate side, an Ontario software company announces it will hire two hundred people by the end of the year. Finally, retail sales rose by two percent last month. (Fictional bulletin.)",
    es: "Estas son las noticias económicas. El precio de la gasolina bajó ligeramente esta semana. Por el lado de las empresas, una compañía de software de Ontario anuncia la contratación de doscientas personas antes de fin de año. Por último, las ventas minoristas aumentaron un dos por ciento el mes pasado. (Boletín ficticio.)",
    qs: [
      { q: "Qu'est-ce qui a baissé cette semaine?", o: ["Le prix de l'essence", "Les ventes", "Le nombre d'employés"], a: 0, ex: "L'essence = gas.", exs: "L'essence = gasolina." },
      { q: "Combien de personnes l'entreprise va-t-elle embaucher?", o: ["Douze", "Deux cents", "Deux mille"], a: 1, ex: "Deux cents = 200.", exs: "Deux cents = 200." }
    ]
  },
  {
    id: "entrevue-radio", type: "Interview", title: "Learning French: an interview", lvl: "B2",
    lines: [
      { sp: "A", t: "Pourquoi avez-vous décidé d'apprendre le français?" },
      { sp: "B", t: "Pour des raisons professionnelles, mais aussi parce que j'adore la culture francophone." },
      { sp: "A", t: "Quelle est votre méthode?" },
      { sp: "B", t: "Je regarde une série par jour, je lis les nouvelles et je parle avec des amis, même quand je fais des erreurs." },
      { sp: "A", t: "Un conseil pour les débutants?" },
      { sp: "B", t: "Ne cherchez pas la perfection. Pratiquez chaque jour, même dix minutes." }
    ],
    en: "A: Why did you decide to learn French? B: For professional reasons, but also because I love francophone culture. A: What is your method? B: I watch one episode a day, I read the news and I talk with friends, even when I make mistakes. A: Any advice for beginners? B: Don't look for perfection. Practise every day, even ten minutes.",
    es: "A: ¿Por qué decidió aprender francés? B: Por razones profesionales, pero también porque me encanta la cultura francófona. A: ¿Cuál es su método? B: Veo un episodio al día, leo las noticias y hablo con amigos, incluso cuando cometo errores. A: ¿Algún consejo para principiantes? B: No busquen la perfección. Practiquen cada día, aunque sean diez minutos.",
    qs: [
      { q: "Pourquoi apprend-elle le français?", o: ["Pour voyager seulement", "Pour le travail et la culture", "Pour enseigner"], a: 1, ex: "Professional reasons + love of the culture.", exs: "Razones profesionales + amor por la cultura." },
      { q: "Quel conseil donne-t-elle?", o: ["Chercher la perfection", "Étudier une fois par mois", "Pratiquer chaque jour"], a: 2, ex: "Practise every day, even ten minutes.", exs: "Practicar cada día, aunque sean diez minutos." }
    ]
  },
  {
    id: "souper", type: "Voicemail", title: "Dinner plans (Québec accent of words)", lvl: "B1",
    lines: [{ sp: "A", t: "Salut, c'est Nathalie. Je t'appelle pour le souper de samedi. Finalement, on mange à dix-huit heures au lieu de dix-neuf heures, parce que mes parents doivent partir tôt. Apporte un dessert si tu peux. Il va neiger en fin de semaine, alors prends ton manteau et ta tuque!" }],
    en: "Hi, it's Nathalie. I'm calling about Saturday's dinner. We're eating at 6 p.m. instead of 7 p.m., because my parents have to leave early. Bring a dessert if you can. It's going to snow this weekend, so take your coat and your toque!",
    es: "Hola, soy Nathalie. Te llamo por la cena del sábado. Al final comemos a las seis en lugar de las siete, porque mis padres tienen que irse temprano. Trae un postre si puedes. Va a nevar este fin de semana, ¡así que lleva tu abrigo y tu gorro!",
    qs: [
      { q: "À quelle heure est le souper?", o: ["À 17 h", "À 18 h", "À 19 h"], a: 1, ex: "Dix-huit heures = 18 h. In Québec, souper = dinner (evening meal).", exs: "Dix-huit heures = 18 h. En Quebec, souper = cena." },
      { q: "Qu'est-ce qu'il faut apporter?", o: ["Un dessert", "Une tuque seulement", "Du pain"], a: 0, ex: "Apporte un dessert (and a coat and tuque for the snow).", exs: "Trae un postre (y abrigo y gorro por la nieve)." }
    ]
  }
];

TEF.dict = [
  ["Elle a acheté des billets pour le spectacle de samedi.", "She bought tickets for Saturday's show.", "Ella compró entradas para el espectáculo del sábado."],
  ["Je voudrais prendre rendez-vous avec le directeur.", "I would like to make an appointment with the director.", "Quisiera pedir una cita con el director."],
  ["Nous avons déménagé à Toronto au mois de mai.", "We moved to Toronto in May.", "Nos mudamos a Toronto en mayo."],
  ["Il faut que tu envoies le courriel avant midi.", "You need to send the email before noon.", "Tienes que enviar el correo antes del mediodía."],
  ["Ils ont négocié un contrat très avantageux.", "They negotiated a very advantageous contract.", "Negociaron un contrato muy ventajoso."],
  ["Quand je serai prêt, je passerai l'examen.", "When I'm ready, I'll take the exam.", "Cuando esté listo, presentaré el examen."],
  ["Malgré la pluie, les joueurs sont arrivés à l'heure.", "Despite the rain, the players arrived on time.", "A pesar de la lluvia, los jugadores llegaron a tiempo."],
  ["Si j'avais plus de temps, je regarderais plus de films en français.", "If I had more time, I would watch more movies in French.", "Si tuviera más tiempo, vería más películas en francés."],
  ["La mise à jour a réglé tous les problèmes.", "The update fixed all the problems.", "La actualización resolvió todos los problemas."],
  ["Qu'est-ce que vous avez fait la fin de semaine dernière?", "What did you do last weekend?", "¿Qué hicieron el fin de semana pasado?"]
];

/* ---------- WRITING ---------- */
TEF.write = [
  {
    id: "panne", sec: "A", min: 80, mins: 20, title: "Blackout in the neighbourhood",
    task: "Continuez l'article en racontant ce qui s'est passé ensuite (80 mots minimum).",
    taskEn: "Continue the article by telling what happened next (80 words minimum).",
    taskEs: "Continúe el artículo contando lo que pasó después (mínimo 80 palabras).",
    start: "Hier soir, une panne d'électricité a plongé tout un quartier de Toronto dans le noir pendant plusieurs heures. Les habitants ont d'abord cru à un simple problème temporaire, mais...",
    model: "Hier soir, une panne d'électricité a plongé tout un quartier de Toronto dans le noir pendant plusieurs heures. Les habitants ont d'abord cru à un simple problème temporaire, mais la situation s'est vite compliquée. Les feux de circulation se sont éteints, et plusieurs rues ont été bloquées. Heureusement, les voisins se sont entraidés : certains ont partagé des bougies, d'autres ont offert de la nourriture chaude aux personnes âgées. Vers minuit, les techniciens ont réussi à réparer la ligne endommagée par un arbre tombé. L'électricité est revenue, et les habitants ont applaudi. Selon la mairie, une enquête sera menée afin d'éviter une nouvelle panne."
  },
  {
    id: "portefeuille", sec: "A", min: 80, mins: 20, title: "The lost wallet",
    task: "Continuez l'article (80 mots minimum).",
    taskEn: "Continue the article (80 words minimum).", taskEs: "Continúe el artículo (mínimo 80 palabras).",
    start: "Un jeune étudiant a trouvé un portefeuille contenant mille dollars dans un autobus. Il hésitait sur ce qu'il devait faire, quand..."
  },
  {
    id: "finale", sec: "A", min: 80, mins: 20, title: "Power cut during the finale",
    task: "Continuez l'article (80 mots minimum).",
    taskEn: "Continue the article (80 words minimum).", taskEs: "Continúe el artículo (mínimo 80 palabras).",
    start: "Pendant un grand tournoi de jeux vidéo à Montréal, le courant s'est coupé juste avant la finale. Les milliers de spectateurs..."
  },
  {
    id: "teletravail", sec: "B", min: 200, mins: 40, title: "Remote work: for or against?",
    task: "Un ami pense que le télétravail réduit la productivité. Écrivez-lui une lettre pour donner votre point de vue avec des arguments et des exemples (200 mots minimum).",
    taskEn: "A friend thinks remote work lowers productivity. Write him a letter giving your point of view with arguments and examples (200 words minimum).",
    taskEs: "Un amigo piensa que el teletrabajo reduce la productividad. Escríbale una carta dando su punto de vista con argumentos y ejemplos (mínimo 200 palabras).",
    start: "",
    model: "Cher Marc,\n\nJ'ai bien reçu ton message et je comprends tes doutes, mais je ne suis pas tout à fait d'accord avec toi. À mon avis, le télétravail peut même augmenter la productivité, à condition d'être bien organisé.\n\nD'abord, on gagne beaucoup de temps. Quand on évite deux heures de transport par jour, on peut commencer à travailler plus tôt, avec plus d'énergie. Ensuite, la maison offre souvent un environnement plus calme que l'open space, ce qui aide à se concentrer sur les tâches difficiles. Par exemple, depuis que ma sœur travaille à distance, elle termine ses projets plus rapidement qu'avant.\n\nCertes, tu as raison sur un point : la communication entre collègues peut devenir plus difficile. En revanche, il existe des solutions simples, comme des réunions courtes chaque matin ou des messages clairs sur une plateforme commune. De plus, un horaire hybride permet de combiner les avantages du bureau et de la maison.\n\nPar conséquent, je pense que le problème n'est pas le télétravail lui-même, mais la façon de l'organiser. Que penses-tu d'essayer cette formule pendant un mois afin de comparer les résultats?\n\nDans l'attente de ta réponse, je t'embrasse.\n\nPat"
  },
  {
    id: "jeux-ecole", sec: "B", min: 200, mins: 40, title: "Video games at school",
    task: "Un journal local demande l'avis de ses lecteurs : faut-il utiliser des jeux vidéo à l'école? Écrivez une lettre au journal pour exprimer votre opinion (200 mots minimum).",
    taskEn: "A local newspaper asks readers: should video games be used at school? Write a letter to the editor giving your opinion (200 words minimum).",
    taskEs: "Un periódico local pregunta a sus lectores: ¿se deben usar videojuegos en la escuela? Escriba una carta al periódico expresando su opinión (mínimo 200 palabras).",
    start: ""
  },
  {
    id: "festival-ville", sec: "B", min: 200, mins: 40, title: "Improve the city festival",
    task: "Votre ville organise un festival chaque été. Écrivez une lettre à la mairie pour proposer trois améliorations et expliquer pourquoi elles sont utiles (200 mots minimum).",
    taskEn: "Your city holds a festival every summer. Write a letter to city hall proposing three improvements and explaining why they are useful (200 words minimum).",
    taskEs: "Su ciudad organiza un festival cada verano. Escriba una carta al ayuntamiento proponiendo tres mejoras y explicando por qué son útiles (mínimo 200 palabras).",
    start: ""
  }
];

TEF.phrases = [
  { g: "Open a formal letter", p: ["Madame, Monsieur,", "Je me permets de vous écrire afin de...", "Suite à votre annonce,", "Je vous écris au sujet de..."] },
  { g: "Give your opinion", p: ["À mon avis,", "Selon moi,", "Il me semble que", "Je suis convaincu(e) que", "Je ne suis pas tout à fait d'accord"] },
  { g: "Add and organize", p: ["D'abord,", "Ensuite,", "De plus,", "En outre,", "Par ailleurs,", "Enfin,"] },
  { g: "Contrast", p: ["Certes... mais", "En revanche,", "Pourtant,", "Néanmoins,", "Malgré", "Bien que"] },
  { g: "Examples and cause", p: ["Par exemple,", "En effet,", "Parce que", "Puisque", "C'est pourquoi", "Par conséquent,"] },
  { g: "Conclude", p: ["En conclusion,", "Pour résumer,", "Tout compte fait,", "Veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées."] }
];

TEF.checklist = [
  "Clear opening and closing",
  "At least 2 arguments with examples (Section B)",
  "10+ connectors (d'abord, en revanche, par conséquent...)",
  "Agreements: gender, number, past participles",
  "Accents and apostrophes checked",
  "Formal tone (vous) unless writing to a friend"
];

/* ---------- QUIZ ---------- */
// q: question with ___ ; o: options; a: index; e: tip EN; s: tip ES
TEF.quiz = [
  { q: "Il faut que tu ___ à l'heure demain.", o: ["es", "sois", "seras", "étais"], a: 1, e: "'Il faut que' is followed by the subjunctive: que tu sois.", s: "'Il faut que' va seguido del subjuntivo: que tu sois." },
  { q: "Hier, il pleuvait quand je ___ du bureau.", o: ["suis sorti", "sortais", "sortirai", "sortirais"], a: 0, e: "A completed action interrupts an ongoing one: imparfait + passé composé.", s: "Una acción completa interrumpe otra en curso: imparfait + passé composé." },
  { q: "Si j'avais plus de temps, je ___ plus de films.", o: ["regarde", "regarderai", "regarderais", "regardais"], a: 2, e: "Si + imparfait → conditionnel présent.", s: "Si + imparfait → condicional presente." },
  { q: "Tu as des amis à Montréal? — Oui, j'___ ai trois.", o: ["y", "en", "les", "leur"], a: 1, e: "'En' replaces a quantity or 'de + noun'.", s: "'En' reemplaza una cantidad o 'de + sustantivo'." },
  { q: "Tu vas à la réunion? — Oui, je ___ vais à dix heures.", o: ["y", "en", "le", "lui"], a: 0, e: "'Y' replaces 'à + place/thing'.", s: "'Y' reemplaza 'à + lugar/cosa'." },
  { q: "Elle est ___ au Canada en 2020.", o: ["arrivé", "arrivée", "arrivés", "arrivées"], a: 1, e: "With être, the past participle agrees with the subject (elle → feminine).", s: "Con être, el participio concuerda con el sujeto (elle → femenino)." },
  { q: "Les lettres que j'ai ___ sont sur la table.", o: ["écrit", "écrite", "écrits", "écrites"], a: 3, e: "With avoir, agree with a direct object placed BEFORE the verb: les lettres (f. pl.).", s: "Con avoir, se concuerda con el complemento directo colocado ANTES: les lettres (f. pl.)." },
  { q: "Je pratique chaque jour ___ réussir l'examen.", o: ["afin de", "bien que", "malgré", "parce que"], a: 0, e: "'Afin de' + infinitive expresses purpose.", s: "'Afin de' + infinitivo expresa finalidad." },
  { q: "___ la fatigue, il a terminé son travail.", o: ["Bien que", "Malgré", "Parce que", "Pourtant"], a: 1, e: "'Malgré' + noun. 'Bien que' needs a verb (subjunctive).", s: "'Malgré' + sustantivo. 'Bien que' necesita un verbo (subjuntivo)." },
  { q: "___ il soit fatigué, il continue.", o: ["Parce qu'", "Bien qu'", "Puisqu'", "Pendant qu'"], a: 1, e: "'Bien que' + subjunctive (soit).", s: "'Bien que' + subjuntivo (soit)." },
  { q: "Nous ___ au restaurant hier soir.", o: ["avons allé", "sommes allés", "allons", "irons"], a: 1, e: "Aller uses être in the passé composé; agree with the subject.", s: "Aller usa être en el passé composé; concuerda con el sujeto." },
  { q: "Elle ___ le français depuis trois ans.", o: ["étudie", "a étudié", "étudiait", "étudiera"], a: 0, e: "'Depuis' + an ongoing action → présent.", s: "'Depuis' + acción que continúa → presente." },
  { q: "Je voudrais ___ eau, s'il vous plaît.", o: ["du", "de l'", "de la", "des"], a: 1, e: "Partitive before a vowel: de l'.", s: "Partitivo ante vocal: de l'." },
  { q: "C'est la ville ___ j'habite depuis 2020.", o: ["que", "où", "qui", "dont"], a: 1, e: "'Où' = relative pronoun for place/time.", s: "'Où' = pronombre relativo de lugar/tiempo." },
  { q: "Voilà le film ___ je t'ai parlé.", o: ["que", "qui", "dont", "où"], a: 2, e: "Parler DE → dont.", s: "Parler DE → dont." },
  { q: "Quand j'étais petit, je ___ au hockey tous les samedis.", o: ["jouais", "ai joué", "jouerai", "joue"], a: 0, e: "Repeated habit in the past → imparfait.", s: "Hábito repetido en el pasado → imparfait." },
  { q: "Je ne suis ___ allé à Québec.", o: ["jamais", "personne", "rien", "plus que"], a: 0, e: "ne... jamais = never.", s: "ne... jamais = nunca." },
  { q: "« Une panne » signifie :", o: ["Un arrêt imprévu d'un service", "Une grande fête", "Un nouveau produit", "Une réunion"], a: 0, e: "Une panne = a breakdown / outage.", s: "Une panne = una avería / caída del servicio." },
  { q: "« Magasiner » (Québec) signifie :", o: ["Faire des achats", "Travailler dans un magasin", "Fermer un magasin", "Vendre des produits"], a: 0, e: "Magasiner = to shop (Canadian French).", s: "Magasiner = ir de compras (francés canadiense)." },
  { q: "Au Québec, « le souper » est :", o: ["Le repas du soir", "Le petit repas du matin", "Le repas du midi", "Une collation"], a: 0, e: "Québec: déjeuner (breakfast), dîner (lunch), souper (dinner).", s: "Quebec: déjeuner (desayuno), dîner (almuerzo), souper (cena)." },
  { q: "Le salaire est bas ; ___, l'ambiance est excellente.", o: ["en revanche", "parce que", "afin de", "d'abord"], a: 0, e: "'En revanche' introduces a contrast.", s: "'En revanche' introduce un contraste." },
  { q: "« Je vous prie de bien vouloir m'excuser » est une formule :", o: ["formelle", "familière", "agressive", "humoristique"], a: 0, e: "Very polite, formal register (vous).", s: "Registro muy cortés y formal (vous)." },
  { q: "Dans une lettre formelle, on termine par :", o: ["Salut!", "Veuillez agréer mes salutations distinguées.", "À+", "Bises"], a: 1, e: "Formal closing formula.", s: "Fórmula de cierre formal." },
  { q: "Il m'a dit qu'il ___ le lendemain.", o: ["viendra", "viendrait", "vient", "est venu"], a: 1, e: "Reported speech in the past: future → conditionnel.", s: "Estilo indirecto en pasado: futuro → condicional." },
  { q: "Plus je pratique, ___ je progresse.", o: ["plus", "mieux", "moins", "aussi"], a: 0, e: "Pattern: plus... plus... (the more... the more...).", s: "Patrón: plus... plus... (cuanto más... más...)." }
];

TEF.bosses = [
  { n: "Le Subjonctif Géant", e: "👾" }, { n: "Dr. Imparfait", e: "🤖" }, { n: "Le Bug du Participe", e: "🐛" },
  { n: "Sir Connecteur", e: "🛡️" }, { n: "L'Accent Fantôme", e: "👻" }, { n: "Le Faux-Ami", e: "🎭" }, { n: "Madame Liaison", e: "⚡" }
];
