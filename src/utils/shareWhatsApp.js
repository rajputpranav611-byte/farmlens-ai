const getShareText = (result) => {
  const disease = result.disease || 'Unknown crop issue';
  const severity = result.severity || 'Unknown';
  const remedy = result.organicRemedy || result.chemicalRemedy || 'Please consult a local agriculture expert.';

  return [
    'FarmLens AI Diagnosis',
    '',
    `Disease: ${disease}`,
    `Severity: ${severity}`,
    '',
    'Recommended remedy:',
    remedy,
    '',
    'Shared from FarmLens AI'
  ].join('\n');
};

export const shareWhatsApp = (result) => {
  if (!result) return;

  const url = `https://wa.me/?text=${encodeURIComponent(getShareText(result))}`;
  window.location.assign(url);
};
