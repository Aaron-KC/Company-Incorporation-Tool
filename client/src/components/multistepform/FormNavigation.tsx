type Props = {
  currentStep: number;
  totalSteps: number;
  loading: boolean;
  onBack: () => void;
  onNext: () => void;
}

const FormNavigation = ({ currentStep, totalSteps, loading, onBack, onNext }: Props) => {
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex gap-3 mt-6">
      {currentStep > 1 && (
        <button
          onClick={onBack}
          type="button"
          className="px-8 py-2.5 rounded-full text-white text-sm font-semibold transition-all shadow-md bg-gray-600 hover:bg-gray-700 cursor-pointer"
        >
          Back
        </button>
      )}
      {!isLastStep && (
        <button
          onClick={onNext}
          type="button"
          disabled={loading}
          className="px-8 py-2.5 rounded-full text-white text-sm font-semibold transition-all shadow-md bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          {loading ? 'Saving...' : 'Next'}
        </button>
      )}
      {isLastStep && (
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-2.5 rounded-full text-white text-sm font-semibold transition-all shadow-md bg-green-600 hover:bg-green-700 cursor-pointer"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      )}
    </div>
  );
};

export default FormNavigation;