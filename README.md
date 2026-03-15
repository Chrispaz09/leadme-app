# LeadMe App

A minimal React and ASP.NET Core app focused on one flow: sending a prompt to `/api/ai/chat` and rendering the AI response.

## What You Will Learn

- How React captures prompt input and renders async results
- How a Vite frontend calls an ASP.NET Core backend
- How the backend forwards requests to OpenAI or Azure OpenAI
- Why secrets stay on the server and not in the frontend

## Run The App

```bash
npm install
npm run dev
```

Open the local URL shown in your terminal.

## Run With ASP.NET Core Backend

1. Start backend API in one terminal:

```bash
cd backend/HelloApi
dotnet run
```

2. Start React frontend in another terminal:

```bash
npm run dev
```

3. In the UI, optionally adjust the system prompt, enter a user prompt, and click `Ask AI`.
React calls `/api/ai/chat`, and Vite proxies it to `https://localhost:7048`.

## OpenAI And Azure OpenAI Integration Guide

See the full implementation guide:

- `docs/openai-azure-dotnet-guide.md`

Quick start:

1. Configure provider environment variables in your backend terminal.
2. Start backend:

```bash
cd backend/HelloApi
dotnet run
```

3. Start frontend:

```bash
npm run dev
```

4. In the app, optionally adjust the system prompt, enter a prompt, and click `Ask AI`.

The frontend calls `/api/ai/chat`, and the backend securely calls OpenAI or Azure OpenAI.

## Backend Sample Files

- `backend/HelloApi/Program.cs`: Minimal API endpoint (`/api/ai/chat`)
- `backend/HelloApi/HelloApi.csproj`: .NET 8 Web SDK project file
- `backend/HelloApi/Properties/launchSettings.json`: Development URL settings

## Build For Production

```bash
npm run build
npm run preview
```

## Key Files

- `src/main.jsx`: Entry point that mounts React into `#root`
- `src/App.jsx`: Main component for system prompt input, user prompt input, and AI responses
- `src/styles.css`: Styling for the prompt UI
- `vite.config.js`: Vite + React plugin setup

## React Basics In This App

1. Components
`App` is a function component. It returns JSX (HTML-like syntax in JavaScript).

2. State
`useState` stores the prompt text, AI response, and loading state.
When those values change, React re-renders the UI.

3. Events
The submit button uses `onClick={handleAiClick}`.
That function sends the prompt to the backend and updates the response text.

4. One-way data flow
The UI is always based on current state.
You do not manually edit the DOM.

## How To Scale This App

1. Organize by feature
Move code into folders like:
- `src/features/greeting/GreetingCard.jsx`
- `src/features/greeting/useGreeting.js`
- `src/shared/components/Button.jsx`

2. Add routing
Use `react-router-dom` when you need multiple pages.

3. Add state management gradually
Start with local state, then use Context for shared data.
Consider Redux Toolkit or Zustand only when complexity grows.

4. Add API layer
Create `src/services/api.js` and keep network code out of UI components.

5. Add tests early
Use Vitest + React Testing Library.
Test behavior (what users see), not implementation details.

## Security Essentials For React Beginners

1. Never trust user input
Validate on both client and server.

2. Avoid `dangerouslySetInnerHTML`
Only use it for trusted, sanitized content.

3. Keep secrets out of frontend code
Do not put API keys or credentials in React source files.
Use server-side secrets and environment variables.

4. Use HTTPS and secure APIs
Protect data in transit.

5. Keep dependencies updated
Run `npm audit` and update vulnerable packages.

7. Enforce backend authorization
Do authentication and authorization in ASP.NET Core, not in React alone.

6. Use safe authentication patterns
Prefer HTTP-only secure cookies managed by the backend for auth tokens.

## Suggested Next Steps

1. Add a system prompt field to the UI.
2. Split the AI form and response area into smaller components.
3. Add tests for loading, error, and success states.
4. Add stronger backend validation and timeout handling.
