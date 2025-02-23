"use client"

import { useFormContext } from "@/context/FormContext"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function OperationalMetrics() {
  const { formData, updateFormData } = useFormContext()

  const handleChange = (field: string, value: number) => {
    updateFormData("operationalMetrics", { [field]: value })
  }

  const handleAnalyse = () => {
    console.log("Form Data:", JSON.stringify(formData, null, 2))
    // Here you would typically send the data to an API or perform some analysis
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Operational Metrics</h2>

      <div>
        <Label htmlFor="studentFacultyRatio">Student Faculty Ratio</Label>
        <Input
          id="studentFacultyRatio"
          type="number"
          value={formData.operationalMetrics.studentFacultyRatio}
          onChange={(e) => handleChange("studentFacultyRatio", Number.parseFloat(e.target.value))}
        />
      </div>

      <div>
        <Label htmlFor="classroomUtilization">Classroom Utilization (0-1)</Label>
        <Input
          id="classroomUtilization"
          type="number"
          min="0"
          max="1"
          step="0.1"
          value={formData.operationalMetrics.classroomUtilization}
          onChange={(e) => handleChange("classroomUtilization", Number.parseFloat(e.target.value))}
        />
      </div>

      <div>
        <Label htmlFor="labUtilization">Lab Utilization (0-1)</Label>
        <Input
          id="labUtilization"
          type="number"
          min="0"
          max="1"
          step="0.1"
          value={formData.operationalMetrics.labUtilization}
          onChange={(e) => handleChange("labUtilization", Number.parseFloat(e.target.value))}
        />
      </div>

      <div>
        <Label htmlFor="researchOutput">Research Output (0-10)</Label>
        <Input
          id="researchOutput"
          type="number"
          min="0"
          max="10"
          step="0.1"
          value={formData.operationalMetrics.researchOutput}
          onChange={(e) => handleChange("researchOutput", Number.parseFloat(e.target.value))}
        />
      </div>

      <div>
        <Label htmlFor="industryCollaboration">Industry Collaboration (0-10)</Label>
        <Input
          id="industryCollaboration"
          type="number"
          min="0"
          max="10"
          step="0.1"
          value={formData.operationalMetrics.industryCollaboration}
          onChange={(e) => handleChange("industryCollaboration", Number.parseFloat(e.target.value))}
        />
      </div>

    </div>
  )
}

