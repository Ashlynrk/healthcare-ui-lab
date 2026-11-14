export const REFLECTION_PROMPTS = [
  { id: "manageable", text: "What would make today feel manageable?" },
  { id: "noticed", text: "What is one thing you noticed about how you feel?" },
  { id: "small", text: "What is one kind thing you can keep small today?" },
  { id: "pace", text: "Where could the pace of today be gentler?" },
  { id: "keep", text: "What do you want to remember from today?" },
  { id: "room", text: "What would give you a little more room tonight?" },
  { id: "carry", text: "What can wait, and what is worth carrying?" },
];

export function promptForDate(isoDate: string): { id: string; text: string } {
  const day = Number(isoDate.slice(-2));
  const index = Number.isFinite(day) ? day % REFLECTION_PROMPTS.length : 0;
  return REFLECTION_PROMPTS[index] ?? REFLECTION_PROMPTS[0];
}
