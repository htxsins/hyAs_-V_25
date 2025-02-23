"use client";

import { fetchFromGenAI } from "@/lib/genAIClient";
import { useState } from "react";

export default function StoreTellingPage() {
  const [event, setEvent] = useState("");
  const [impact, setImpact] = useState("");
  const [facultyNeeds, setFacultyNeeds] = useState("");
  const [infraChanges, setInfraChanges] = useState("");
  const [solution, setSolution] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSelection = async (event: string) => {
    setLoading(true);
    try {
      const schema = {
        type: "object",
        properties: {
          impact: { type: "string" },
          faculty_needs: { type: "string" },
          infrastructure_changes: { type: "string" },
          solution: {type: "string"}
        },
        required: ["impact", "faculty_needs", "infrastructure_changes"]
      };

      const prompt = `Imagine the scenario: ${event}. Analyze its impact on college admissions, faculty needs, and infrastructure planning. For college admissions, focus on how this event affects student enrollment, diversity, and admission policies. For faculty needs, detail potential changes in hiring trends, teaching loads, and faculty development. For infrastructure, discuss how campus facilities, technology, and resource allocation may need to adapt. Also give me numerical analysis of the impact on college admissions, faculty needs, and infrastructure planning. Also provide a solution to the problem.`;


      const response = await fetchFromGenAI(schema, prompt);

      // setEvent(event); // Removed to avoid duplicate state update
      setImpact(response.impact);
      setFacultyNeeds(response.faculty_needs);
      setInfraChanges(response.infrastructure_changes);
      setSolution(response.solution);

    } catch (error) {
      console.error("Error fetching scenario:", error);
      setImpact("Failed to generate scenario. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
          <div className="absolute inset-0 -z-10">
                      <svg
                          className="w-full h-full"
                          viewBox="0 0 1000 1000"
                          preserveAspectRatio="none"
                          xmlns="http://www.w3.org/2000/svg"
                      >
                          <defs>
                              <linearGradient id="diagonalGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#A49DB4" stopOpacity="0.4" />
                                  <stop offset="50%" stopColor="white" stopOpacity="0.8" />
                                  <stop offset="100%" stopColor="#ADCA5E" stopOpacity="0.6" />
                              </linearGradient>
                              <linearGradient id="diagonalGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor="#ADCA5E" stopOpacity="0.7" />
                                  <stop offset="50%" stopColor="white" stopOpacity="0.8" />
                                  <stop offset="100%" stopColor="#A49DB4" stopOpacity="0.7" />
                              </linearGradient>
                              <linearGradient id="overlayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#A49DB4" stopOpacity="0.5" />
                                  <stop offset="50%" stopColor="white" stopOpacity="0.9" />
                                  <stop offset="100%" stopColor="#ADCA5E" stopOpacity="0.5" />
                              </linearGradient>
                          </defs>
                          <rect width="100%" height="100%" fill="white" />
                          <g>
                              {Array.from({ length: 15 }).map((_, i) => (
                                  <path
                                      key={`diagonal1-${i}`}
                                      d={`M${-300 + i * 150},0 L${700 + i * 150},1000`}
                                      stroke="url(#diagonalGradient1)"
                                      strokeWidth="120"
                                      fill="none" />
                              ))}
                              {Array.from({ length: 15 }).map((_, i) => (
                                  <path
                                      key={`diagonal2-${i}`}
                                      d={`M${-200 + i * 150},0 L${800 + i * 150},1000`}
                                      stroke="url(#diagonalGradient2)"
                                      strokeWidth="120"
                                      fill="none" />
                              ))}
                          </g>
                          <rect width="100%" height="100%" fill="url(#overlayGradient)" />
                      </svg>
                  </div>



          <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 p-6 space-y-6 -z-10">
            <h1 className="text-4xl font-extrabold text-indigo-600 mb-4">Scenario Simulation</h1>
        
            <input
              type="text"
              placeholder="Enter an event..."
              className="border border-indigo-300 rounded-2xl p-3 w-80 text-center text-indigo-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setEvent(e.target.value)}
            />
        
            <button
              onClick={() => handleSelection(event)}
              className={`px-5 py-2 rounded-full text-white font-semibold transition-all duration-300 ${loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'}`}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Scenario"}
            </button>
        
            {impact && (
              <div className="mt-8 p-5 border border-indigo-200 rounded-xl bg-white shadow-xl w-[100%] space-y-2">
                <h2 className="text-2xl font-bold text-indigo-600">
                  Scenario: <span className="text-indigo-500">{event}</span>
                </h2>
                <p className="text-gray-600 italic"><b>Impact: </b>"{impact}"</p>
                <p className="text-gray-700"><b>Faculty Needs: </b>{facultyNeeds}</p>
                <p className="text-gray-700"><b>Infrastructure Changes: </b>{infraChanges}</p>
                <p className="text-gray-700"><b>Solution: </b>{solution}</p>
              </div>
            )}
          </div>
          </div>
  );
  
}
