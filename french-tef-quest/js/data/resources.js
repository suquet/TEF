/* Videos, community tips, Québec expressions, TEF guide. Links are search/landing URLs so they never go stale. */
window.TEF = window.TEF || {};
(function () {
  const yt = q => "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);
  TEF.videos = [
    { t: "InnerFrench", d: "Podcast-style videos in clear, natural French for intermediate learners.", lvl: "B1-B2", k: "listen", u: yt("InnerFrench Hugo") },
    { t: "Français avec Pierre", d: "Grammar, vocabulary and pronunciation explained step by step.", lvl: "A2-B2", k: "grammar", u: yt("Français avec Pierre grammaire") },
    { t: "Easy French", d: "Street interviews with French and English subtitles.", lvl: "A2-B2", k: "listen", u: yt("Easy French street interviews") },
    { t: "TEF Canada: Expression orale", d: "Examples and strategies for the speaking section.", lvl: "TEF", k: "tef", u: yt("TEF Canada expression orale section A section B exemple") },
    { t: "TEF Canada: Expression écrite", d: "How to structure Section A and Section B texts.", lvl: "TEF", k: "tef", u: yt("TEF Canada expression écrite section B lettre exemple") },
    { t: "TEF Canada: Compréhension orale", d: "Practice audio and exam tactics.", lvl: "TEF", k: "tef", u: yt("TEF Canada compréhension orale entraînement") },
    { t: "Tech reviews in French", d: "Phones, AI and gadgets: modern tech vocabulary at natural speed.", lvl: "B1-B2", k: "tech", u: yt("test smartphone en français Frandroid") },
    { t: "Jeux vidéo en français", d: "Game reviews and trailers: fast, informal, great listening challenge.", lvl: "B1-C1", k: "game", u: yt("test jeu vidéo en français") },
    { t: "Bandes-annonces", d: "Movie and series trailers in French: short and visual.", lvl: "A2-B2", k: "ent", u: yt("bande-annonce VF film 2026") },
    { t: "Entrepreneuriat au Québec", d: "Business talk with a Canadian accent.", lvl: "B2", k: "biz", u: yt("entrepreneuriat Québec balado entrevue") },
    { t: "Accent québécois", d: "Train your ear for Canadian French expressions.", lvl: "B1-C1", k: "listen", u: yt("comprendre l'accent québécois") },
    { t: "Journal en français facile (RFI)", d: "A daily news bulletin spoken slowly. Perfect for dictation.", lvl: "A2-B1", k: "listen", u: "https://francaisfacile.rfi.fr" }
  ];
  TEF.videoKinds = { all: "All", tef: "TEF", listen: "Listening", tech: "Tech", game: "Games", ent: "Entertainment", biz: "Business", grammar: "Grammar" };

  TEF.tips = [
    { t: "Ten minutes a day beats two hours on Sunday.", d: "Small daily reps keep vocabulary in long-term memory. Protect your streak.", k: "habit" },
    { t: "Shadow native speakers.", d: "Play 20 seconds of audio, pause, repeat it with the same rhythm. Do it with the Speak tab or a news clip.", k: "speaking" },
    { t: "Record yourself, then listen back.", d: "You will hear filler words, silent letters you pronounced and missing liaisons within seconds.", k: "speaking" },
    { t: "Learn 15 connectors by heart.", d: "d'abord, ensuite, en revanche, par conséquent, néanmoins... Reuse them in every writing task.", k: "writing" },
    { t: "Time every writing task.", d: "Practise with a timer: about 20 minutes for Section A and 40 for Section B, then leave 5 minutes to proofread accents and agreements.", k: "writing" },
    { t: "Do not leave answers blank in the comprehension sections.", d: "Check the current scoring rules with your exam centre, but a guess is almost always better than nothing.", k: "exam" },
    { t: "Train both accents.", d: "The exam audio is neutral, but real life in Canada is Québécois and Franco-Ontarian. Mix Radio-Canada with French media.", k: "listening" },
    { t: "Read, then write three sentences, then say them aloud.", d: "Turn passive reading into active vocabulary: summarize each article in your own words.", k: "reading" },
    { t: "Use spaced repetition, not word lists.", d: "Flashcards that return just before you forget beat rereading. That is exactly what the Words tab does.", k: "vocab" },
    { t: "Paraphrase when a word is missing.", d: "Say « c'est un truc pour... » or « c'est-à-dire... » and keep talking. Fluency is scored, not perfection.", k: "speaking" },
    { t: "Find a speaking partner.", d: "Language-exchange apps, Alliance Française events and local conversation groups help a lot.", k: "habit" },
    { t: "Book the exam date early.", d: "A fixed date creates a deadline. Also verify score validity and the CLB/NCLC level your program needs on IRCC.", k: "exam" }
  ];
  TEF.communities = [
    { n: "r/French", d: "General learning questions and corrections.", u: "https://www.reddit.com/r/French/" },
    { n: "r/learnfrench", d: "Beginner to intermediate study help and resources.", u: "https://www.reddit.com/r/learnfrench/" },
    { n: "r/ImmigrationCanada", d: "Search for TEF Canada experiences and score reports.", u: "https://www.reddit.com/r/ImmigrationCanada/search/?q=TEF&restrict_sr=1" },
    { n: "r/languagelearning", d: "Study systems, routines and motivation.", u: "https://www.reddit.com/r/languagelearning/" },
    { n: "r/quebec", d: "Real Québec French, in context.", u: "https://www.reddit.com/r/quebec/" }
  ];

  TEF.qc = [
    { qc: "un courriel", fr: "un e-mail / un mél", en: "email", es: "correo electrónico", note: "Standard in Canada, official and formal." },
    { qc: "magasiner", fr: "faire du shopping", en: "to shop", es: "ir de compras", note: "Very common in Canadian French." },
    { qc: "la fin de semaine", fr: "le week-end", en: "the weekend", es: "el fin de semana", note: "« week-end » is understood, too." },
    { qc: "le déjeuner / le dîner / le souper", fr: "le petit-déjeuner / le déjeuner / le dîner", en: "breakfast / lunch / dinner", es: "desayuno / almuerzo / cena", note: "Listening trap! Dîner means lunch in Québec." },
    { qc: "un dépanneur", fr: "une supérette", en: "convenience store", es: "tienda de conveniencia", note: "Nickname: un « dép »." },
    { qc: "un cellulaire", fr: "un portable", en: "mobile phone", es: "teléfono móvil", note: "« Cell » is the short form." },
    { qc: "un stationnement", fr: "un parking", en: "parking lot", es: "estacionamiento", note: "Official Canadian term." },
    { qc: "clavarder", fr: "chatter / discuter en ligne", en: "to chat online", es: "chatear", note: "From clavier + bavarder." },
    { qc: "une tuque", fr: "un bonnet", en: "toque, winter hat", es: "gorro de invierno", note: "Winter essential." },
    { qc: "bienvenue", fr: "de rien / je vous en prie", en: "you're welcome", es: "de nada", note: "Said after « merci » in Québec." },
    { qc: "en masse", fr: "beaucoup", en: "a lot", es: "mucho", note: "Informal. « J'en ai en masse. »" },
    { qc: "un char", fr: "une voiture", en: "car (informal)", es: "carro (informal)", note: "Informal. « Une auto » is neutral." }
  ];

  TEF.guide = {
    sections: [
      { n: "Compréhension orale", min: "40 min", d: "Short audio clips and dialogues with multiple-choice questions. Audio plays once.", train: "Listen tab · Numbers · Dictation" },
      { n: "Compréhension écrite", min: "60 min", d: "Reading texts of increasing difficulty with multiple-choice questions.", train: "Read tab · Words · Quiz" },
      { n: "Expression écrite", min: "60 min", d: "Section A: continue a news item (80+ words). Section B: argue a point of view (200+ words).", train: "Write tab" },
      { n: "Expression orale", min: "15 min", d: "Section A: ask questions about an ad. Section B: convince a friend.", train: "Speak tab" }
    ],
    week: [
      ["Mon", "5 new words + one reading"],
      ["Tue", "Listening drill + dictation"],
      ["Wed", "Speaking mission + shadowing"],
      ["Thu", "Writing Section A (timed)"],
      ["Fri", "Writing Section B + quiz"],
      ["Sat", "Timed mini-mock: one section in exam conditions"],
      ["Sun", "Review, games and the Boss fight"]
    ],
    links: [
      ["IRCC: language tests", "https://www.canada.ca/en/immigration-refugees-citizenship.html"],
      ["Le français des affaires (TEF)", "https://www.lefrancaisdesaffaires.fr"],
      ["TV5MONDE Apprendre", "https://apprendre.tv5monde.com"]
    ]
  };
})();
