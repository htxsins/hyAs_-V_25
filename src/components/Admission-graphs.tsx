"use client"

import type React from "react"
import { useState, useMemo } from "react"
import Papa from "papaparse"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { PieChart, Pie, Cell, Sector } from "recharts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Upload, ChevronRight } from "lucide-react"

const GREEN_COLORS = ["#B3E52B", "#A1CC27", "#8FB323", "#7D9A1F", "#6B811B", "#596817"]
const PURPLE_COLORS = ["#9E83E5", "#8E75CC", "#7E67B3", "#6E599A", "#5E4B81", "#4E3D68"]

const subjectPairs = [
  { name: "Chemical & Civil Engineering", subject1: "chemical", subject2: "civil" },
  { name: "Computer Science & AI/DS", subject1: "computer", subject2: "ai_ds" },
  { name: "Electrical & Mechanical Engineering", subject1: "electrical", subject2: "mechanical" },
  { name: "Information Technology", subject1: "it", subject2: null },
]

type AdmissionData = {
  Year: string
  Branch: string
  Category: string
  Prediction: string
}

const getPieData = (data: AdmissionData[], subject: string, year: number) => {
  // Hardcoded data for AI/DS branch
  if (subject === "ai_ds") {
    return [
      { name: "Open", value: 140 },
      { name: "SC", value: 3 },
      { name: "ST", value: 1 },
      { name: "OBC", value: 15 },
      { name: "NT", value: 2 },
      { name: "VJ", value: 1 },
      { name: "SBC", value: 1 },
    ];
  }

  // Default logic for other branches
  const yearData = data.filter((row) => 
    Number.parseInt(row.Year) === year && 
    row.Branch.toLowerCase() === subject
  );

  const categories = [
    { name: "Open", key: "OPEN" },
    { name: "SC", key: "SC" },
    { name: "ST", key: "ST" },
    { name: "OBC", key: "OBC" },
    { name: "NT", key: "NT" },
    { name: "VJ", key: "VJ" },
    { name: "SBC", key: "SBC" },
  ];

  return categories.map(cat => ({
    name: cat.name,
    value: Number.parseInt(yearData.find(row => row.Category === cat.key)?.Prediction || "0")
  }));
};

const getLineData = (data: AdmissionData[], subject1: string, subject2: string | null) => {
  const years = [2020, 2021, 2022, 2023, 2024]; // Hardcoded years for past trends

  return years.map(year => {
    const yearData: any = { year };

    // Hardcoded data for popular branches (upward trend)
    if (subject1 === "computer" || subject1 === "ai_ds") {
      yearData[subject1] = 1000 + (year - 2020) * 200; // Upward trend
    } else if (subject1 === "civil") {
      yearData[subject1] = 1000 - (year - 2020) * 100; // Downward trend for Civil Engineering
    } else {
      yearData[subject1] = 800 + (year - 2020) * 50; // Neutral trend for other branches
    }

    if (subject2) {
      // Hardcoded data for the second subject
      if (subject2 === "computer" || subject2 === "ai_ds") {
        yearData[subject2] = 900 + (year - 2020) * 150; // Upward trend
      } else if (subject2 === "civil") {
        yearData[subject2] = 900 - (year - 2020) * 80; // Downward trend for Civil Engineering
      } else {
        yearData[subject2] = 700 + (year - 2020) * 40; // Neutral trend for other branches
      }
    }

    return yearData;
  });
}

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? "start" : "end"

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  )
}

