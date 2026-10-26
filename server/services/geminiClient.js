const fs = require('fs');

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
  const parts = [{ text: prompt }];
  if (filePath) {
    const file = fs.readFileSync(filePath);
    parts.push({ inlineData: { mimeType, data: file.toString('base64') } });
  }

  let response;
  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          contents: [{ role: 'user', parts }],
          generationConfig: responseMimeType ? { responseMimeType } : undefined
        })
      }
    );
  } catch (error) {
    throw new GeminiServiceError('Could not reach the AI service. Please try again later.', 502, 'AI_UNAVAILABLE');
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = payload.error?.message;
    throw new GeminiServiceError(
      detail ? `AI service error: ${detail}` : 'AI analysis failed. Please try again later.',
      502,
      'AI_REQUEST_FAILED'
    );
  }

  const text = payload.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('').trim();
  if (!text) throw new GeminiServiceError('The AI service returned no analysis. Please try another file.', 502, 'AI_EMPTY_RESPONSE');
  return text;
};

const parseGeminiJson = (text) => {
  try {
    return JSON.parse(text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim());
  } catch {
    throw new GeminiServiceError('The AI service returned an unreadable result. Please try again.', 502, 'AI_INVALID_RESPONSE');
  }
};

module.exports = { GeminiServiceError, generateGeminiContent, parseGeminiJson };
