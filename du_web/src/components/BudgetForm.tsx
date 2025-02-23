"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import InstitutionDetails from "./BudgetForm/InstitutionDetails";
import ProgramDetails from "./BudgetForm/ProgramDetails";
import OperationalMetrics from "./BudgetForm/OperationalMetrics";
import ProgressBar from "./BudgetForm/ProgressBar";
import { useFormContext } from "@/context/FormContext";
import { fetchFromGenAI } from "@/lib/genAIClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function BudgetForm() {
    const [step, setStep] = useState(1);
    const totalSteps = 3;
    const { formData } = useFormContext();
    const [analysisData, setAnalysisData] = useState(null);
    const [loading, setLoading] = useState(false);

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleAnalyse = async () => {
        setLoading(true);
        try {
            const schema = {
                type: "object",
                properties: {
                    budget_analysis: { type: "string" },
                    suggestions: { type: "string" },
                    statistics: { type: "object", properties: {
                        cost_savings: { type: "number" },
                        revenue_projection: { type: "number" },
                        efficiency_score: { type: "number" }
                    } },
                    numerical_data: { type: "array", items: { type: "object", properties: {
                        category: { type: "string" },
                        value: { type: "number" }
                    } } }
                },
                required: ["budget_analysis", "suggestions", "statistics", "numerical_data"]
            };

            const prompt = `Analyze the following budget details and provide a detailed financial analysis, cost efficiency insights, revenue projections, and suggestions: ${JSON.stringify(formData, null, 2)}`;
            
            const response = await fetchFromGenAI(schema, prompt);
            setAnalysisData(response);
        } catch (error) {
            console.error("Error fetching budget analysis:", error);
            setAnalysisData({ budget_analysis: "Failed to generate budget analysis. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center">Analyse College Budget</h1>
            <ProgressBar currentStep={step} totalSteps={totalSteps} />
            
            {step === 1 && <InstitutionDetails />}
            {step === 2 && <ProgramDetails />}
            {step === 3 && <OperationalMetrics />}

            <div className="mt-6 flex justify-between">
                {step > 1 && (
                    <Button onClick={prevStep} variant="outline">Previous</Button>
                )}
                {step < totalSteps ? (
                    <Button onClick={nextStep}>Next</Button>
                ) : (
                    <Button onClick={handleAnalyse} disabled={loading}>
                        {loading ? "Analysing..." : "Analyse Budget"}
                    </Button>
                )}
            </div>

            {analysisData && (
                <div className="mt-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Budget Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700">{analysisData.budget_analysis}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Suggestions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700">{analysisData.suggestions}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Key Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p><strong>Cost Savings:</strong> ${analysisData.statistics.cost_savings}</p>
                            <p><strong>Revenue Projection:</strong> ${analysisData.statistics.revenue_projection}</p>
                            <p><strong>Efficiency Score:</strong> {analysisData.statistics.efficiency_score}%</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Numerical Data</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={analysisData.numerical_data}>
                                    <XAxis dataKey="category" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#4F46E5" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}