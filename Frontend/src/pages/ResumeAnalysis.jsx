import { useState } from "react";
import { Navbarnew } from "../Components/Navbarnew";
import { FooterSection } from "../Components/FooterSection";
import { Button } from "flowbite-react";
import backendUrl from "../api";
import axios from "axios";
import { toast } from "react-hot-toast";

export function ResumeAnalysis() {
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    // Only Quick Scan supported, remove analysisOption
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please upload a PDF resume.");
            return;
        }
        setLoading(true);
        setResult(null);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("job_description", jobDescription);
            // Only Quick Scan supported, do not send analysis_option
            const response = await axios.post(
                `http://localhost:8000/analyze`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            setResult(response.data);
            toast.success("Resume analyzed successfully!");
        } catch (err) {
            toast.error("Failed to analyze resume.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
            <Navbarnew />
            <div className="flex-1 flex flex-col items-center justify-center py-8">
                <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
                    <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">Resume Analysis</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-blue-700 mb-2">Upload Resume (PDF)</label>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                className="block w-full border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-blue-700 mb-2">Job Description (optional)</label>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                rows={3}
                                className="block w-full border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Paste job description here..."
                            />
                        </div>
                        {/* Analysis type selection removed, only Quick Scan supported */}
                        <Button type="submit" color="blue" isProcessing={loading} disabled={loading} className="w-full">
                            {loading ? "Analyzing..." : "Analyze Resume"}
                        </Button>
                    </form>
                    {result && (
                        <div className="mt-8 bg-blue-50 border border-blue-200 rounded p-4">
                            <h3 className="text-lg font-semibold text-blue-700 mb-2">Analysis Result</h3>
                            <div className="text-gray-800 whitespace-pre-line">
                                {result.analysis}
                            </div>
                            {result.score !== null && (
                                <div className="mt-4 text-blue-700 font-bold">Score: {result.score}/100</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <FooterSection />
        </div>
    );
}
