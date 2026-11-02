/* Live French checker for the Write tab.
   1) Offline rules: elision, contractions, avoir/être, subjunctive triggers, missing accents, typography, register, style.
   2) Optional online check with the free LanguageTool service (only after the learner opts in).
   Pure logic: no DOM. Works in browsers and in Node (for tests). No lookbehind, so it runs on older iPhones. */
(function (root) {
  'use strict';
  var TEF = (root.TEF = root.TEF || {});

  var P = "(^|[^\\p{L}\\p{N}_'’-])";       // left word boundary, captured as group 1
  var E = "(?![\\p{L}\\p{N}_-])";           // right word boundary
  var V = "[aeiouàâäéèêëîïôöùûüœæ]";        // vowel start (h and y are left alone on purpose)
  var X = "(?!onz|oui|ouat|ouist|uhlan)";   // vowel-looking words that do not take elision
  var INF = "(?!\\p{L}+(?:er|ir|re|oir)" + E + ")"; // "à le faire" is fine, "à le magasin" is not

  function cap(orig, rep) { return /^\p{Lu}/u.test(orig) ? rep.charAt(0).toUpperCase() + rep.slice(1) : rep; }
  function strip(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, ''); }

  var RULES = [];
  function rule(id, body, make, type) { RULES.push({ id: id, re: new RegExp(P + body, 'giu'), make: make, type: type || 'error' }); }

  /* --- elision --- */
  function elide(id, word, el, vowelBody, en, es) {
    rule(id, '(' + word + ') (' + X + vowelBody + ')', function (m) {
      var from = m[1].length;
      var orig = m[2] + ' ' + m[3];
      return { from: from, to: from + orig.length, fix: cap(m[2], el) + m[3], en: en(m[2], m[3]), es: es(m[2], m[3]) };
    });
  }
  var vowelWord = V + '\\p{L}*', vowelWord2 = V + '\\p{L}+';
  var lead = { je: "j'", ne: "n'", me: "m'", te: "t'", se: "s'", de: "d'", le: "l'", la: "l'" };
  Object.keys(lead).forEach(function (w) {
    var strictLeLa = (w === 'le' || w === 'la');
    elide('elision-' + w, w, lead[w], (w === 'de' || strictLeLa) ? vowelWord2 : vowelWord,
      function (a, b) { return 'Before a vowel, « ' + a + ' » becomes « ' + lead[w] + ' »: « ' + lead[w] + b + ' ».'; },
      function (a, b) { return 'Ante una vocal, « ' + a + ' » pasa a « ' + lead[w] + ' »: « ' + lead[w] + b + ' ».'; });
  });
  // le/la before un, une, oui, onze… do not elide, so they are excluded in X plus this extra guard
  RULES.forEach(function (r) {
    if (r.id === 'elision-le' || r.id === 'elision-la') r.re = new RegExp(P + '(' + r.id.slice(8) + ') (' + X + '(?!une?' + E + ')(?!ou' + E + ')' + vowelWord2 + ')', 'giu');
  });
  rule('elision-que', '(que) (il|ils|elle|elles|on|un|une)' + E, function (m) {
    var f = m[1].length;
    return { from: f, to: f + m[2].length + 1 + m[3].length, fix: cap(m[2], "qu'") + m[3], en: "« que » becomes « qu' » before il, elle, on, un, une: « qu'" + m[3] + " ».", es: "« que » pasa a « qu' » ante il, elle, on, un, une: « qu'" + m[3] + " »." };
  });
  rule('elision-puisque', '(puisque|lorsque|quoique) (il|ils|elle|elles|on|un|une)' + E, function (m) {
    var f = m[1].length, base = m[2].slice(0, -1);
    return { from: f, to: f + m[2].length + 1 + m[3].length, fix: base + "qu'" + m[3], en: 'These conjunctions elide before il, elle, on, un, une.', es: 'Estas conjunciones se elidien ante il, elle, on, un, une.' };
  });
  rule('elision-si', '(si) (ils?)' + E, function (m) {
    var f = m[1].length;
    return { from: f, to: f + m[2].length + 1 + m[3].length, fix: cap(m[2], "s'") + m[3], en: "« si » + il(s) is written « s'il(s) ».", es: "« si » + il(s) se escribe « s'il(s) »." };
  });
  rule('elision-ce', '(ce) (est|était|etait)' + E, function (m) {
    var f = m[1].length;
    return { from: f, to: f + m[2].length + 1 + m[3].length, fix: cap(m[2], "c'") + m[3], en: "« ce est » is written « c'est ».", es: "« ce est » se escribe « c'est »." };
  });
  rule('elision-jusque', '(jusque) (à|au|aux|en|ici|où)' + E, function (m) {
    var f = m[1].length;
    return { from: f, to: f + m[2].length + 1 + m[3].length, fix: cap(m[2], "jusqu'") + m[3], en: "« jusque » elides: « jusqu'" + m[3] + " ».", es: "« jusque » se elide: « jusqu'" + m[3] + " »." };
  });

  /* --- contractions (only when the next word is clearly not an infinitive) --- */
  [['à le', 'au'], ['à les', 'aux'], ['de le', 'du'], ['de les', 'des']].forEach(function (p) {
    var parts = p[0].split(' ');
    rule('contraction-' + parts[0] + parts[1], '(' + parts[0] + ' ' + parts[1] + ')(?= ' + INF.slice(0) + ')', function (m) {
      var f = m[1].length;
      return { from: f, to: f + m[2].length, fix: cap(m[2], p[1]), en: '« ' + p[0] + ' » contracts to « ' + p[1] + ' » before a noun.', es: '« ' + p[0] + ' » se contrae en « ' + p[1] + ' » ante un sustantivo.' };
    });
  });

  /* --- avoir / être --- */
  rule('etre-vs-avoir-motion', "(j['’]ai) (allée?s?|venue?s?|partie?s?|arrivée?s?|restée?s?|tombée?s?|devenue?s?)" + E, function (m) {
    var f = m[1].length;
    return { from: f, to: f + m[2].length + 1 + m[3].length, fix: cap(m[2], 'je suis ') + m[3], en: 'Verbs of movement and change (aller, venir, partir, arriver, rester, tomber, devenir) use être: « je suis ' + m[3] + ' ».', es: 'Los verbos de movimiento y cambio (aller, venir, partir, arriver, rester, tomber, devenir) usan être: « je suis ' + m[3] + ' ».' };
  });
  rule('avoir-vs-etre', '(je suis) (fini|mangé|parlé|travaillé|étudié|regardé|acheté)' + E, function (m) {
    var f = m[1].length;
    return { from: f, to: f + m[2].length + 1 + m[3].length, fix: "j'ai " + m[3], en: 'Most verbs form the passé composé with avoir: « j\'ai ' + m[3] + ' ».', es: 'La mayoría de verbos forman el passé composé con avoir: « j\'ai ' + m[3] + ' ».' };
  });

  /* --- repeated function words --- */
  rule('double-word', '(le|la|les|de|du|des|un|une|et|à|en|que|qui|je|tu|il|elle|ou|dans|pour|sur|avec|est|ont|sont|ce|se|ne) \\2' + E, function (m) {
    var f = m[1].length;
    return { from: f, to: f + m[2].length * 2 + 1, fix: m[2], en: 'Repeated word: « ' + m[2] + ' ».', es: 'Palabra repetida: « ' + m[2] + ' ».' };
  });

  /* --- frequent learner slips --- */
  rule('tres-beaucoup', '(très beaucoup)' + E, function (m) { var f = m[1].length; return { from: f, to: f + m[2].length, fix: cap(m[2], 'beaucoup'), en: '« beaucoup » is never used with « très ».', es: '« beaucoup » no se usa con « très ».' }; });
  rule('plus-mieux', '(plus (?:mieux|meilleure?s?))' + E, function (m) { var f = m[1].length, w = m[2].split(' ')[1]; return { from: f, to: f + m[2].length, fix: cap(m[2], w), en: '« mieux » and « meilleur » already mean "better": drop « plus ».', es: '« mieux » y « meilleur » ya significan "mejor": quita « plus ».' }; });
  rule('tout-les', '(tout) (les|ces|mes|tes|ses|nos|vos|leurs)' + E, function (m) { var f = m[1].length; return { from: f, to: f + m[2].length, fix: cap(m[2], 'tous'), en: 'Before a plural determiner use « tous »: « tous ' + m[3] + ' ».', es: 'Ante un determinante plural se usa « tous »: « tous ' + m[3] + ' ».' }; });
  rule('quelques-chose', '(quelques chose)' + E, function (m) { var f = m[1].length; return { from: f, to: f + m[2].length, fix: cap(m[2], 'quelque chose'), en: '« quelque chose » (something) is written with « quelque » in the singular.', es: '« quelque chose » (algo) se escribe con « quelque » en singular.' }; });
  rule('parce', '(parce)' + E + "(?! que| qu['’])", function (m) { var f = m[1].length; return { from: f, to: f + m[2].length, fix: cap(m[2], 'parce que'), en: 'It is « parce que » (because).', es: 'Es « parce que » (porque).' }; });
  rule('malgre-que', '(malgré que)' + E, function (m) { var f = m[1].length; return { from: f, to: f + m[2].length, fix: null, type: 'style', en: '« malgré que » is considered informal. Use « bien que » + subjunctive, or « malgré » + noun.', es: '« malgré que » se considera informal. Usa « bien que » + subjuntivo, o « malgré » + sustantivo.' }; });
  rule('beaucoup-des', '(beaucoup des)' + E, function (m) { var f = m[1].length; return { from: f, to: f + m[2].length, fix: null, type: 'tip', en: 'Usually « beaucoup de » (no article): « beaucoup de gens ».', es: 'Normalmente « beaucoup de » (sin artículo): « beaucoup de gens ».' }; });

  /* --- subjunctive after trigger phrases --- */
  var LEMMA = { suis: 'etre', es: 'etre', est: 'etre', sommes: 'etre', 'êtes': 'etre', sont: 'etre', vais: 'aller', vas: 'aller', va: 'aller', allons: 'aller', allez: 'aller', vont: 'aller', ai: 'avoir', as: 'avoir', a: 'avoir', avons: 'avoir', avez: 'avoir', ont: 'avoir', peux: 'pouvoir', peut: 'pouvoir', peuvent: 'pouvoir', veux: 'vouloir', veut: 'vouloir', fais: 'faire', fait: 'faire', font: 'faire', sais: 'savoir', sait: 'savoir', viens: 'venir', vient: 'venir', prends: 'prendre', prend: 'prendre', dois: 'devoir', doit: 'devoir' };
  var SUBJ = {
    etre: { je: 'sois', tu: 'sois', il: 'soit', nous: 'soyons', vous: 'soyez', ils: 'soient' },
    avoir: { je: 'aie', tu: 'aies', il: 'ait', nous: 'ayons', vous: 'ayez', ils: 'aient' },
    aller: { je: 'aille', tu: 'ailles', il: 'aille', nous: 'allions', vous: 'alliez', ils: 'aillent' },
    pouvoir: { je: 'puisse', tu: 'puisses', il: 'puisse', nous: 'puissions', vous: 'puissiez', ils: 'puissent' },
    vouloir: { je: 'veuille', tu: 'veuilles', il: 'veuille', nous: 'voulions', vous: 'vouliez', ils: 'veuillent' },
    faire: { je: 'fasse', tu: 'fasses', il: 'fasse', nous: 'fassions', vous: 'fassiez', ils: 'fassent' },
    savoir: { je: 'sache', tu: 'saches', il: 'sache', nous: 'sachions', vous: 'sachiez', ils: 'sachent' },
    venir: { je: 'vienne', tu: 'viennes', il: 'vienne', nous: 'venions', vous: 'veniez', ils: 'viennent' },
    prendre: { je: 'prenne', tu: 'prennes', il: 'prenne', nous: 'prenions', vous: 'preniez', ils: 'prennent' },
    devoir: { je: 'doive', tu: 'doives', il: 'doive', nous: 'devions', vous: 'deviez', ils: 'doivent' }
  };
  var TRIG = "il faut que|bien que|pour que|avant que|afin que|à condition que|quoique|jusqu['’]à ce que|il est (?:important|nécessaire|essentiel|possible) que|il vaut mieux que|je veux que|je voudrais que|j['’]aimerais que|je souhaite que|je ne pense pas que|je ne crois pas que";
  var VERBS = Object.keys(LEMMA).join('|');
  rule('subjunctive', '(' + TRIG + ")\\s+(je|j['’]|tu|il|elle|on|nous|vous|ils|elles)\\s?(" + VERBS + ')' + E, function (m) {
    var f = m[1].length, verb = m[4], pron = m[3].toLowerCase().replace(/['’]/g, '');
    var key = pron === 'je' || pron === 'j' ? 'je' : pron === 'tu' ? 'tu' : (pron === 'il' || pron === 'elle' || pron === 'on') ? 'il' : pron === 'nous' ? 'nous' : pron === 'vous' ? 'vous' : 'ils';
    var table = SUBJ[LEMMA[verb.toLowerCase()]], fix = table ? table[key] : null;
    var end = f + m[0].length - f - 0; // whole match; we replace only the verb below
    var vs = m[0].length - verb.length;
    return { from: vs, to: m[0].length, fix: fix, en: 'After « ' + m[2] + ' » French needs the subjunctive' + (fix ? ': « ' + fix + ' ».' : '.'), es: 'Después de « ' + m[2] + ' » el francés necesita el subjuntivo' + (fix ? ': « ' + fix + ' ».' : '.') };
  });

  /* --- typography --- */
  rule('space-before-comma', '(\\s+)(,|\\.)(?![\\p{L}\\p{N}])', function (m) { return { from: m[1].length, to: m[1].length + m[2].length + 0, fix: null, skip: true }; });
  RULES.pop(); // replaced by the generic scanners below
  var TYPO = [
    { id: 'space-before-punct', re: /[ \t]+([,.])(?=\s|$)/g, make: function (m) { return { fix: m[1], en: 'No space before « ' + m[1] + ' ».', es: 'Sin espacio antes de « ' + m[1] + ' ».' }; } },
    { id: 'double-space', re: / {2,}/g, make: function () { return { fix: ' ', type: 'tip', en: 'Double space.', es: 'Doble espacio.' }; } },
    { id: 'comma-no-space', re: /,(?=\p{L})/gu, make: function () { return { fix: ', ', en: 'Add a space after the comma.', es: 'Añade un espacio tras la coma.' }; } }
  ];

  /* --- missing accents (words that do not exist without them) --- */
  var ACC = ('ecole:école etudiant:étudiant etudiante:étudiante etudiants:étudiants etudier:étudier francais:français francaise:française apres:après tres:très deja:déjà probleme:problème problemes:problèmes premiere:première derniere:dernière ete:été meme:même memes:mêmes etre:être voila:voilà bientot:bientôt plutot:plutôt theatre:théâtre hopital:hôpital fenetre:fenêtre tete:tête foret:forêt interet:intérêt role:rôle ecrire:écrire ecouter:écouter eviter:éviter equipe:équipe economie:économie education:éducation electricite:électricité energie:énergie experience:expérience different:différent difference:différence general:général realite:réalité reponse:réponse reussir:réussir reunion:réunion recemment:récemment recent:récent societe:société securite:sécurité special:spécial systeme:système telephone:téléphone television:télévision universite:université verite:vérité quebecois:québécois quebec:québec montreal:montréal noel:noël ile:île age:âge etranger:étranger etrangere:étrangère resume:résumé repondre:répondre repeter:répéter celebre:célèbre periode:période scene:scène seance:séance ca:ça apres-midi:après-midi tot:tôt ou:ou').split(' ').reduce(function (o, p) { var a = p.split(':'); if (a[0] !== a[1]) o[a[0]] = a[1]; return o; }, {});
  var ENGLISH = { the: 1, and: 1, because: 1, with: 1, very: 1, also: 1, however: 1, which: 1, your: 1, would: 1, should: 1, have: 1 };
  var ANGLO = [
    ['définitivement', "« définitivement » means 'for good'. For 'definitely' use « certainement » or « sans aucun doute »."],
    ['réaliser que', '« réaliser que » is an anglicism. Use « se rendre compte que ».'],
    ['éventuellement', "« éventuellement » means 'possibly', not 'eventually' (that is « finalement » or « à terme »)."],
    ['librairie', '« librairie » is a bookstore. For a library use « bibliothèque ».'],
    ['assumer que', '« assumer que » is an anglicism. Use « supposer que ».']
  ];

  /* --- connectors and structure --- */
  var CONNECTORS = ["d'abord", 'tout d\'abord', 'ensuite', 'enfin', 'de plus', 'en outre', 'par ailleurs', 'en revanche', 'pourtant', 'néanmoins', 'cependant', 'toutefois', 'par conséquent', "c'est pourquoi", 'en effet', 'par exemple', 'en conclusion', 'pour conclure', 'pour résumer', 'certes', 'malgré', 'bien que', 'afin de', 'afin que', 'car', 'donc', 'puisque', 'parce que', 'alors que', 'tandis que', 'quant à', "d'une part", "d'autre part", 'selon moi', 'à mon avis', 'il me semble', 'en premier lieu', 'ainsi', 'en résumé', 'en somme', 'au contraire', "d'ailleurs", "c'est-à-dire", 'notamment', 'puis', 'alors', 'finalement', 'soudain', 'heureusement', 'pendant ce temps'];
  var SUGG_A = ['ensuite', 'puis', 'alors', 'finalement', 'soudain', 'heureusement', 'pendant ce temps', 'en effet'];
  var SUGG_B = ['à mon avis', 'en revanche', 'par exemple', 'de plus', 'par conséquent', 'néanmoins', "d'une part", "d'autre part", 'en conclusion', 'certes'];
  var STOP = ('avec dans pour sont cette elle elles nous vous leur leurs mais plus tout tous très aussi comme sans sous entre chez depuis pendant avoir être faire fait font était ont avait cela celui celle ceux ainsi alors donc encore toujours jamais souvent quand même autre autres être été quelque quelques chaque votre notre mon ma mes ton ta tes son sa ses les des une que qui quoi dont où'.split(' '));
  var SYN = { très: 'extrêmement, vraiment, fort', beaucoup: 'énormément, de nombreux, une multitude de', chose: 'élément, aspect, point', choses: 'éléments, aspects, points', faire: 'réaliser, effectuer, créer', bien: 'efficace, agréable, réussi', important: 'essentiel, crucial, majeur', problème: 'difficulté, obstacle, enjeu', aussi: 'également, de même', pense: 'estime, considère, crois', dire: 'affirmer, déclarer, expliquer', gens: 'personnes, habitants, citoyens', beaucoup_de: 'de nombreux' };

  function norm(s) { return strip(String(s).toLowerCase()).replace(/[’]/g, "'"); }
  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  function words(t) { return t.trim() ? t.trim().split(/\s+/).length : 0; }

  function check(text, ctx) {
    ctx = ctx || {};
    var issues = [], seen = {};
    function push(o) { var k = o.s + ':' + o.e + ':' + o.rule; if (seen[k]) return; seen[k] = 1; o.src = o.src || 'local'; o.alts = o.alts || []; o.type = o.type || 'error'; issues.push(o); }

    RULES.forEach(function (r) {
      r.re.lastIndex = 0;
      var m;
      while ((m = r.re.exec(text))) {
        var lead = m[1].length;
        var mk = r.make(m);
        if (mk && mk.skip !== true) {
          push({ rule: r.id, s: m.index + (mk.from == null ? lead : mk.from), e: m.index + (mk.to == null ? m[0].length : mk.to), fix: mk.fix == null ? null : mk.fix, type: mk.type || r.type, en: mk.en, es: mk.es });
        }
        r.re.lastIndex = m.index + lead + 1;
      }
    });
    TYPO.forEach(function (t) {
      t.re.lastIndex = 0; var m;
      while ((m = t.re.exec(text))) { var mk = t.make(m); push({ rule: t.id, s: m.index, e: m.index + m[0].length, fix: mk.fix, type: mk.type || 'error', en: mk.en, es: mk.es }); if (m[0].length === 0) t.re.lastIndex++; }
    });

    // words: missing accents, English words
    var wre = /\p{L}+/gu, wm;
    var tokens = [];
    while ((wm = wre.exec(text))) {
      var w = wm[0], lw = w.toLowerCase();
      tokens.push(lw);
      if (w === w.toUpperCase() && w.length > 1) continue;
      if (ACC[lw]) {
        var rep = cap(w, ACC[lw]);
        // "a cote", "ou" etc. are excluded by the table; "ca" only when it is a whole word
        push({ rule: 'accent', s: wm.index, e: wm.index + w.length, fix: rep, en: 'Missing accent: « ' + rep + ' ».', es: 'Falta el acento: « ' + rep + ' ».' });
      } else if (ENGLISH[lw]) {
        push({ rule: 'english', s: wm.index, e: wm.index + w.length, fix: null, en: 'This looks like an English word.', es: 'Parece una palabra en inglés.' });
      }
    }

    // anglicisms
    var nt = norm(text);
    ANGLO.forEach(function (a) {
      var re = new RegExp('(^|[^a-z])(' + esc(norm(a[0])) + ')(?![a-z])', 'g'), m;
      while ((m = re.exec(nt))) { var s = m.index + m[1].length; push({ rule: 'anglicism', type: 'style', s: s, e: s + a[0].length, fix: null, en: a[1], es: a[1] }); }
    });

    // register
    if (ctx.reg === 'formal') {
      var rre = new RegExp(P + "(tu|toi|ton|ta|tes|te|t['’])(?![\\p{L}])", 'giu'), rm, n = 0;
      while ((rm = rre.exec(text)) && n < 3) { var s2 = rm.index + rm[1].length; push({ rule: 'register', type: 'style', s: s2, e: s2 + rm[2].length, fix: null, en: 'This is a formal letter: use « vous » instead of « tu ».', es: 'Es una carta formal: usa « vous » en vez de « tu ».' }); n++; rre.lastIndex = rm.index + rm[1].length + 1; }
    }

    // long sentences
    var sre = /[^.!?\n]+[.!?]*/g, sm, sentences = 0;
    while ((sm = sre.exec(text))) {
      var seg = sm[0];
      if (!seg.trim()) continue;
      sentences++;
      if (words(seg) > 40) { var st = sm.index + (seg.length - seg.trimStart().length); push({ rule: 'long-sentence', type: 'tip', s: st, e: sm.index + seg.trimEnd().length, fix: null, en: 'Long sentence (' + words(seg) + ' words). Split it for clarity.', es: 'Frase larga (' + words(seg) + ' palabras). Divídela para mayor claridad.' }); }
    }

    // overused words (document-level)
    var counts = {};
    tokens.forEach(function (t) { if (t.length >= 4 && STOP.indexOf(t) < 0) counts[t] = (counts[t] || 0) + 1; });
    Object.keys(counts).forEach(function (k) {
      var lim = SYN[k] ? 3 : 5;
      if (counts[k] >= lim) push({ rule: 'repeat-' + k, type: 'tip', s: -1, e: -1, fix: null, en: '« ' + k + ' » appears ' + counts[k] + ' times.' + (SYN[k] ? ' Try: ' + SYN[k] + '.' : ' Try a synonym or a pronoun.'), es: '« ' + k + ' » aparece ' + counts[k] + ' veces.' + (SYN[k] ? ' Prueba: ' + SYN[k] + '.' : ' Prueba un sinónimo o un pronombre.') });
    });

    // structure for letters
    var wc = words(text);
    if (ctx.sec === 'B' && wc >= 40) {
      var head = nt.slice(0, 40);
      if (!/^(madame|monsieur|cher|chere|bonjour|a l'attention|objet)/.test(head.trim())) push({ rule: 'greeting', type: 'tip', s: -1, e: -1, fix: null, en: ctx.reg === 'formal' ? 'Open the letter with « Madame, Monsieur, ».' : 'Open the letter with a greeting such as « Cher Marc, ».', es: ctx.reg === 'formal' ? 'Abre la carta con « Madame, Monsieur, ».' : 'Abre la carta con un saludo como « Cher Marc, ».' });
      if (wc >= (ctx.min || 200) * 0.8) {
        var close = ctx.reg === 'formal' ? /(salutations|cordialement|sinceres|respectueu|agreer)/.test(nt) : /(amitie|bises|a bientot|embrasse|a tres vite|bien a toi)/.test(nt);
        if (!close) push({ rule: 'closing', type: 'tip', s: -1, e: -1, fix: null, en: ctx.reg === 'formal' ? 'Add a closing: « Veuillez agréer, Madame, Monsieur, mes salutations distinguées. »' : 'Add a friendly closing such as « Amicalement, » or « Je t\'embrasse, ».', es: ctx.reg === 'formal' ? 'Añade una despedida: « Veuillez agréer, Madame, Monsieur, mes salutations distinguées. »' : 'Añade una despedida amistosa como « Amicalement, » o « Je t\'embrasse, ».' });
      }
    }

    // stats
    var used = [];
    CONNECTORS.forEach(function (c) {
      var re = new RegExp('(^|[^a-z])' + esc(norm(c)) + "(?![a-z])");
      if (re.test(nt) && used.indexOf(c) < 0) used.push(c);
    });
    var uniq = {}; tokens.forEach(function (t) { uniq[t] = 1; });
    issues.sort(function (a, b) { return a.s - b.s || a.e - b.e; });
    return {
      issues: issues,
      stats: { words: wc, sentences: sentences, avgLen: sentences ? wc / sentences : 0, ttr: tokens.length ? Object.keys(uniq).length / tokens.length : 0, connectors: used,
        suggest: (ctx.sec === 'A' ? SUGG_A : SUGG_B).filter(function (c) { return used.indexOf(c) < 0; }).slice(0, 5) }
    };
  }

  /* --- LanguageTool (online, opt-in) --- */
  var LT_LABEL = {
    misspelling: ['Spelling', 'Ortografía', 'error'], grammar: ['Grammar', 'Gramática', 'error'], typographical: ['Typography', 'Tipografía', 'tip'],
    style: ['Style', 'Estilo', 'style'], duplication: ['Repeated word', 'Palabra repetida', 'error'], whitespace: ['Spacing', 'Espaciado', 'tip'],
    register: ['Register', 'Registro', 'style'], 'locale-violation': ['Regional usage', 'Uso regional', 'style'], inconsistency: ['Inconsistency', 'Inconsistencia', 'error'],
    'non-conformance': ['Norm', 'Norma', 'error'], omission: ['Missing word', 'Palabra que falta', 'error'], addition: ['Extra word', 'Palabra de más', 'error']
  };
  function ltCheck(text, signal) {
    var body = new URLSearchParams({ text: text, language: 'fr', motherTongue: 'en', enabledOnly: 'false' });
    return fetch('https://api.languagetool.org/v2/check', { method: 'POST', signal: signal, headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' }, body: body })
      .then(function (res) {
        if (res.status === 429) { var e = new Error('busy'); e.code = 429; throw e; }
        if (!res.ok) { var e2 = new Error('http ' + res.status); e2.code = res.status; throw e2; }
        return res.json();
      })
      .then(function (j) {
        return (j.matches || []).map(function (m) {
          var it = (m.rule && m.rule.issueType) || 'uncategorized';
          var lab = LT_LABEL[it] || ['Language check', 'Revisión de lenguaje', 'tip'];
          var reps = (m.replacements || []).map(function (r) { return r.value; }).filter(Boolean);
          return { src: 'lt', rule: (m.rule && m.rule.id) || 'LT', type: lab[2], s: m.offset, e: m.offset + m.length, fix: reps[0] == null ? null : reps[0], alts: reps.slice(1, 3), fr: m.message || m.shortMessage || '', en: lab[0], es: lab[1], label: lab[0] };
        });
      });
  }

  /* keep online highlights in place while the learner keeps typing */
  function shift(list, oldText, newText) {
    var p = 0, max = Math.min(oldText.length, newText.length);
    while (p < max && oldText.charCodeAt(p) === newText.charCodeAt(p)) p++;
    var q = 0;
    while (q < max - p && oldText.charCodeAt(oldText.length - 1 - q) === newText.charCodeAt(newText.length - 1 - q)) q++;
    var oldEnd = oldText.length - q, delta = newText.length - oldText.length;
    return list.filter(function (i) { return i.e <= p || i.s >= oldEnd; }).map(function (i) { return i.e <= p ? i : Object.assign({}, i, { s: i.s + delta, e: i.e + delta }); });
  }
  function overlaps(a, b) { return a.s < b.e && b.s < a.e; }
  function merge(local, lt) {
    var strong = local.filter(function (i) { return i.s >= 0 && i.type === 'error'; });
    var keep = (lt || []).filter(function (i) { return !strong.some(function (l) { return overlaps(l, i); }); });
    var all = local.concat(keep);
    all.sort(function (a, b) { return (a.s < 0) - (b.s < 0) || a.s - b.s || a.e - b.e; });
    all.forEach(function (i, n) { i.id = n; });
    return all;
  }

  TEF.wc = { check: check, ltCheck: ltCheck, shift: shift, merge: merge, words: words, CONNECTORS: CONNECTORS };
  if (typeof module !== 'undefined' && module.exports) module.exports = TEF.wc;
})(typeof window !== 'undefined' ? window : globalThis);
