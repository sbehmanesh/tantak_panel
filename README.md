# Tantak Panel

Nuxt 2 panel for the Tantak operations team. The panel now ships with the “Easy Product Insert/Update” experience which lets operators hydrate, edit, and publish complex product variations in minutes.

## Getting Started

```bash
npm install
npm run dev
```

The app runs in SPA mode (`http://localhost:3000` by default).

## Easy Product Insert/Update

- **Route**: `pages/product/easy/_id.vue`
  - A numeric `id` hydrates the product via `POST /product/show`.
  - Omitting `id` (or using `insert`) keeps the wizard in insert mode.
- The entire flow (base info → categories/variations → combinations → review) now lives in a single page component so the browser only deals with one lightweight Vue instance.

### How it works

1. **Categories** – `/category` is called once on mount. The page builds a lightweight parent→child tree in memory and feeds both the treeview and the autocomplete chip selector.
2. **Variations** – Each slot keeps a tiny array of rows (value, barcode, optional images). Quick inputs and inline fields are wired directly to Vue data, so drag/drop libraries or external stores are no longer required.
3. **Combination builder** – A compact cartesian helper inside the page regenerates combinations whenever variation rows change. Existing rows are kept via a simple key map so manual edits survive regeneration.
4. **Review & Save** – Validation is local to the page (required fields, categories picked, combos generated, prepay rules). Saving hits `/product/easy-insert` or `/product/easy-update` and the returned `*_temp_map` payloads hydrate the in-memory rows without extra helpers.

### Notes

- No Vuex module, custom plugin, or Jest harness is needed—the browser only downloads what the page uses.
- If you want to extend the experience (extra slots, more bulk actions, etc.) stay inside `pages/product/easy/_id.vue` so the bundle remains compact.
- Automated tests were intentionally removed per the optimization request; please rely on manual smoke tests after changes.
