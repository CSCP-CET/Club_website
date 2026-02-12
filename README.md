# CSCP-CET

Official Website of CSCP-CET.

### We request you if you are about to contribute, write clean and well documented code and also we expect you to follow undermentioned commit message format:

    Build: A new feature or Feat: A new feature.
    Fix: A bug fix.
    Docs: Documentation only changes.
    Style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc).
    Refactor: A code change that neither fixes a bug nor adds a feature.
    Perf: A code change that improves performance.
    Test: Adding missing tests.
    Chore: Changes to the build process or auxiliary tools and libraries such as documentation generation.

### For Example:-

    git commit -m "Feat: Added UI component to add file" or git commit -m "Feat: Added UI component to add file",
    git commit -m "Fix: Bug in SomeView was fixed",
    etc.

## Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- Dark theme (dark blue + black)
- Responsive, accessible UI

### Backend

- Node.js
- Express
- TypeScript
- REST API
- File-based data (JSON)

### Package Manager

- pnpm

## Project Structure

```
cscp-cet/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar/
│   │   │   ├── MemberCard/
│   │   │   ├── Timeline/
│   │   │   └── EventCard/
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Events.tsx
│   │   │   ├── Execom.tsx
│   │   │   └── Contact.tsx
│   │   ├── styles/
│   │   ├── types/
│   │   ├── utils/
│   │   └── main.tsx
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── data/
│   │   │   ├── members.json
│   │   │   ├── events.json
│   │   │   └── timeline.json
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── server.ts
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── README.md
└── pnpm-workspace.yaml
```

## Setup Instructions

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Start development servers:**

   ```bash
   pnpm dev
   ```

   This starts both frontend (http://localhost:5173) and backend (http://localhost:3000).

3. **Build for production:**
   ```bash
   pnpm build
   ```

## Environment Variables(Not necessary default values added for build:1)

### Backend (.env)

```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000
```

## Security Features

- No database or authentication (reduces attack surface)
- File-based read-only data
- CORS restricted to frontend origin
- Rate limiting
- Helmet security headers
- Input validation with Zod
- No eval() or dynamic code execution
- All external links use `rel="noopener noreferrer"`

## How to View the Website

1. Clone or download this repository
2. Run `pnpm install` to install dependencies
3. Run `pnpm dev` to start both servers
4. Open your browser and navigate to `http://localhost:5173`

The frontend will automatically reload when you make changes, and the backend API will be available at `http://localhost:3000`.
