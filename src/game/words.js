/**
 * Curated list of 5-letter words suitable for PASSWORD HACKER.
 * Includes cybersecurity, tech, system, and common dictionary passwords.
 */

export const PASSWORD_WORDS = [
  'ADMIN', 'ALERT', 'ALIGN', 'ALLOW', 'ALPHA', 'ARRAY', 'ARROW', 'ASSET',
  'AUDIO', 'AUDIT', 'BATCH', 'BLOCK', 'BOARD', 'BOOTS', 'BOUND', 'BREAK',
  'BRICK', 'BROAD', 'BUFFER', 'BUILD', 'BYTES', 'CABLE', 'CACHE', 'CHAIN',
  'CHART', 'CHIPS', 'CIRCL', 'CLEAR', 'CLICK', 'CLOCK', 'CLONE', 'CLOUD',
  'CODES', 'CRACK', 'CRYPT', 'CYBER', 'CYCLE', 'DEBUG', 'DELTA', 'DIGIT',
  'DRIVE', 'EMAIL', 'EMPTY', 'ENTER', 'ENTRY', 'ERROR', 'EVENT', 'EXACT',
  'FAULT', 'FIBER', 'FILES', 'FINAL', 'FIRST', 'FLAGS', 'FLASH', 'FORCE',
  'FORUM', 'FRAME', 'FRONT', 'GATEWAY', 'GHOST', 'GLYPH', 'GRAPH', 'GUARD',
  'GUEST', 'GUIDE', 'HASH', 'HOOKS', 'HOSTS', 'IMAGE', 'INDEX', 'INPUT',
  'KEYED', 'LAYER', 'LEVEL', 'LIMIT', 'LINKS', 'LINUX', 'LOGIC', 'LOGIN',
  'LOOPS', 'MACRO', 'MATCH', 'MEDIA', 'MERGE', 'MICRO', 'MODEM', 'MOUSE',
  'NETWORKS', 'NODES', 'OCTET', 'OMEGA', 'ORDER', 'PANEL', 'PARAM', 'PARSE',
  'PATCH', 'PAUSE', 'PHISH', 'PIXEL', 'PLANE', 'PORTS', 'POWER', 'PRINT',
  'PROBE', 'PROXY', 'PULSE', 'QUERY', 'QUEUE', 'QUICK', 'RADIO', 'RANGE',
  'RATIO', 'REBOOT', 'RESET', 'ROBOT', 'ROOTS', 'ROUTE', 'RULES', 'SAVED',
  'SCALE', 'SCAN', 'SCOPE', 'SERVE', 'SHARE', 'SHELL', 'SHIFT', 'SMART',
  'SOLVE', 'SOUND', 'SPACE', 'SPEED', 'STACK', 'STAGE', 'STATE', 'STORE',
  'SUITE', 'SUPER', 'SURGE', 'SWIFT', 'TABLE', 'TERMIN', 'TOKEN', 'TOTAL',
  'TRACE', 'TRACK', 'TRAIN', 'TRUST', 'UNIFY', 'VALUE', 'VAULT', 'VERIFY',
  'VIDEO', 'VIRUS', 'VOICE', 'WATCH', 'WAVE', 'WHITE', 'WIRED', 'YIELD',
  'ZEROS', 'ZONED'
].filter((w) => w.length === 5);

// Set for fast O(1) membership check
export const PASSWORD_WORD_SET = new Set(PASSWORD_WORDS);
