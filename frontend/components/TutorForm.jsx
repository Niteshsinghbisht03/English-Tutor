import React, { useState, useEffect, useRef } from "react";
import { correctSentence } from "../api/tutor";

const TutorForm = () => {
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);

  // Initialize SpeechRecognition only once
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const voiceText = event.results[0][0].transcript;
        setInput(voiceText);
      };

      recognitionRef.current.onend = () => {
        setListening(false);
      };

      recognitionRef.current.onerror = (e) => {
        console.error("Speech recognition error:", e.error);
        setListening(false);
      };
    }
  }, []);

  // Handle mic toggle
  const handleVoiceInput = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (listening) {
      recognition.stop();
      setListening(false);
    } else {
      recognition.start();
      setListening(true);
    }
  };

  // Handle speech synthesis (text-to-speech)
  const speak = (text) => {
    const synth = window.speechSynthesis;
    if (!synth) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    synth.speak(utterance);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setConversation((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await correctSentence(input);
      const botMessage = { sender: "bot", text: response.answer };
      setConversation((prev) => [...prev, botMessage]);
      speak(response.answer); // Speak the bot's reply
    } catch (err) {
      const errorMessage = {
        sender: "bot",
        text: "Sorry, something went wrong. Please try again.",
      };
      setConversation((prev) => [...prev, errorMessage]);
    }

    setInput("");
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">English Tutor</h2>

      <div className="border rounded-lg p-4 mb-4 h-96 overflow-y-auto bg-gray-50 shadow-sm">
        {conversation.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-3 flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-lg p-3 max-w-xs ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start mb-3">
            <div className="bg-gray-200 text-black rounded-lg p-3 max-w-xs animate-pulse">
              Typing...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded-lg"
          placeholder="Type a sentence..."
        />
        <button
          type="button"
          onClick={handleVoiceInput}
          className={`px-4 py-2 rounded-lg ${
            listening ? "bg-red-500" : "bg-yellow-400 hover:bg-yellow-500"
          }`}
        >
          🎤
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default TutorForm;
