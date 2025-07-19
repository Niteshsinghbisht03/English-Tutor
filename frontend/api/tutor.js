export async function correctSentence(sentence) {
  const response = await fetch("http://127.0.0.1:8000/api/correct-sentence", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sentence }),
  });

  if (!response.ok) throw new Error("Failed to fetch");
  return await response.json();
}
