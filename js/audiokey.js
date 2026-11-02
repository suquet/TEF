/* Stable key for a recorded audio clip: FNV-1a (32-bit) over "role|text" as UTF-8, plus byte length.
   The Python generator (tools/generate-audio.py) implements the same function. Do not change one without the other. */
(function (root) {
  var TEF = (root.TEF = root.TEF || {});
  TEF.audioKey = function (role, text) {
    var s = role + '|' + String(text).replace(/\s+/g, ' ').trim();
    var bytes = new TextEncoder().encode(s);
    var h = 0x811c9dc5;
    for (var i = 0; i < bytes.length; i++) { h ^= bytes[i]; h = Math.imul(h, 0x01000193) >>> 0; }
    return ('00000000' + h.toString(16)).slice(-8) + '-' + bytes.length;
  };
})(typeof window !== 'undefined' ? window : globalThis);
