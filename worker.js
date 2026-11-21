// Cloudflare Worker: gemmer dansekøen for Allround Dance.
//
// GitHub Pages kan kun vise filer, ikke gemme data. Derfor ligger listen i
// Cloudflare KV, og siderne (danse.html og julemand.html) taler med denne Worker.
// Alt kører på Cloudflares gratis plan.
//
// Opsætning: se README.md (trin "Cloudflare").
//   - KV-namespace bundet som variablen DANSE
//
// API:
//   GET  /            -> { dances: [{ id, name }], updated }
//                        Første dans i listen er den, der spilles nu.
//   POST /  (JSON)    -> ændrer listen og returnerer den nye liste
//        { action: "add",    name: "Stand By Me" }
//        { action: "remove", id: "<id>" }          (også "Næste": fjern den øverste)
//        { action: "move",   id: "<id>", dir: -1 | 1 }
//        { action: "clear" }
//
// Kun sider fra ALLOWED_ORIGIN må bruge Worker'en fra en browser. Det er ikke
// en adgangskode: admin-siden er kun beskyttet af sit hemmelige navn.

const ALLOWED_ORIGIN = 'https://whelan.github.io';
const KEY = 'queue';
const MAX_DANCES = 300;
const MAX_NAME = 150;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Vary': 'Origin',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

async function load(env) {
  const stored = await env.DANSE.get(KEY, 'json');
  return stored && Array.isArray(stored.dances)
    ? stored
    : { dances: [], updated: null };
}

export default {
  async fetch(request, env) {
    if (request.headers.get('Origin') !== ALLOWED_ORIGIN) {
      return json({ error: 'Forbidden' }, 403);
    }
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }
    if (request.method === 'GET') {
      return json(await load(env));
    }
    if (request.method !== 'POST') {
      return json({ error: 'Kun GET og POST' }, 405);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Ugyldig JSON' }, 400);
    }

    const state = await load(env);
    const dances = state.dances;
    const index = dances.findIndex((d) => d.id === body.id);

    switch (body.action) {
      case 'add': {
        const name = String(body.name || '').trim().slice(0, MAX_NAME);
        if (!name) return json({ error: 'Dansen mangler et navn' }, 400);
        if (dances.length >= MAX_DANCES) {
          return json({ error: `Højst ${MAX_DANCES} danse i listen` }, 400);
        }
        dances.push({ id: crypto.randomUUID(), name });
        break;
      }
      case 'remove':
        // Allerede fjernet (f.eks. dobbeltklik på "Næste"): ingen ændring.
        if (index === -1) return json(state);
        dances.splice(index, 1);
        break;
      case 'move': {
        const to = index + (body.dir === -1 ? -1 : 1);
        if (index === -1 || to < 0 || to >= dances.length) return json(state);
        [dances[index], dances[to]] = [dances[to], dances[index]];
        break;
      }
      case 'clear':
        dances.length = 0;
        break;
      default:
        return json({ error: 'Ukendt handling' }, 400);
    }

    const next = { dances, updated: new Date().toISOString() };
    await env.DANSE.put(KEY, JSON.stringify(next));
    return json(next);
  },
};
