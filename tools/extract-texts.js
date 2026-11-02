#!/usr/bin/env node
/* Prints every French text the app can say as a recorded clip, as JSON: [{key, role, text}].
   Roles: A = main voice (partner, reading, words), B = second voice (model answers, second speaker). */
const vm = require('vm'), fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..');
const ctx = { TextEncoder, console };
ctx.window = ctx;
vm.createContext(ctx);
['js/audiokey.js', 'js/data/words.js', 'js/data/reading.js', 'js/data/speaking.js', 'js/data/concepts.js', 'js/data/practice.js', 'js/data/resources.js']
  .forEach(f => vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f }));
const T = ctx.TEF;
const out = new Map();
const add = (role, text) => {
  if (!text) return;
  text = String(text).replace(/\s+/g, ' ').trim();
  if (!text) return;
  const key = T.audioKey(role, text);
  out.set(key, { key, role, text });
};
T.words.forEach(w => { add('A', w.f); add('A', w.x); });
T.articles.forEach(a => { a.s.forEach(s => add('A', s[0])); a.kw.forEach(k => add('A', k[0])); });
T.roles.forEach(r => r.steps.forEach(s => { add('A', s.p[0]); add('B', s.m[0]); }));
Object.values(T.concepts).forEach(list => list.forEach(s => add('A', s.nudge[0])));
Object.values(T.reactions).forEach(list => list.forEach(l => add('A', l[0])));
T.listen.forEach(l => l.lines.forEach(x => add(x.sp === 'B' ? 'B' : 'A', x.t)));
T.dict.forEach(d => add('A', d[0]));
T.twisters.forEach(t => add('A', t[0]));
T.qc.forEach(q => add('A', q.qc));
process.stdout.write(JSON.stringify(Array.from(out.values())));
