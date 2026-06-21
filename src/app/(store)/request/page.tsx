"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const projectTypes = [
  "Residential Construction",
  "Commercial Construction",
  "Infrastructure Development",
  "Road & Highway",
  "Bridge & Tunnel",
  "Water & Sewage",
  "Environmental",
  "Other",
];

const budgetRanges = [
  "Under $10,000",
  "$10,000 - $50,000",
  "$50,000 - $100,000",
  "$100,000 - $500,000",
  "$500,000+",
];

const timelines = [
  "ASAP",
  "Within 1 month",
  "1-3 months",
  "3-6 months",
  "6+ months",
];

const steps = ["Contact Info", "Project Details", "Description"];

export default function RequestPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectType: "",
    budget: "",
    timeline: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function nextStep() {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  }

  function prevStep() {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit request");
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="mt-5 text-2xl font-bold text-slate-900">Quote Request Submitted!</h2>
          <p className="mt-3 text-slate-600">
            Thank you for your interest. Our team will review your project details and
            get back to you within 1-2 business days.
          </p>
          <Button
            className="mt-8"
            onClick={() => {
              setIsSuccess(false);
              setCurrentStep(0);
              setFormData({ name: "", email: "", phone: "", company: "", projectType: "", budget: "", timeline: "", description: "" });
            }}
          >
            Submit Another Request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Request a Quote</h1>
        <p className="mt-2 text-lg text-slate-600">
          Tell us about your project and we will prepare a customized quote
        </p>
      </div>

      {/* Step Indicators */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentStep(i)}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                i === currentStep
                  ? "bg-blue-600 text-white"
                  : i < currentStep
                  ? "bg-blue-100 text-blue-600"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {i < currentStep ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                i + 1
              )}
            </button>
            <span
              className={`hidden text-sm font-medium sm:inline ${
                i === currentStep ? "text-blue-600" : "text-slate-400"
              }`}
            >
              {step}
            </span>
            {i < steps.length - 1 && (
              <div className={`mx-2 h-px w-8 sm:w-12 ${i < currentStep ? "bg-blue-300" : "bg-slate-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        {/* Step 1: Contact Info */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">Contact Information</h2>
            <Input
              label="Full Name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
            />
            <Input
              label="Email Address"
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
            />
            <Input
              label="Company (Optional)"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Your company name"
            />
          </div>
        )}

        {/* Step 2: Project Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">Project Details</h2>
            <div>
              <label htmlFor="projectType" className="block text-sm font-medium text-slate-700 mb-1.5">
                Project Type
              </label>
              <select
                id="projectType"
                name="projectType"
                required
                value={formData.projectType}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-slate-400"
              >
                <option value="">Select project type</option>
                {projectTypes.map((pt) => (
                  <option key={pt} value={pt}>{pt}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-slate-700 mb-1.5">
                Budget Range
              </label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-slate-400"
              >
                <option value="">Select budget range</option>
                {budgetRanges.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="timeline" className="block text-sm font-medium text-slate-700 mb-1.5">
                Timeline
              </label>
              <select
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-slate-400"
              >
                <option value="">Select timeline</option>
                {timelines.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Description */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">Project Description</h2>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your project requirements, specifications, and any other relevant details..."
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-slate-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                File Attachments
              </label>
              <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-slate-300 px-6 py-8">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mt-2 text-sm text-slate-600">
                    Drag and drop files here, or click to browse
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    PDF, DWG, DOC up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between">
          <div>
            {currentStep > 0 && (
              <Button type="button" variant="secondary" onClick={prevStep}>
                Previous
              </Button>
            )}
          </div>
          <div>
            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
