import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { schema } from "../schema";

type FormValues = z.infer<typeof schema>;

const Step3Review = () => {
  const { getValues } = useFormContext<FormValues>();
  const data = getValues();
  console.log(data)

  return (
    <div className="flex flex-col gap-6">

      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Company Details
        </p>
        <div className="flex flex-col gap-3 p-4 rounded-2xl border border-gray-100 bg-gray-50/50">

          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400">Company Name</span>
            <span className="text-sm font-semibold text-gray-700">{data.companyName}</span>
          </div>

          <div className="h-px bg-gray-100" />

          <div className="flex gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400">No. of Shareholders</span>
              <span className="text-sm font-semibold text-gray-700">{data.noOfShareholders}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400">Total Capital</span>
              <span className="text-sm font-semibold text-gray-700">
                {data.totalCapital.toLocaleString()}
              </span>
            </div>
          </div>

        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Shareholders
        </p>

        {data.shareholders.map((s, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 p-4 rounded-2xl border border-gray-100 bg-gray-50/50"
          >
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Shareholder {index + 1}
            </p>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">First Name</span>
                <span className="text-sm font-semibold text-gray-700">{s.firstName}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">Last Name</span>
                <span className="text-sm font-semibold text-gray-700">{s.lastName}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">Nationality</span>
                <span className="text-sm font-semibold text-gray-700">{s.nationality}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default Step3Review;