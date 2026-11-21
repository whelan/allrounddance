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
Cloudflare KV via en lille Worker (`worker.js`).

**Følg [VEJLEDNING.md](VEJLEDNING.md) trin for trin** – GitHub Pages,
Cloudflare, test og logo.

## Gratis-grænser

Cloudflares gratis plan giver 100.000 Worker-kald og 1.000 KV-skrivninger om
dagen. Hver gæst med siden åben bruger ca. 3 kald i minuttet (ingen, når
siden ligger i baggrunden), så 50 gæster i 5 timer ≈ 45.000 kald. Hver
tilføjelse/sletning er én skrivning.

En ændring kan i sjældne tilfælde være op til ca. et minut om at nå frem til
gæster, der går via et andet Cloudflare-datacenter end admin.
