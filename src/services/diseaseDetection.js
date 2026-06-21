/**
 * Mock Disease Detection Service
 * Simulates an ML model (like TensorFlow.js) processing an image to detect crop diseases.
 */
export const detectDisease = async (imageFile) => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    disease: 'Tomato Early Blight',
    confidence: 0.92
  };
};
