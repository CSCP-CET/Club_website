## Editing Guide (Add / Remove / Update Content)

### Note to dev : We request you if you are about to contribute, write clean code and also we expect you to update the documentations in case of significant tweaks as we move on.

### 1) Execom page (members)

- **File to edit:** `backend/src/data/members.json`
- **Used by:** `GET /api/members` → `frontend/src/pages/Execom.tsx`

Each member object has:

- **`id`**: unique string (used as React key)
- **`name`**: display name
- **`role`**: position/title
- **`imageUrl`**: a local backend-served asset path like `/assets/...`
- **`socials`**: object with optional `instagram`, `linkedin`, `github` (each must be a valid URL if present)

For local images, place files under `backend/assets/...` and reference them like:
`/assets/execom/image.png`

Example:

```json
{
  "id": "web lead 1",
  "name": "devika",
  "role": "cspc-lead",
  "imageUrl": "relative img path",
  "socials": {
    "linkedin": "https://linkedin.com/in/janedoe"
  }
}
```

To **add a member**, append a new object to the array.

To **remove a member**, delete that object from the array.

To **reorder members**, reorder objects in the array (top to bottom = left to right / top to bottom on the page).

### 2) Events page (upcoming + past)

- **File to edit:** `backend/src/data/events.json`
- **Used by:** `GET /api/events` → `frontend/src/pages/Events.tsx`

Each event object has: (Structure can be updated in Events.tsx)

- **`id`**: unique string
- **`title`**: event title
- **`description`**: short description
- **`dateISO`**: recommended `YYYY-MM-DD` (e.g. `2026-03-01`)
- **`kind`**: either `"upcoming"` or `"past"`
- **`links`** _(optional)_: array of `{ "label": string, "url": string }`

Example:

```json
{
  "id": "web-sec-workshop",
  "title": "Web Security Workshop",
  "description": "OWASP Top 10 + hands-on labs.",
  "dateISO": "2026-03-15",
  "kind": "upcoming",
  "links": [{ "label": "Register", "url": "https://example.com/register" }]
}
```

To **move an event from upcoming to past**, change `kind` to `"past"`.

### 3) Events page timeline

- **File to edit:** `backend/src/data/timeline.json`
- **Used by:** `GET /api/timeline` → `frontend/src/pages/Events.tsx` (Timeline section)

Each timeline object has:

- **`id`**: unique string
- **`title`**: entry title
- **`description`** _(optional)_: longer text
- **`dateISO`**: recommended `YYYY-MM-DD`

Example:

```json
{
  "id": "first-contest",
  "title": "First Internal Contest",
  "description": "Beginner-friendly contest for new members.",
  "dateISO": "2025-11-05"
}
```

### 4) Navbar links (add/remove pages)

- **File to edit:** `frontend/src/components/Navbar/Navbar.tsx`
- Update the `navItems` array:

```ts
const navItems = [
  { to: "/", label: "Home" },
  { to: "/events", label: "Events" },
  { to: "/execom", label: "Execom" },
  { to: "/contact", label: "Contact Us" },
] as const;
```

If you add a new link, make sure a matching route exists in `frontend/src/App.tsx`.

### 5) Contact info

- **File to edit:** `frontend/src/pages/Contact.tsx`
- Update the email/location text directly.

## Common pitfalls (quick fixes)

- **Unique IDs:** `id` values in JSON must be unique within the file.
- **Valid URLs:** `imageUrl` and social links must be valid URLs (the backend validates with Zod).
- **Local images:** if using backend-served assets, `imageUrl` must start with `/assets/`.
- **Event kind:** must be exactly `"upcoming"` or `"past"`.
- **Date format:** `dateISO` is displayed using JavaScript `Date`; use `YYYY-MM-DD` to avoid locale parsing issues.
- **Backend validation failures:** if you break JSON format or schema, the API will return an error.

## Seeing changes locally

1. Edit the relevant file(s) above.
2. If you changed backend JSON data, **restart the backend dev server** (or rerun `pnpm dev`).
3. Refresh the browser at `http://localhost:5173`.
