import { useFormContext, useFieldArray } from "react-hook-form";
import { useEffect } from "react";

type Shareholder = {
  firstName: string;
  lastName: string;
  nationality: string;
};

type FormValues = {
  noOfShareholders: number;
  shareholders: Shareholder[];
};

const Step2ShareholdersInformation = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<FormValues>();

  const { fields, replace } = useFieldArray<FormValues>({ name: "shareholders" });
  const noOfShareholders = watch("noOfShareholders");

  useEffect(() => {
    const count = Number(noOfShareholders);
    if (!count || count < 1) return;

    const synced = Array.from({ length: count }, (_, i) => ({
      firstName: fields[i]?.firstName ?? "",
      lastName: fields[i]?.lastName ?? "",
      nationality: fields[i]?.nationality ?? "",
    }));

    replace(synced);
  }, [noOfShareholders]);

  return (
    <div>
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Shareholders Info
        </p>
        {fields.map((field, index) => (
          <div
            key={field.id}  
            className="flex flex-col gap-3 p-4 rounded-2xl border border-gray-100 bg-gray-50/50"
          >
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Shareholder {index + 1}
            </p>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={`shareholders.${index}.firstName`}
                className="text-xs font-semibold text-gray-600"
              >
                First Name
              </label>
              <input
                id={`shareholders.${index}.firstName`}
                type="text"
                {...register(`shareholders.${index}.firstName`)}
                className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 text-sm text-gray-700 transition-all placeholder-gray-400 ${
                  errors.shareholders?.[index]?.firstName
                    ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                    : "border-gray-200 focus:border-blue-400 focus:ring-blue-100"
                }`}
              />
              {errors.shareholders?.[index]?.firstName && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.shareholders[index]?.firstName?.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={`shareholders.${index}.lastName`}
                className="text-xs font-semibold text-gray-600"
              >
                Last Name
              </label>
              <input
                id={`shareholders.${index}.lastName`}
                type="text"
                {...register(`shareholders.${index}.lastName`)}
                className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 text-sm text-gray-700 transition-all placeholder-gray-400 ${
                  errors.shareholders?.[index]?.lastName
                    ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                    : "border-gray-200 focus:border-blue-400 focus:ring-blue-100"
                }`}
              />
              {errors.shareholders?.[index]?.lastName && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.shareholders[index]?.lastName?.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={`shareholders.${index}.nationality`}
                className="text-xs font-semibold text-gray-600"
              >
                Nationality
              </label>
              <input
                id={`shareholders.${index}.nationality`}
                type="text"
                {...register(`shareholders.${index}.nationality`)}
                className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 text-sm text-gray-700 transition-all placeholder-gray-400 ${
                  errors.shareholders?.[index]?.nationality
                    ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                    : "border-gray-200 focus:border-blue-400 focus:ring-blue-100"
                }`}
              />
              {errors.shareholders?.[index]?.nationality && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.shareholders[index]?.nationality?.message}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step2ShareholdersInformation;