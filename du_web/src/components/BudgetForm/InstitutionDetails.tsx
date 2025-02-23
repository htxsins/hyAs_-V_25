"use client"

import { useFormContext } from "@/context/FormContext"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function InstitutionDetails() {
  const { formData, updateFormData } = useFormContext()

  const handleChange = (field: string, value: string | number) => {
    updateFormData("institutionDetails", { [field]: value })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Institution Details</h2>

      <div>
        <Label htmlFor="collegeTier">College's Tier</Label>
        <Input
          id="collegeTier"
          value={formData.institutionDetails.collegeTier}
          onChange={(e) => handleChange("collegeTier", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="institutionAge">Institution Age</Label>
        <Input
          id="institutionAge"
          type="number"
          value={formData.institutionDetails.institutionAge}
          onChange={(e) => handleChange("institutionAge", Number.parseInt(e.target.value))}
        />
      </div>

      <div>
        <Label htmlFor="accreditationGrade">Accreditation Grade</Label>
        <Select
          value={formData.institutionDetails.accreditationGrade}
          onValueChange={(value) => handleChange("accreditationGrade", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select grade" />
          </SelectTrigger>
          <SelectContent>
            {["A+", "A", "B", "C", "D"].map((grade) => (
              <SelectItem key={grade} value={grade}>
                {grade}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="nirfRanking">NIRF Ranking</Label>
        <Input
          id="nirfRanking"
          type="number"
          value={formData.institutionDetails.nirfRanking}
          onChange={(e) => handleChange("nirfRanking", Number.parseInt(e.target.value))}
        />
      </div>
    </div>
  )
}

