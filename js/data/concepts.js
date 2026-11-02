/* What the speaking partner listens for. For each mission step:
   c: concepts the learner should cover. l = label (English), k = keywords (accent-insensitive, stems ok), req:1 = must be covered to pass the step.
   nudge: what the partner says (fr, en, es) when the answer misses a required concept. */
window.TEF = window.TEF || {};
TEF.reactions = {
  ok: [
    ["Très bien!", "Very good!", "¡Muy bien!"],
    ["Parfait.", "Perfect.", "Perfecto."],
    ["D'accord, je vois.", "Okay, I see.", "De acuerdo, ya veo."],
    ["Excellent!", "Excellent!", "¡Excelente!"],
    ["Ah, très bien.", "Ah, very good.", "Ah, muy bien."],
    ["Merci, c'est clair.", "Thanks, that's clear.", "Gracias, está claro."]
  ],
  again: [
    ["Pardon, je n'ai pas bien compris.", "Sorry, I didn't quite understand.", "Perdón, no entendí bien."],
    ["Hmm, pouvez-vous répéter?", "Hmm, can you repeat that?", "Hmm, ¿puede repetir?"],
    ["Je ne suis pas sûr de comprendre.", "I'm not sure I understand.", "No estoy seguro de entender."]
  ],
  silence: [["Allô? Vous êtes toujours là?", "Hello? Are you still there?", "¿Aló? ¿Sigue ahí?"]],
  skip: [["D'accord, passons à la suite.", "Okay, let's move on.", "De acuerdo, sigamos."]],
  end: [["Merci, c'était très clair. Bonne journée!", "Thank you, that was very clear. Have a nice day!", "Gracias, fue muy claro. ¡Que tenga un buen día!"]]
};

