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
import { api } from "../../utils/axios";

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
  const [loading, setLoading] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);

  const handleNext = async () => {
    try {
      const currentFields = STEPS[currentStep - 1].fields;

      const valid = await form.trigger(currentFields);
      if (valid) {
        setLoading(true);
        if (currentStep === 1) {
          const data = form.getValues();
          let sessionId = localStorage.getItem("draft_session_id");
          if (!sessionId) {
            sessionId = crypto.randomUUID();
            localStorage.setItem("draft_session_id", sessionId);
          }
          const res = await api.post("/company/draft", {
            sessionId,
            companyName: data.companyName,
            noOfShareholders: data.noOfShareholders,
            totalCapital: data.totalCapital,
          });
          console.log(res);

          if (res.status === 200) {
            setCompanyId(res.data.companyId);
            setCurrentStep((s) => s + 1);
          }
        } else {
          setCurrentStep((s) => s + 1);
        }
      }
    } catch (err) {
      console.log(err);
      alert("An error occurred. Please try again.");
      return;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const sub = form.watch((values) => {
      localStorage.setItem(STORAGE_KEY1, JSON.stringify(values));
    });
    return () => sub.unsubscribe();
  }, [form.watch]);

  const getDraft = async () => {
    const sessionId = localStorage.getItem("draft_session_id");
    if (!sessionId) return;

    try {
      const res = await api.get(`/company/draft/${sessionId}`);
      const draft = res.data;
      if (draft) {
        form.reset({
          companyName: draft.company_name,
          noOfShareholders: draft.no_of_shareholders,
          totalCapital: draft.total_capital,
        });
      }
    } catch (err) {
      console.log("Error fetching draft:", err);
      alert("Failed to load draft. Starting fresh.");
    }
  };

  useEffect(() => {
    if (currentStep === 1) {
      getDraft();
    }
    localStorage.setItem(STORAGE_KEY2, currentStep.toString());
  }, [currentStep]);

  const handleBack = () => setCurrentStep((s) => s - 1);

  const isLastStep = currentStep === STEPS.length;

  const StepComponent = STEPS[currentStep - 1].component;

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      setLoading(true);
      const sessionId = localStorage.getItem("draft_session_id");
      if (!sessionId) {
        alert("Session expired. Please start again.");
        return;
      }
      if (!companyId) {
        alert("Company information not saved. Please complete Step 1 again.");
        return;
      }
      const res = await api.post("/shareholder", {
        shareholders: data.shareholders,
        companyId,
      });

      if (res.status == 201) {
        alert("Company incorporated successfully!");
        localStorage.removeItem(STORAGE_KEY1);
        localStorage.removeItem(STORAGE_KEY2);
        localStorage.removeItem("draft_session_id");
        form.reset({
          companyName: "",
          noOfShareholders: "",
          totalCapital: "",
          shareholders: [],
        });
        setCurrentStep(1);
        return;
      }
    } catch (error) {
      alert("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  });
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <FormProvider {...form}>
        <form
          className="bg-white rounded-3xl shadow-2xl shadow-gray-100 p-8 max-w-lg w-full"
          onSubmit={onSubmit}
        >
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
            {!isLastStep && (
              <button
                onClick={handleNext}
                type="button"
                className={`px-8 py-2.5 rounded-full text-white text-sm font-semibold transition-all shadow-md bg-blue-600 hover:bg-blue-700 shadow-blue-200 hover:shadow-blue-300 cursor-pointer`}
                disabled={loading}
              >
                Next
              </button>
            )}
            {isLastStep && (
              <button
                type="submit"
                className={`px-8 py-2.5 rounded-full text-white text-sm font-semibold transition-all shadow-md bg-green-600 hover:bg-green-700 shadow-green-200 hover:shadow-green-300 cursor-pointer`}
                disabled={loading}
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
