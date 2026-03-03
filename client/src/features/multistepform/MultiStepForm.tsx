import { Component, useState } from "react";
import Header from "../../components/multistepform/Header";
import Step1CompanyInformation from "./steps/Step1CompanyInformation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "./schema";
import Step2ShareholdersInformation from "./steps/Step2ShareholdersInformation";
import Step3Review from "./steps/Step3Review";

const STEPS = [
  {
    component: Step1CompanyInformation,
    fields: ["companyName", "noOfShareholders", "totalCapital"],
  },
  {
    component: Step2ShareholdersInformation,
    fields: ["shareholders"],
  },
  {
    component: Step3Review,
    fields: []
  }
];

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isValid, setIsValid] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  console.log(currentStep, isValid, STEPS.length);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: "",
      noOfShareholders: "",
      totalCapital: "",
      shareholders: [],
    },
  });

  const handleNext = async () => {
    const currentFields = STEPS[currentStep - 1].fields;

    if(currentFields.length > 0) {
      const valid = await form.trigger(currentFields);
      setIsValid(valid);
      if (valid) {
        setCurrentStep((s) => s + 1);
      }
    }
  };

  const handleBack = () => setCurrentStep((s) => s - 1);

  const isLastStep = currentStep === STEPS.length;

  const StepComponent = STEPS[currentStep - 1].component;
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <FormProvider {...form}>
        <form className="bg-white rounded-3xl shadow-2xl shadow-gray-100 p-8 max-w-lg w-full">
          {/* Header */}
          <div className="text-center mb-7">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
              Company Incorporation Form
            </h1>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm mx-auto">
              Apply to incorporate your company in minutes
            </p>
          </div>
          {/* Step Indicators */}
          <Header currentStep={currentStep} />

          <StepComponent />
          <div className="flex gap-3 mt-6">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                type="button"
                className={`px-8 py-2.5 rounded-full text-white text-sm font-semibold transition-all shadow-md bg-gray-600 hover:bg-gray-700 shadow-gray-200 hover:shadow-gray-300 cursor-pointer`}
              >
                Back
              </button>
            )}
            {!isLastStep && (
              <button
                onClick={handleNext}
                type="button"
                className={`px-8 py-2.5 rounded-full text-white text-sm font-semibold transition-all shadow-md bg-blue-600 hover:bg-blue-700 shadow-blue-200 hover:shadow-blue-300 cursor-pointer`}
              >
                Next
              </button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
