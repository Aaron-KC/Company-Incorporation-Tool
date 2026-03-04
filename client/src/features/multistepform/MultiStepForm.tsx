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
import FormNavigation from "../../components/multistepform/FormNavigation";
import Title from "../../components/multistepform/Title";

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
  const [companyId, setCompanyId] = useState<string | null>(
    localStorage.getItem("draft_company_id"),
  );

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

          if (res.status === 200) {
            setCompanyId(res.data.companyId);
            localStorage.setItem("draft_company_id", res.data.companyId);
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
  }, []);

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
        localStorage.removeItem("draft_company_id");
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
          <Title />
          <Header currentStep={currentStep} />
          <StepComponent />
          <FormNavigation currentStep={currentStep} totalSteps={STEPS.length} loading={loading} onBack={handleBack} onNext={handleNext} />
        </form>
      </FormProvider>
    </div>
  );
}
