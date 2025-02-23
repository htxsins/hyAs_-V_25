"use client"

import { useState } from "react"
import { uploadCSV, type MarketingResponse } from "@/services/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Bar, Scatter } from "react-chartjs-2"
import {
  Chart as ChartJS,
  BarElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js"

// Register ChartJS components
ChartJS.register(BarElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend)

export default function MarketingDashboard() {
  const [data, setData] = useState<MarketingResponse | null>(null)
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setIsLoading(true)
      setError("")

      const formData = new FormData()
      formData.append("file", selectedFile)

      try {
        const response = await uploadCSV(formData)
        setData(response)
      } catch (err) {
        setError("Failed to upload and process file")
      } finally {
        setIsLoading(false)
      }
    }
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-6">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 w-full h-full">
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
      <div className="relative z-10 p-8 space-y-8">
        <h1 className="text-3xl font-bold text-center">📊 Marketing Impact Analysis</h1>

        {/* File Upload Section */}
        <div className="flex justify-center">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="border p-2 rounded"
            disabled={isLoading}
          />
        </div>

        {/* Loading State */}
        {isLoading && <p className="text-lg font-bold text-gray-600 text-center">Processing CSV file...</p>}

        {/* Show Analysis Only After Data is Available */}
        {data && (
          <>
            <p className="text-lg text-gray-700 text-center">
              Model R² Score:{" "}
              <Badge variant="outline" className="text-lg">
                {data.r2.toFixed(2)}
              </Badge>
            </p>

            {/* Suggestions */}
            <Card className="bg-gray-100 shadow-lg">
              <CardHeader>
                <CardTitle>💡 Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  {data.suggestions.map((s, idx) => (
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
                  <Bar
                    data={{
                      labels: data.summary.map((item) => item.Campaign_Type),
                      datasets: [
                        {
                          label: "ROI",
                          data: data.summary.map((item) => item.roi),
                          backgroundColor: "#3b82f6",
                          borderRadius: 6,
                        },
                      ],
                    }}
                  />
                </CardContent>
              </Card>

              {/* Conversion Rate Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>📉 Conversion Rate by Leads</CardTitle>
                </CardHeader>
                <CardContent>
                  <Scatter
                    data={{
                      labels: data.summary.map((item) => item.total_leads.toString()),
                      datasets: [
                        {
                          label: "Conversion Rate",
                          data: data.summary.map((item) => item.conversion_rate),
                          backgroundColor: "#ef4444",
                        },
                      ],
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Prompt to Upload CSV */}
        {!data && !isLoading && (
          <p className="text-lg text-gray-700 text-center">
            Please upload a CSV file to analyze marketing data.
          </p>
        )}
      </div>
    </div>
  )
}