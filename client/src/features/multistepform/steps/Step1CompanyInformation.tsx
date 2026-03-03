import { useFormContext } from "react-hook-form";

const inputFields = [
  { key: "companyName", placeholder: "Company Name", type: "text" },
  {
    key: "noOfShareholders",
    placeholder: "Number Of Shareholders",
    type: "number",
  },
  {
    key: "totalCapital",
    placeholder: "Total Capital Invested",
    type: "number",
  },
];

const Step1CompanyInformation = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div>
      <p className="text-sm font-semibold text-gray-700 mb-4">
        Tell us about your company <span className="text-blue-600">*</span>
      </p>
      <div className="flex flex-col gap-3">
        {inputFields.map(({ key, placeholder, type }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label
                htmlFor={key}
                className="text-xs font-semibold text-gray-600"
              >
                {placeholder}
              </label>
              <input
                id={key}
                type={type}
                placeholder={placeholder}
                {...register(key)}
                className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 text-sm text-gray-700 transition-all placeholder-gray-400 ${
                  errors[key] ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-blue-400 focus:ring-blue-100"
                }`}
              />
              {typeof errors[key]?.message === "string" && (
                <p className="text-xs text-red-500 font-medium mt-1 ps-2">
                  {errors[key]?.message}
                </p>
              )}
            </div>
        ))}
      </div>
    </div>
  );
};

export default Step1CompanyInformation;
