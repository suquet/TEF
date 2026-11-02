# TEF Quest `>_`

A mobile-first, gamified web app to practise French every day for the **TEF Canada** exam (immigration to Canada). It is a plain static site: no build step, no backend, no account. Progress is stored in the browser.

> **En español:** es una app web estática para practicar francés todos los días (vocabulario, lectura, escucha, habla y escritura) con XP, rachas, misiones diarias y un jefe final. La interfaz está en inglés y cada texto en francés tiene botones **EN** y **ES** para traducir. Para publicarla, sube la carpeta a GitHub Pages, Netlify o Vercel (ver abajo).

## What is inside

| Area | What you do |
| --- | --- |
| **Home** | Level, XP ring, streak, six daily quests, word of the day, exam countdown |
| **Words** | 64 words with spaced repetition (1/3/7/16/35 days), browse by topic, Match, Word rush, Unscramble |
| **Read** | 8 original stories on tech, games, entertainment and business, sentence audio, tap-to-translate, comprehension questions, links to real French news sites |
| **Listen** | 6 exam-style audio drills (exam mode plays once), dictation with accent feedback, Number ninja (numbers, times, prices) |
| **Speak** | 5 role-plays in the style of the TEF oral (Section A and B), shadowing, tongue twisters, mic scoring |
| **Write** | 6 prompts (Section A 80+ words, Section B 200+ words), timer, phrase bank, self-check, model answers, "copy for AI feedback" |
| **More** | Grammar quiz, daily boss fight, curated videos and podcasts, community tips with Reddit links, Québec French corner, TEF guide and weekly plan, progress and badges, settings and backup |

Every French sentence has **EN** / **ES** buttons. In Settings you can choose to show a language automatically.

Audio uses the browser's built-in speech synthesis (it prefers a `fr-CA` voice). Speaking exercises use the browser's speech recognition where available (Chrome, Edge, Safari); everywhere else you can type your answer.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Publish it

**GitHub Pages (included workflow).** Push to a repository, then in *Settings → Pages* set *Source* to **GitHub Actions**. The workflow in `.github/workflows/pages.yml` deploys on every push to `main`.

**Netlify / Vercel / Cloudflare Pages.** Drag the folder in, or connect the repo. There is no build command and the publish directory is the repo root.

Because it ships a web manifest and a service worker, phones can *Add to Home Screen* and use it offline once loaded.

### Single-file build

```bash
python3 tools/build-standalone.py
# creates dist/tef-quest.html: one self-contained file you can email or host anywhere
```

## Project structure

```
index.html            app shell
css/styles.css        design tokens and components (dark, light, auto)
js/core.js            state, XP, quests, badges, speech, router
js/v-*.js             one file per feature area
js/data/*.js          all content: words, stories, dialogues, quiz, resources
sw.js                 offline cache (bump VERSION when files change)
```

## Add content (the easy way to contribute)

All learning content lives in `js/data/` as plain JavaScript arrays. No code changes are needed.

* **Word** (`words.js`): `W("un appareil", "nm", "tech", "device", "dispositivo", "Example FR.", "Example EN.", "Ejemplo ES.")`
* **Story** (`reading.js`): an object with `id`, `cat`, `lvl`, `title: [fr, en, es]`, `kw`, `s: [[fr, en, es], ...]` and `qs` (questions with the correct option index in `a`)
* **Listening drill** (`practice.js` → `TEF.listen`): lines with speaker `A` or `B`, a transcript translation and two questions
* **Speaking mission** (`speaking.js`): steps with the partner line, a hint and a model answer
* **Writing prompt, quiz question, tips, videos, Québec expressions**: the matching arrays in `practice.js` and `resources.js`

Please write original text. Do not paste copyrighted articles, exam papers or lyrics. Mark invented names as fictional.

### Prompt to generate new content with an AI assistant

> Write 5 new reading passages for a TEF Canada learner (level B1 to B2) about {topic}. Output a JavaScript array in this exact format: `{id, cat, lvl, mins, title:[fr,en,es], kw:[[fr,en,es]], s:[[fr,en,es]], qs:[{q, o:[3 options], a:indexOfCorrect, ex, exs}]}`. Each passage has 5 sentences. Use invented names, no real news claims, and natural Canadian-friendly French.

## Voices, speaking and writing (v2)

### More natural voices
1. **Browser voices.** The app ranks the voices on the device and uses the most natural one (Edge "Natural", iOS Premium/Enhanced, Google). Settings, Voice lab, lists them and explains how to install better ones.
2. **Recorded neural voices (best).** Generate MP3s for every built-in line once, and they play on every device:
   - GitHub: Actions, **Generate voice audio**, Run workflow. It commits `audio/` and redeploys Pages.
   - Or locally: `pip install edge-tts` then `python3 tools/generate-audio.py` (provider `edge`), or `--provider azure` with `AZURE_SPEECH_KEY` and `AZURE_SPEECH_REGION` (official, free tier).
   - Note: `edge` uses an unofficial Microsoft endpoint and may break or conflict with its terms. `azure` is the supported route.
   - Free-conversation replies are dynamic, so they use browser voices.

### Speaking that reacts
Speak missions listen while you talk: targets light up live, the partner answers, and hands-free mode reopens the mic automatically. This works offline with built-in keyword targets (`js/data/concepts.js`). Needs a browser with speech recognition (Chrome, Edge, Safari).

### Free conversation (optional AI)
More, Free conversation. Paste your own Anthropic API key in Settings. It is stored only in your browser, excluded from backups, and sent only to api.anthropic.com. Use a key with a low spend limit and remove it on shared devices.

### Live writing checker
Write shows underlines as you type, with one-tap fixes, register checks (tu/vous), connectors and meters. Offline rules always run. The optional LanguageTool online check sends your text to languagetool.org only after you opt in. With an API key you also get a full examiner-style review.

## Good to know

* This is an independent practice tool. It is **not affiliated with, endorsed by, or a replacement for** the official TEF Canada, its organizers or IRCC. Check exam format, scoring, validity and immigration requirements on official sources.
* The reading and listening texts are original and partly fictional. The Reddit and video sections link out; the tips are paraphrased habits, not quotes from specific users.
* Browsers differ in voices and speech recognition. For the best pronunciation practice use a recent Chrome, Edge or Safari with a headset.

## Ideas for the roadmap

More stories and drills, a timed full-section mock, audio recordings by native speakers, adaptive review that targets weak grammar, a French-only mode for the interface, and shareable weekly leaderboards (needs a backend).

## License

MIT. See `LICENSE`.
