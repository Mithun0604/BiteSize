const fs = require('fs');

const delay = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

class GeminiServiceError extends Error {
  constructor(message, statusCode = 502, code = 'GEMINI_ERROR') {
    super(message);
    this.name = 'GeminiServiceError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

const generateGeminiContent = async ({ prompt, filePath, mimeType, responseMimeType }) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new GeminiServiceError(
      'AI analysis is not configured. Add GEMINI_API_KEY to the server environment to enable this feature.',
      503,
      'AI_NOT_CONFIGURED'
    );
  }

  const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const models = model === 'gemini-3.6-flash' ? [model] : [model, 'gemini-3.6-flash'];
  const parts = [{ text: prompt }];
  if (filePath) {
    const file = fs.readFileSync(filePath);
    parts.push({ inlineData: { mimeType, data: file.toString('base64') } });
  }

  const body = JSON.stringify({
    contents: [{ role: 'user', parts }],
    generationConfig: responseMimeType ? { responseMimeType } : undefined
  });
  let lastStatus = 0;
  let lastDetail = '';

  for (let modelIndex = 0; modelIndex < models.length; modelIndex += 1) {
    const selectedModel = models[modelIndex];
    const maxAttempts = modelIndex === 0 ? 2 : 1;
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      let response;
      try {
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(selectedModel)}:generateContent`,
          {
            method: 'POST',
            headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
            body
          }
        );
      } catch (error) {
        if (attempt === 0) {
          await delay(300 + Math.floor(Math.random() * 200));
          continue;
        }
        throw new GeminiServiceError('Could not reach the AI service. Please try again later.', 502, 'AI_UNAVAILABLE');
      }

      const payload = await response.json().catch(() => ({}));
      if (response.ok) {
        const text = payload.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('').trim();
        if (!text) throw new GeminiServiceError('The AI service returned no analysis. Please try another file.', 502, 'AI_EMPTY_RESPONSE');
        return text;
      }

      lastStatus = response.status;
      lastDetail = payload.error?.message || '';
      const transient = response.status === 408 || response.status === 429 || response.status >= 500;
      if (transient && attempt + 1 < maxAttempts) {
        await delay(350 + Math.floor(Math.random() * 300));
        continue;
      }

      // A model-specific capacity error can succeed on the secondary stable Flash model.
      if (response.status === 503 && modelIndex < models.length - 1) break;
      if (!transient) {
        throw new GeminiServiceError(
          lastDetail ? `AI service error: ${lastDetail}` : 'AI analysis failed. Please try again later.',
          502,
          'AI_REQUEST_FAILED'
        );
      }
      if (response.status !== 503 || modelIndex === models.length - 1) {
        throw new GeminiServiceError(
          'Gemini is temporarily busy. Please try again shortly.',
          503,
          'AI_TEMPORARILY_UNAVAILABLE'
        );
      }
    }
  }

  throw new GeminiServiceError(
    lastStatus === 503 ? 'Gemini is temporarily busy. Please try again shortly.' : 'AI analysis failed. Please try again later.',
    503,
    'AI_TEMPORARILY_UNAVAILABLE'
  );
};

const parseGeminiJson = (text) => {
  try {
    return JSON.parse(text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim());
  } catch {
    throw new GeminiServiceError('The AI service returned an unreadable result. Please try again.', 502, 'AI_INVALID_RESPONSE');
  }
};

module.exports = { GeminiServiceError, generateGeminiContent, parseGeminiJson };
