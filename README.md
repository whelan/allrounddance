# allrounddance

Allround Dance sider: en dansekø, som gæsterne kan følge på mobilen.

| Side | Adresse | Til |
| --- | --- | --- |
| `danse.html` | https://whelan.github.io/allrounddance/danse.html | Alle: se hvilken dans der spilles nu, og hvilke der kommer |
| `julemand.html` | https://whelan.github.io/allrounddance/julemand.html | Admin: tilføj, flyt og slet danse, tryk **Næste dans** |

Den øverste dans i listen er den, der **spilles nu**. Når admin trykker
*Næste dans*, slettes den, og den næste rykker op. Gæstesiden henter listen
automatisk hvert 20. sekund.

> Admin-siden er kun beskyttet af sit navn. Repoet er offentligt, så alle der
> kigger her, kan finde den. Vil du skifte navn, så omdøb `julemand.html`.

## Opsætning (gratis, én gang)

GitHub Pages kan kun vise filer, ikke gemme noget. Listen gemmes derfor i
Cloudflare KV via en lille Worker (`worker.js`) – samme slags som
djfeed-proxy'en.

### 1. Cloudflare

1. Gå til https://dash.cloudflare.com → **Storage & Databases** → **KV** →
   **Create**. Kald det f.eks. `allrounddance`.
2. **Workers & Pages** → **Create** → **Worker**. Kald den `allrounddance`
   og tryk **Deploy**.
3. **Edit code**: erstat skabelonen med indholdet af `worker.js` og tryk
   **Deploy**.
4. Workerens **Settings** → **Bindings** → **Add** → **KV namespace**:
   - Variable name: `DANSE`
   - KV namespace: `allrounddance`
5. Kopiér Workerens adresse (`https://allrounddance.<dit-navn>.workers.dev`).
   Hvis den ikke er `https://allrounddance.larsmhansen.workers.dev/`, så ret
   `API_URL` i `config.js`.

### 2. GitHub Pages

Repo → **Settings** → **Pages** → *Source*: **Deploy from a branch**,
*Branch*: `main` / `(root)` → **Save**. Efter et minut virker siderne på
adresserne ovenfor.

## Gratis-grænser

Cloudflares gratis plan giver 100.000 Worker-kald og 1.000 KV-skrivninger om
dagen. Hver gæst med siden åben bruger ca. 3 kald i minuttet (ingen, når
siden ligger i baggrunden), så 50 gæster i 5 timer ≈ 45.000 kald. Hver
tilføjelse/sletning er én skrivning.

En ændring kan i sjældne tilfælde være op til ca. et minut om at nå frem til
gæster, der går via et andet Cloudflare-datacenter end admin.
