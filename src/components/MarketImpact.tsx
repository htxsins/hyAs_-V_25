"use client"

import { useState, useEffect } from "react";
import { fetchMarketingInsights, MarketingResponse } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Bar, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale
} from "chart.js";

// Register ChartJS components
ChartJS.register(BarElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

export default function MarketingDashboard() {
  const [data, setData] = useState<MarketingResponse | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchMarketingInsights()
      .then(setData)
      .catch(() => setError("Failed to load data"));
  }, []);

  if (error) {
    return (
      <Alert variant="destructive" className="my-6">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return <p className="text-lg font-bold text-gray-600">Loading...</p>;
  }

  const { summary, suggestions, r2 } = data;

  const roiData = {
    labels: summary.map(item => item.Campaign_Type),
    datasets: [
      {
        label: "ROI",
        data: summary.map(item => item.roi),
        backgroundColor: "#3b82f6",
        borderRadius: 6,
      },
    ],
  };

  const conversionData = {
    labels: summary.map(item => item.total_leads.toString()),
    datasets: [
      {
        label: "Conversion Rate",
        data: summary.map(item => item.conversion_rate),
        backgroundColor: "#ef4444",
      },
    ],
  };

  return (
    <div className="p-8 space-y-8">
        <div className="absolute inset-0 z-0">
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
                fill="none"
              />
            ))}
            {Array.from({ length: 15 }).map((_, i) => (
              <path
                key={`diagonal2-${i}`}
                d={`M${-200 + i * 150},0 L${800 + i * 150},1000`}
                stroke="url(#diagonalGradient2)"
                strokeWidth="120"
                fill="none"
              />
            ))}
          </g>
          <rect width="100%" height="100%" fill="url(#overlayGradient)" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-center">📊 Marketing Impact Analysis</h1>
      <p className="text-lg text-gray-700 text-center">
        Model R² Score: <Badge variant="outline" className="text-lg">{r2.toFixed(2)}</Badge>
      </p>

      {/* Suggestions */}
      <Card className="bg-gray-100 shadow-lg">
        <CardHeader>
          <CardTitle>💡 Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            {suggestions.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ROI Chart */}
        <Card>
          <CardHeader>
            <CardTitle>📈 ROI by Campaign</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={roiData} />
          </CardContent>
        </Card>

        {/* Conversion Rate Chart */}
        <Card>
          <CardHeader>
            <CardTitle>📉 Conversion Rate by Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <Scatter data={conversionData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
