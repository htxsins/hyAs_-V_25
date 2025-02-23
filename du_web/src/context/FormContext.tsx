"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"

type FormData = {
  institutionDetails: {
    collegeTier: string
    institutionAge: number
    accreditationGrade: string
    nirfRanking: number
  }
  programDetails: {
    programName: string
    courseLevel: string
    duration: number
    annualIntake: number
    feePerSemester: number
    labIntensive: boolean
  }
  operationalMetrics: {
    studentFacultyRatio: number
    classroomUtilization: number
    labUtilization: number
    researchOutput: number
    industryCollaboration: number
  }
}

type FormContextType = {
  formData: FormData
  updateFormData: (step: keyof FormData, data: Partial<FormData[keyof FormData]>) => void
}

const FormContext = createContext<FormContextType | undefined>(undefined)

export const useFormContext = () => {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider")
  }
  return context
}

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>({
    institutionDetails: {
      collegeTier: "",
      institutionAge: 0,
      accreditationGrade: "",
      nirfRanking: 0,
    },
    programDetails: {
      programName: "",
      courseLevel: "",
      duration: 0,
      annualIntake: 0,
      feePerSemester: 0,
      labIntensive: false,
    },
    operationalMetrics: {
      studentFacultyRatio: 0,
      classroomUtilization: 0,
      labUtilization: 0,
      researchOutput: 0,
      industryCollaboration: 0,
    },
  })

  const updateFormData = (step: keyof FormData, data: Partial<FormData[keyof FormData]>) => {
    setFormData((prev) => ({
      ...prev,
      [step]: { ...prev[step], ...data },
    }))
  }

  return <FormContext.Provider value={{ formData, updateFormData }}>{children}</FormContext.Provider>
}

