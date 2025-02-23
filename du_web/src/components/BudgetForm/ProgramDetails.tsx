"use client"

import { useFormContext } from "@/context/FormContext"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export default function ProgramDetails() {
  const { formData, updateFormData } = useFormContext()

  const handleChange = (field: string, value: string | number | boolean) => {
    updateFormData("programDetails", { [field]: value })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Program Details</h2>

      <div>
        <Label htmlFor="programName">Program Name</Label>
        <Input
          id="programName"
          value={formData.programDetails.programName}
          onChange={(e) => handleChange("programName", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="courseLevel">Course Level</Label>
        <Select
          value={formData.programDetails.courseLevel}
          onValueChange={(value) => handleChange("courseLevel", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select course level" />
          </SelectTrigger>
          <SelectContent>
            {["Undergrad", "Postgrad", "PhD"].map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="duration">Duration (in years)</Label>
        <Input
          id="duration"
          type="number"
          value={formData.programDetails.duration}
          onChange={(e) => handleChange("duration", Number.parseInt(e.target.value))}
        />
      </div>

      <div>
        <Label htmlFor="annualIntake">Annual Intake</Label>
        <Input
          id="annualIntake"
          type="number"
          value={formData.programDetails.annualIntake}
          onChange={(e) => handleChange("annualIntake", Number.parseInt(e.target.value))}
        />
      </div>

      <div>
        <Label htmlFor="feePerSemester">Fee per Semester</Label>
        <Input
          id="feePerSemester"
          type="number"
          value={formData.programDetails.feePerSemester}
          onChange={(e) => handleChange("feePerSemester", Number.parseInt(e.target.value))}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="labIntensive"
          checked={formData.programDetails.labIntensive}
          onCheckedChange={(checked) => handleChange("labIntensive", checked)}
        />
        <Label htmlFor="labIntensive">Lab Intensive</Label>
      </div>
    </div>
  )
}

