export async function correctSentence(sentence) {
  const response = await fetch(
    "https://english-tutor-jbgc.onrender.com/api/correct-sentence",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sentence }),
    }
  );


  
  if (!response.ok) throw new Error("Failed to fetch");
  return await response.json();
}
