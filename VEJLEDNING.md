# Vejledning: sæt Allround Dance-siderne op

Følg trinene i rækkefølge. Det tager ca. 15 minutter og koster ingenting.
Knapperne hos Cloudflare og GitHub kan hedde en smule anderledes, hvis de har
ændret deres sider – kig efter noget der ligner.

Når du er færdig, har du:

- **Gæstesiden** https://whelan.github.io/allrounddance/danse.html
- **Admin-siden** https://whelan.github.io/allrounddance/julemand.html

---

## Del 1 – GitHub Pages (gør siderne synlige)

1. Gå til https://github.com/whelan/allrounddance
2. Klik **Settings** (tandhjulet i menuen øverst i repoet).
3. Klik **Pages** i menuen til venstre.
4. Under **Build and deployment** → **Source**: vælg **Deploy from a branch**.
5. Under **Branch**: vælg **main** og mappen **/ (root)**. Klik **Save**.
6. Vent 1–2 minutter og genindlæs siden. Øverst står der nu
   *"Your site is live at https://whelan.github.io/allrounddance/"*.

Siderne kan nu åbnes, men listen virker først efter Del 2
(der står "Kunne ikke hente listen").

---

## Del 2 – Cloudflare (gemmer dansene)

Log ind på https://dash.cloudflare.com med den konto, du brugte til
djfeed-proxy'en.

### A. Lav et lager (KV) til listen

1. I menuen til venstre: **Storage & Databases** → **Workers KV**
   (hedder måske bare **KV**).
2. Klik **Create instance** (eller **Create namespace**).
3. Navn: `allrounddance` → klik **Create**.

### B. Lav en Worker

1. I menuen til venstre: **Compute (Workers)** → **Workers & Pages**.
2. Klik **Create** (eller **Create application**).
3. Vælg **Start with Hello World!** (eller **Create Worker**).
4. Navn: `allrounddance` (præcis sådan – så passer adressen i `config.js`).
5. Klik **Deploy**.

### C. Indsæt koden

1. Åbn https://github.com/whelan/allrounddance/blob/main/worker.js
2. Klik på **kopier-ikonet** (to firkanter) øverst til højre over koden.
3. Tilbage hos Cloudflare: klik **Edit code** på din nye Worker.
4. Markér al koden i `worker.js` derinde (Ctrl+A / Cmd+A) og slet den.
5. Indsæt den kopierede kode (Ctrl+V / Cmd+V).
6. Klik **Deploy** øverst til højre.

### D. Forbind Worker'en med lageret

1. Gå tilbage til Worker'ens oversigt (pil tilbage / klik på navnet
   `allrounddance`).
2. Klik fanen **Bindings** (eller **Settings** → **Bindings**).
3. Klik **Add binding** → vælg **KV namespace** → **Add binding**.
4. Udfyld:
   - **Variable name**: `DANSE` (store bogstaver, præcis sådan)
   - **KV namespace**: `allrounddance`
5. Klik **Add binding** / **Save**. (Cloudflare deployer selv igen.)

### E. Tjek adressen

1. På Worker'ens oversigt står adressen under **Domains & Routes**, f.eks.
   `allrounddance.larsmhansen.workers.dev`.
2. Står der **præcis** `allrounddance.larsmhansen.workers.dev`: alt er klar.
3. Står der noget andet: åbn
   https://github.com/whelan/allrounddance/edit/main/config.js, ret
   adressen i `API_URL`, og klik **Commit changes**.

Lille test: åbner du Worker-adressen direkte i browseren, skal der stå
`{"error":"Forbidden"}`. Det er rigtigt – den svarer kun siderne på
whelan.github.io.

---

## Del 3 – Prøv det

1. Åbn **admin-siden**: https://whelan.github.io/allrounddance/julemand.html
2. Skriv en dans, f.eks. `Stand By Me`, og tryk **Tilføj**. Der skal stå
   *"Gemt kl. …"* nederst.
3. Tilføj et par danse mere.
4. Åbn **gæstesiden** på din telefon:
   https://whelan.github.io/allrounddance/danse.html – den øverste dans
   står under **Spilles nu**, resten under **Kommer snart**.
5. Tryk **Næste dans ▶** på admin-siden. Inden for 20 sekunder skifter
   gæstesiden (eller tryk **Opdatér**).

Tip: Gem admin-siden som bogmærke / på hjemmeskærmen. Del kun linket til
`danse.html` med gæsterne.

---

## Del 4 – Logo (klaret)

Logoet ligger allerede i repoet som `logo.png` (banneret øverst på siderne)
og `icon.png` (ikonet i browserfanen / på hjemmeskærmen). Vil du skifte det,
så upload en ny fil med samme navn: **Add file** → **Upload files** →
**Commit changes**.

---

## Hvis noget driller

| Det sker | Gør sådan |
| --- | --- |
| "Kunne ikke hente listen (Failed to fetch)" | Worker-adressen i `config.js` passer ikke, eller Worker'en er ikke deployet (Del 2 C og E). |
| "HTTP 500" eller "KV-bindingen DANSE mangler" | Bindingen mangler eller hedder ikke præcis `DANSE` (Del 2 D). |
| Siden viser 404 | GitHub Pages er ikke slået til endnu, eller der er ikke gået 2 minutter (Del 1). |
| Ændringer på GitHub vises ikke | Vent 1–2 minutter, og genindlæs med Ctrl+Shift+R / Cmd+Shift+R. |
