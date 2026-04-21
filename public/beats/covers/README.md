# Cover art — drop-in per release

Each release in `config/beats.js` will pick up a real cover automatically if a
file exists at:

```
public/beats/covers/{beat.id}.jpg
```

Current IDs:

- `tarde-de-lluvia.jpg`
- `cristal.jpg`
- `no-me-llames.jpg`
- `silhouette.jpg`
- `verano-roto.jpg`

Recommended size: **1200×1500** (4:5 portrait, editorial). PNG also works —
update the extension in `components/beats/ProductionCard.jsx` and
`app/beats/[id]/BeatDetailClient.js` if you prefer `.png`.

If a file is missing, the generative editorial still renders instead (tinted
from the beat's `signature` recipe).
