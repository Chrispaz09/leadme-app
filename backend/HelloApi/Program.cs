using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient();

var app = builder.Build();

app.MapPost("/api/ai/chat", async (
    ChatRequest request,
    IHttpClientFactory httpClientFactory,
    IConfiguration configuration) =>
{
    if (string.IsNullOrWhiteSpace(request.Prompt))
    {
        return Results.BadRequest(new { error = "Prompt is required." });
    }

    var provider = configuration["AI_PROVIDER"]?.Trim();
    if (string.IsNullOrWhiteSpace(provider))
    {
        provider = "OpenAI";
    }

    var client = httpClientFactory.CreateClient();

    string url;
    string apiKey;
    string body;

    var systemMessage = string.IsNullOrWhiteSpace(request.System)
        ? "You are a helpful assistant."
        : request.System;

    var baseUrl = configuration["OPENAI_BASE_URL"] ?? "https://api.openai.com/v1";
    var model = configuration["OPENAI_MODEL"] ?? "gpt-4o-mini";
    apiKey = configuration["OPENAI_API_KEY"] ?? string.Empty;

    if (string.IsNullOrWhiteSpace(apiKey))
    {
        return Results.BadRequest(new
        {
            error = "Missing OpenAI configuration. Set OPENAI_API_KEY."
        });
    }

    url = $"{baseUrl.TrimEnd('/')}/chat/completions";
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

    body = JsonSerializer.Serialize(new
    {
        model,
        messages = new[]
        {
                new { role = "system", content = systemMessage },
                new { role = "user", content = request.Prompt }
            },
        temperature = 0.7
    });

    using var content = new StringContent(body, Encoding.UTF8, "application/json");
    using var response = await client.PostAsync(url, content);
    var raw = await response.Content.ReadAsStringAsync();

    if (!response.IsSuccessStatusCode)
    {
        return Results.BadRequest(new
        {
            error = "AI service request failed.",
            status = (int)response.StatusCode,
            details = raw
        });
    }

    using var doc = JsonDocument.Parse(raw);
    var message = doc.RootElement
        .GetProperty("choices")[0]
        .GetProperty("message")
        .GetProperty("content")
        .GetString();

    return Results.Ok(new
    {
        provider,
        model = configuration["OPENAI_MODEL"] ?? configuration["AZURE_OPENAI_DEPLOYMENT"] ?? "unknown",
        response = message
    });
});

app.Run("https://localhost:7048");

record ChatRequest(string Prompt, string? System);