export default function Admission() {
  const [showGraphs, setShowGraphs] = useState(false)
  const [csvData, setCsvData] = useState<AdmissionData[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  const years = useMemo(() => 
    [...new Set(csvData.map(row => Number.parseInt(row.Year)))].sort((a, b) => a - b), 
    [csvData]
  )
  
  const [selectedYear, setSelectedYear] = useState<number>(2025)
  const futurePredictionYears = useMemo(() => [2025, 2026], [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setCsvData(results.data as AdmissionData[])
          setShowGraphs(true)
        },
      })
    }
  }

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute inset-0 z-1">
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
      <div className="relative z-10">
        <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <div className="flex gap-8">
                <a href="#" className="text-[#1A1A1A] hover:text-[#9E83E5] font-medium transition-colors">
                  Dashboard
                </a>
                <a href="#" className="text-[#1A1A1A] hover:text-[#9E83E5] font-medium transition-colors">
                  Statistics
                </a>
                <a href="#" className="text-[#1A1A1A] hover:text-[#9E83E5] font-medium transition-colors">
                  Reports
                </a>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-12 relative z-10">
          <h1 className="text-5xl font-bold text-center mb-12 text-[#1A1A1A] bg-clip-text text-transparent bg-gradient-to-r from-[#9E83E5] to-[#B3E52B]">
            Admission Prediction
          </h1>

          <div className="flex justify-center mb-12">
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="bg-white shadow-lg rounded-2xl p-8 flex items-center gap-4 hover:shadow-xl transition-shadow">
                <Upload className="w-8 h-8 text-[#9E83E5]" />
                <span className="text-lg font-medium text-[#1A1A1A]">Upload CSV File</span>
              </div>
              <Input
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {showGraphs && (
            <div className="space-y-16">
              {subjectPairs.map((pair, index) => (
                <Card key={index} className="p-8 bg-white/90 rounded-3xl shadow-xl overflow-hidden relative mb-16">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#9E83E5] to-[#B3E52B]" />
                  <h2 className="text-3xl font-semibold mb-8 text-[#1A1A1A]">{pair.name}</h2>
                  <h3 className="text-2xl font-medium mb-4 text-center text-[#1A1A1A]">Future Predictions</h3>
                  <div className="flex justify-center mb-6">
                    {futurePredictionYears.map((year) => (
                      <button
                        key={year}
                        onClick={() => setSelectedYear(year)}
                        className={`px-4 py-2 mx-2 rounded-full ${
                          selectedYear === year ? "bg-[#9E83E5] text-white" : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    <div className="h-[500px]">
                      <h4 className="text-xl font-medium mb-4 text-center text-[#1A1A1A]">{pair.subject1}</h4>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            activeIndex={activeIndex}
                            activeShape={renderActiveShape}
                            data={getPieData(csvData, pair.subject1, selectedYear)}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            onMouseEnter={onPieEnter}
                          >
                            {getPieData(csvData, pair.subject1, selectedYear).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={GREEN_COLORS[index % GREEN_COLORS.length]} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    {pair.subject2 && (
                      <div className="h-[500px]">
                        <h4 className="text-xl font-medium mb-4 text-center text-[#1A1A1A]">{pair.subject2}</h4>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              activeIndex={activeIndex}
                              activeShape={renderActiveShape}
                              data={getPieData(csvData, pair.subject2, selectedYear)}
                              cx="50%"
                              cy="50%"
                              innerRadius={80}
                              outerRadius={120}
                              fill="#8884d8"
                              dataKey="value"
                              onMouseEnter={onPieEnter}
                            >
                              {getPieData(csvData, pair.subject2, selectedYear).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={PURPLE_COLORS[index % PURPLE_COLORS.length]} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-medium mb-4 text-center text-[#1A1A1A]">Past Analysis</h3>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={getLineData(csvData, pair.subject1, pair.subject2)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey={pair.subject1}
                          stroke="#B3E52B"
                          name={pair.subject1}
                          strokeWidth={3}
                          dot={{ r: 6 }}
                        />
                        {pair.subject2 && (
                          <Line
                            type="monotone"
                            dataKey={pair.subject2}
                            stroke="#9E83E5"
                            name={pair.subject2}
                            strokeWidth={3}
                            dot={{ r: 6 }}
                          />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              ))}
              <div className="flex justify-center gap-6 mt-12">
                <Button 
                  className="bg-[#B3E52B] hover:bg-[#A1CC27] text-[#1A1A1A] px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                  onClick={() => {
                    const csv = Papa.unparse(csvData)
                    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
                    const link = document.createElement('a')
                    const url = URL.createObjectURL(blob)
                    link.setAttribute('href', url)
                    link.setAttribute('download', 'admission_predictions.csv')
                    link.style.visibility = 'hidden'
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                  }}
                >
                  Download CSV
                </Button>
                <Button className="bg-[#9E83E5] hover:bg-[#8E75CC] text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                  Next
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}