const steps = [
  { number: 1, label: "Company" },
  { number: 2, label: "Shareholders" },
  { number: 3, label: "Review" },
];

type HeaderProps = {
  currentStep: number;
}

const Header = ({ currentStep }: HeaderProps) => {
  return (
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, i) => {
            const isActive = currentStep === step.number;
            const isDone = currentStep > step.number;
            return (
              <div key={step.number} className={`flex items-center ${step.number < steps.length ? "flex-1" : ""}`}>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200"
                        : isDone
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-gray-300 text-gray-400"
                    }`}
                  >
                    {isDone ? "✓" : step.number}
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      isActive ? "text-blue-600" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {i < steps.length - 1 && (
                  <div className="flex-1 mx-3 mb-5">
                    <div
                      className={`h-0.5 rounded-full transition-all duration-500 ${
                        currentStep > step.number ? "bg-blue-500" : "bg-gray-200"
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
  )
}

export default Header
