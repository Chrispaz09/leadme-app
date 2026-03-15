# OpenAI + Azure OpenAI Guide For This React + .NET Project

This guide shows how to call an AI model securely from the ASP.NET Core backend and use it from the React frontend.

The implementation in this project uses:

- React frontend calling `POST /api/ai/chat`
- ASP.NET Core minimal API endpoint in `backend/HelloApi/Program.cs`
- Environment variables for all credentials
- Provider switch: OpenAI or Azure OpenAI

## Why This Pattern

Do not call OpenAI directly from React with secret keys.

Correct flow:

1. React sends user prompt to backend endpoint.
2. Backend adds API key from environment variables.
3. Backend calls OpenAI or Azure OpenAI.
4. Backend returns model output to React.

This keeps secrets off the browser and gives one place for logging, validation, throttling, and auth.

## Project Endpoints Added

Backend endpoint:

- `POST /api/ai/chat`

Existing endpoint (unchanged):

- `GET /api/hello`

Frontend action:

- `Ask AI` button in `src/App.jsx` calls `/api/ai/chat`

## Provider 1: OpenAI API Setup

Set these variables in the terminal where you run the backend:

PowerShell:

```powershell
$env:AI_PROVIDER = "OpenAI"
$env:OPENAI_API_KEY = "<your-openai-api-key>"
$env:OPENAI_MODEL = "gpt-4o-mini"
```

Optional override:

```powershell
$env:OPENAI_BASE_URL = "https://api.openai.com/v1"
```

## Provider 2: Azure OpenAI Setup

Set these variables in the terminal where you run the backend:

PowerShell:

```powershell
$env:AI_PROVIDER = "AzureOpenAI"
$env:AZURE_OPENAI_ENDPOINT = "https://<your-resource-name>.openai.azure.com"
$env:AZURE_OPENAI_DEPLOYMENT = "<your-deployment-name>"
$env:AZURE_OPENAI_API_KEY = "<your-azure-openai-key>"
$env:AZURE_OPENAI_API_VERSION = "2024-10-21"
```

Notes:

- `AZURE_OPENAI_DEPLOYMENT` is the deployment name in Azure, not the base model name.
- Keep endpoint format exactly as `https://<resource>.openai.azure.com`.

## Run The Project

Terminal 1 (backend):

```powershell
cd backend/HelloApi
dotnet run
```

Terminal 2 (frontend):

```powershell
npm run dev
```

Open the Vite URL, enter a prompt, and click `Ask AI`.

## Test The Backend Directly (Optional)

With backend running, test the endpoint:

```powershell
Invoke-RestMethod -Method Post -Uri https://localhost:7048/api/ai/chat -ContentType "application/json" -Body '{"prompt":"Write a short hello from AI."}'
```

Expected shape:

```json
{
  "provider": "OpenAI",
  "model": "gpt-4o-mini",
  "response": "..."
}
```

## Files Changed In This Project

- `backend/HelloApi/Program.cs`
- `src/App.jsx`
- `src/styles.css`
- `README.md`

## Security Checklist

1. Never commit API keys.
2. Keep keys only in environment variables or secret stores.
3. Validate prompt length and rate-limit in production.
4. Add authentication before exposing AI endpoints publicly.
5. Log request IDs and response status, not raw secrets.

## Recommended Next Improvements

1. Add request/response DTOs and model validation.
2. Add cancellation tokens and timeout handling.
3. Add retry policy for transient HTTP 429/5xx responses.
4. Add auth and per-user quotas.
5. Add unit tests and integration tests for `/api/ai/chat`.