TEF.concepts = {
  appart: [
    { c: [{ l: "greet", k: ["bonjour", "allo", "bonsoir", "salut"] }, { l: "ask the monthly rent", req: 1, k: ["loyer", "prix", "combien", "coute", "tarif", "mensuel"] }],
      nudge: ["Que voulez-vous savoir exactement sur l'appartement?", "What exactly do you want to know about the apartment?", "¿Qué quiere saber exactamente sobre el apartamento?"] },
    { c: [{ l: "ask when it is available", req: 1, k: ["disponible", "quand", "libre", "dispo", "emmenager", "date"] }, { l: "ask the lease length", k: ["bail", "duree", "contrat", "combien de temps", "longtemps"] }],
      nudge: ["Vous voulez savoir quand vous pouvez emménager?", "Do you want to know when you can move in?", "¿Quiere saber cuándo puede mudarse?"] },
    { c: [{ l: "ask about pets", req: 1, k: ["animaux", "animal", "chien", "chat", "bete"] }, { l: "ask about transit or parking", k: ["autobus", "bus", "stationnement", "parking", "metro", "transport", "arret"] }],
      nudge: ["Avez-vous des questions sur les animaux ou sur le transport?", "Do you have questions about pets or transportation?", "¿Tiene preguntas sobre animales o transporte?"] },
    { c: [{ l: "ask to visit", req: 1, k: ["visiter", "visite", "voir", "rendez vous", "passer"] }, { l: "say Saturday morning", k: ["samedi", "matin"] }, { l: "say thank you", k: ["merci", "remercie"] }],
      nudge: ["Souhaitez-vous visiter l'appartement? Quand?", "Would you like to visit the apartment? When?", "¿Le gustaría visitar el apartamento? ¿Cuándo?"] }
  ],
  entrevue: [
    { c: [{ l: "say your name", req: 1, k: ["appelle", "nom", "suis", "moi c'est"] }, { l: "mention your experience", k: ["experience", "ans", "travaille", "travaille", "carriere", "poste"] }],
      nudge: ["Pouvez-vous me dire votre nom et votre expérience?", "Can you tell me your name and your experience?", "¿Puede decirme su nombre y su experiencia?"] },
    { c: [{ l: "give a reason", req: 1, k: ["parce que", "car", "innovation", "projet", "reconnue", "contribuer", "souhaite", "veux", "voudrais", "aimerais", "motive", "interess", "passion", "valeurs"] }],
      nudge: ["Pourquoi cette entreprise vous intéresse-t-elle?", "Why does this company interest you?", "¿Por qué le interesa esta empresa?"] },
    { c: [{ l: "name a quality", req: 1, k: ["qualite", "persever", "ponctuel", "organis", "creatif", "fiable", "travailleur", "curieux", "autonome", "rigoureux", "flexible", "dynamique", "motive", "patient", "honnete", "adapt", "equipe", "communic", "determin"] }, { l: "give an example", k: ["par exemple", "quand", "lorsque", "toujours", "une fois"] }],
      nudge: ["Et quelle qualité vous décrit le mieux?", "And which quality describes you best?", "¿Y qué cualidad lo describe mejor?"] },
    { c: [{ l: "ask a question", req: 1, k: ["comment", "quand", "quel", "pourquoi", "est ce que", "combien", "pourrais", "pourriez", "j'aimerais savoir", "aimerais savoir", "voudrais savoir"] }, { l: "about onboarding or the team", k: ["integration", "formation", "equipe", "premieres", "semaines", "accueil", "nouvel"] }],
      nudge: ["Avez-vous une question pour nous?", "Do you have a question for us?", "¿Tiene alguna pregunta para nosotros?"] }
  ],
  convaincre: [
    { c: [{ l: "give a reason", req: 1, k: ["experience", "unique", "rencontrer", "passionne", "fans", "amis", "amusant", "super", "genial", "parce que", "car", "ambiance", "ensemble"] }],
      nudge: ["Mais pourquoi tu veux y aller, toi?", "But why do you want to go?", "Pero, ¿por qué quieres ir tú?"] },
    { c: [{ l: "answer about the price", req: 1, k: ["dollars", "trente", "pas cher", "prix", "coute", "entree", "demonstration", "billet", "tant", "30"] }],
      nudge: ["Alors, ça coûte combien exactement?", "So, how much does it cost exactly?", "Entonces, ¿cuánto cuesta exactamente?"] },
    { c: [{ l: "reassure them", req: 1, k: ["concours", "musique", "essai", "gratuit", "activit", "animation", "demo", "promis", "certain", "franchement", "ennuieras", "ennuies", "ennuyer"] }],
      nudge: ["Mais qu'est-ce qu'on va faire là-bas toute la journée?", "But what will we do there all day?", "Pero, ¿qué vamos a hacer allá todo el día?"] },
    { c: [{ l: "suggest a way to get there", req: 1, k: ["train", "metro", "autobus", "bus", "voiture", "covoiturage", "taxi", "transport", "stationnement", "parking", "ensemble"] }],
      nudge: ["Et comment est-ce qu'on s'y rend?", "And how do we get there?", "¿Y cómo llegamos?"] }
  ],
  cafe: [
    { c: [{ l: "order something", req: 1, k: ["voudrais", "prends", "prendrai", "aimerais", "cafe", "latte", "croissant", "the", "sandwich", "jus", "biere", "chocolat", "capuccino", "cappuccino"] }, { l: "say please", k: ["s'il vous plait", "svp", "plait"] }],
      nudge: ["Qu'est-ce que je vous sers?", "What can I get you?", "¿Qué le sirvo?"] },
    { c: [{ l: "say here or to go", req: 1, k: ["place", "emporter", "ici", "sur place", "partir"] }, { l: "ask about Wi-Fi", k: ["wifi", "wi fi", "internet"] }],
      nudge: ["Alors, sur place ou pour emporter?", "So, for here or to go?", "Entonces, ¿para tomar aquí o para llevar?"] },
    { c: [{ l: "ask to pay by card", req: 1, k: ["carte", "payer", "credit", "debit", "sans contact", "paiement"] }],
      nudge: ["Comment voulez-vous payer?", "How would you like to pay?", "¿Cómo quiere pagar?"] },
    { c: [{ l: "thank them", req: 1, k: ["merci", "bonne", "journee", "soiree", "revoir"] }],
      nudge: ["Voilà, c'est tout?", "There you go, is that all?", "Aquí tiene, ¿eso es todo?"] }
  ],
  pitch: [
    { c: [{ l: "say what the product does", req: 1, k: ["application", "app", "aide", "aident", "planifier", "projets", "equipes", "permet", "outil", "logiciel", "plateforme", "reunions", "produit", "solution"] }],
      nudge: ["Concrètement, que fait votre produit?", "Concretely, what does your product do?", "Concretamente, ¿qué hace su producto?"] },
    { c: [{ l: "say who the customers are", req: 1, k: ["clients", "entreprises", "pme", "petites", "moyennes", "startups", "equipes", "particuliers", "organisations", "grandes", "professionnels"] }],
      nudge: ["Et qui sont vos clients?", "And who are your customers?", "¿Y quiénes son sus clientes?"] },
    { c: [{ l: "say what makes you different", req: 1, k: ["contrairement", "different", "unique", "differe", "avantage", "offrons", "service", "simple", "abordable", "rapide", "seul", "mieux", "plus que"] }],
      nudge: ["Qu'est-ce qui vous distingue de vos concurrents?", "What sets you apart from your competitors?", "¿Qué los distingue de sus competidores?"] },
    { c: [{ l: "propose a next step", req: 1, k: ["essai", "gratuit", "demo", "rencontre", "reunion", "prochaine", "etape", "propose", "suggere", "rendez vous", "planifier", "appel", "semaine"] }],
      nudge: ["Alors, que proposez-vous comme prochaine étape?", "So, what do you suggest as a next step?", "Entonces, ¿qué propone como siguiente paso?"] }
  ]
};
