import { useEffect, useState } from 'react';

function App() {
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful assistant.');
  const [prompt, setPrompt] = useState('Ask Anything!');
  const [aiResponse, setAiResponse] = useState('Ask a question, then click "Ask AI".');
  const [typedAiResponse, setTypedAiResponse] = useState('Ask a question, then click "Ask AI".');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!aiResponse) {
      setTypedAiResponse('');
      return;
    }

    let nextIndex = 0;
    setIsTyping(true);
    const intervalId = window.setInterval(() => {
      nextIndex += 1;
      setTypedAiResponse(aiResponse.slice(0, nextIndex));

      if (nextIndex >= aiResponse.length) {
        window.clearInterval(intervalId);
        setIsTyping(false);
      }
    }, 18);

    return () => {
      window.clearInterval(intervalId);
      setIsTyping(false);
    };
  }, [aiResponse]);

  const handleAiClick = async () => {
    if (!prompt.trim()) {
      setAiResponse('Please enter a prompt first.');
      return;
    }

    setIsAiLoading(true);
    setAiResponse('');

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, system: systemPrompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? 'AI request failed');
      }

      setAiResponse(data.response ?? 'No response text returned by API.');
    } catch (error) {
      setAiResponse(`Could not get AI response. Details: ${error.message}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <main className="app-shell">
      <h1>LeadMe App</h1>
      <p className="card">Enter an optional system instruction and a prompt, then send both to the ASP.NET Core AI endpoint.</p>
      <p className="card">System Prompt</p>
      <textarea
        className="card"
        value={systemPrompt}
        onChange={(event) => setSystemPrompt(event.target.value)}
        rows={3}
      />
      <textarea
        className="card"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        rows={4}
      />
      <button type="button" onClick={handleAiClick} disabled={isAiLoading}>
        {isAiLoading ? 'Asking AI...' : 'Ask AI'}
      </button>
      <p className={`card ai-response${isTyping ? ' typing' : ''}`} aria-live="polite">
        {isAiLoading ? 'Thinking...' : typedAiResponse}
      </p>
    </main>
  );
}

export default App;
