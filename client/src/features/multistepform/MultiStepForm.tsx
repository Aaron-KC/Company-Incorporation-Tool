import { useEffect, useState } from "react";
import Header from "../../components/multistepform/Header";
import Step1CompanyInformation from "./steps/Step1CompanyInformation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "./schema";
import Step2ShareholdersInformation from "./steps/Step2ShareholdersInformation";
import Step3Review from "./steps/Step3Review";
import { z } from "zod";
import type { Path } from "react-hook-form";

type FormValues = z.infer<typeof schema>;

const STEPS: { component: React.ComponentType; fields: Path<FormValues>[] }[] =
  [
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
      fields: [],
    },
  ];

const STORAGE_KEY1 = "multi-step-form-data";
const STORAGE_KEY2 = "multi-step-form-step";

export default function MultiStepForm() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY1) || "null");
  const savedStep = Number(localStorage.getItem(STORAGE_KEY2) || "1");
  const [currentStep, setCurrentStep] = useState(
    savedStep >= 1 && savedStep <= STEPS.length ? savedStep : 1,
  );
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: saved || {
      companyName: "",
      noOfShareholders: "",
      totalCapital: "",
      shareholders: [],
    },
  });

  const handleNext = async () => {
    const currentFields = STEPS[currentStep - 1].fields;

    if (currentFields.length > 0) {
      const valid = await form.trigger(currentFields);
      if (valid) {
        setCurrentStep((s) => s + 1);
      }
    }
  };

  useEffect(() => {
    const sub = form.watch((values) => {
      localStorage.setItem(STORAGE_KEY1, JSON.stringify(values));
    });
    return () => sub.unsubscribe();
  }, [form.watch]);

  console.log(currentStep);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY2, currentStep.toString());
  }, [currentStep]);

  const handleBack = () => setCurrentStep((s) => s - 1);

  const isLastStep = currentStep === STEPS.length;

  const StepComponent = STEPS[currentStep - 1].component;
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <FormProvider {...form}>
        <form className="bg-white rounded-3xl shadow-2xl shadow-gray-100 p-8 max-w-lg w-full">
          <div className="text-center mb-7">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
              Company Incorporation Form
            </h1>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm mx-auto">
              Apply to incorporate your company in minutes
            </p>
          </div>
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
            {!isLastStep ? (
              <button
                onClick={handleNext}
                type="button"
                className={`px-8 py-2.5 rounded-full text-white text-sm font-semibold transition-all shadow-md bg-blue-600 hover:bg-blue-700 shadow-blue-200 hover:shadow-blue-300 cursor-pointer`}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className={`px-8 py-2.5 rounded-full text-white text-sm font-semibold transition-all shadow-md bg-blue-600 hover:bg-blue-700 shadow-blue-200 hover:shadow-blue-300 cursor-pointer`}
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
