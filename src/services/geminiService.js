export const getDiagnosis = async ({ disease, confidence, image, language = 'English' }) => {
  try {
    const response = await fetch('/api/diagnose', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        disease,
        confidence,
        image,
        language
      })
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      throw new Error(errorBody?.error || 'Failed to fetch diagnosis');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    return {
      disease: disease || 'Unable to analyze image',
      confidence: Number(confidence) || 0,
      severity: 'Unknown',
      cause: 'The AI service could not analyze this image right now.',
      organicRemedy: 'Try again with a clear, close photo of the affected leaf in good light.',
      chemicalRemedy: 'No chemical recommendation is available until the disease is identified.'
    };
  }
};
