"use client";

import { fetchFromGenAI } from "@/lib/genAIClient";
import { useState } from "react";

export default function StoreTellingPage() {
  const [event, setEvent] = useState("");
  const [impact, setImpact] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSelection = async (event: string) => {
    setLoading(true);
    try {
      const schema = {
        type: "object",
        properties: {
          impact: { type: "string" },
        },
      };

      const prompt = `What if ${event} had occurred? Provide a concise, one-paragraph impact analysis focusing on changes in college admissions and infrastructure management. Limit to 170 characters`;

      const response = await fetchFromGenAI(schema, prompt);

      setEvent(event);
      setImpact(response.impact);
    } catch (error) {
      console.error("Error fetching scenario:", error);
      setImpact("Failed to generate scenario. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">"What If" Story Generator</h1>

      {/* Input for Event */}
      <input
        type="text"
        placeholder="Enter an event..."
        className="border border-gray-300 rounded-lg p-2 mb-4 w-80 text-center"
        onChange={(e) => setEvent(e.target.value)}
      />

      {/* Button to Generate Scenario */}
      <button
        onClick={() => handleSelection(event)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Scenario"}
      </button>

      {/* Display Results */}
      {impact && (
        <div className="mt-8 p-4 border border-gray-300 rounded-lg bg-white shadow-lg w-96">
          <h2 className="text-xl font-semibold mb-2">
            What if <span className="text-blue-500">{event}</span> happened?
          </h2>
          <p className="text-gray-700 italic">"{impact}"</p>
        </div>
      )}
    </div>
  );
}
