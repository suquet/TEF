/* Optional AI features. The learner pastes their own Anthropic API key; it is stored only in this browser,
   under its own storage key (never inside the progress backup), and is sent only to api.anthropic.com. */
(function () {
  'use strict';
  const TEF = (window.TEF = window.TEF || {});
  const KEY = 'tefquest.ai.v1';
  const DEFAULT_MODEL = 'claude-haiku-5-5';
  let mem = null;
  const read = () => {
    try { const r = localStorage.getItem(KEY); if (r) return JSON.parse(r) || {}; } catch (e) { /* blocked */ }
    try { return mem ? JSON.parse(mem) : {}; } catch (e) { return {}; }
  };
  const write = o => { const raw = JSON.stringify(o); try { localStorage.setItem(KEY, raw); } catch (e) { mem = raw; } };

  function explain(status, body) {
    const msg = body && body.error && body.error.message ? body.error.message : '';
    if (status === 401) return 'The API key was rejected. Check it in Settings.';
    if (status === 403) return 'This key is not allowed to use that model or feature. ' + msg;
    if (status === 404) return 'The model "' + ai.model() + '" was not found. Change the model name in Settings. ' + msg;
    if (status === 429) return 'Too many requests right now. Wait a moment and try again.';
    if (status === 400 && /credit|billing/i.test(msg)) return 'Your Anthropic account has no credit left. ' + msg;
    if (status >= 500) return 'The AI service is busy. Try again in a moment.';
    return msg || 'The AI request failed (' + status + ').';
  }

  async function request(body, signal) {
    const k = read().key;
    if (!k) throw new Error('Add your API key in Settings first.');
    let res;
    try {
      res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST', signal,
        headers: { 'content-type': 'application/json', 'x-api-key': k, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
        body: JSON.stringify(Object.assign({ model: ai.model() }, body))
      });
    } catch (e) {
      if (e && e.name === 'AbortError') throw e;
      throw new Error('Could not reach api.anthropic.com. Check your connection or turn off content blockers for this site.');
    }
    if (!res.ok) {
      let j = null; try { j = await res.json(); } catch (e) { /* ignore */ }
      throw new Error(explain(res.status, j));
    }
    return res;
  }

  const ai = (TEF.ai = {
    has: () => !!read().key,
    model: () => read().model || DEFAULT_MODEL,
    defaultModel: DEFAULT_MODEL,
    save(key, model) { const o = read(); if (key) o.key = key.trim(); o.model = (model || '').trim(); write(o); },
    clear() { const o = read(); delete o.key; write(o); },
    masked() { const k = read().key; return k ? k.slice(0, 7) + '…' + k.slice(-4) : ''; },

    /* streams the answer; onText receives the full text so far */
    async stream(opts) {
      const res = await request({ max_tokens: opts.max || 600, system: opts.system, messages: opts.messages, stream: true }, opts.signal);
      const reader = res.body.getReader(), dec = new TextDecoder();
      let buf = '', full = '';
      for (;;) {
        const r = await reader.read();
        if (r.done) break;
        buf += dec.decode(r.value, { stream: true }).replace(/\r\n/g, '\n');
        let i;
        while ((i = buf.indexOf('\n\n')) >= 0) {
          const block = buf.slice(0, i); buf = buf.slice(i + 2);
          const line = block.split('\n').find(l => l.startsWith('data:'));
          if (!line) continue;
          const data = line.slice(5).trim();
          if (!data || data === '[DONE]') continue;
          let j; try { j = JSON.parse(data); } catch (e) { continue; }
          if (j.type === 'content_block_delta' && j.delta && j.delta.type === 'text_delta') { full += j.delta.text; if (opts.onText) opts.onText(full); }
          else if (j.type === 'error') throw new Error((j.error && j.error.message) || 'The AI stream failed.');
        }
      }
      return full;
    },
    /* one-shot answer as text */
    async complete(opts) {
      const res = await request({ max_tokens: opts.max || 1200, system: opts.system, messages: opts.messages }, opts.signal);
      const j = await res.json();
      return (j.content || []).map(c => c.text || '').join('');
    },
    json(text) {
      const a = text.indexOf('{'), b = text.lastIndexOf('}');
      if (a < 0 || b <= a) return null;
      try { return JSON.parse(text.slice(a, b + 1)); } catch (e) { return null; }
    }
  });
})();
