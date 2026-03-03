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
  let valid = true;
  const onNext = () => {};
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
          <>
            <input
              key={key}
              type={type}
              placeholder={placeholder}
              {...register(key)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm text-gray-700 transition-all placeholder-gray-400"
            />
            {typeof errors[key]?.message === "string" && (
              <p className="text-red-500 text-xs mt-1 ps-2">
                {errors[key]?.message}
              </p>
            )}
          </>
        ))}
      </div>
    </div>
  );
};

export default Step1CompanyInformation;
