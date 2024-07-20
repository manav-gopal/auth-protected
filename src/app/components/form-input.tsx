import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

type FormInputProps = {
  label: string;
  name: string;
  type?: string;
  show?: boolean;
};

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = "text",
  show = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-normal">
        {label}
      </label>
      {type === "password" && show ? (
        <div className="flex w-full items-center overflow-hidden rounded-md border border-gray-300 focus-within:ring-1 focus-within:ring-blue-500">
          <input
            type={showPassword ? "text" : "password"}
            id={name}
            placeholder="Enter"
            className="flex-grow px-3 py-2 focus:outline-none"
            {...register(name)}
          />
          <button
            type="button"
            className="bg-white px-2 py-1 text-base font-normal text-black underline hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      ) : (
        <input
          type={type}
          placeholder="Enter"
          className="focus:ring-primary focus:border-primary mb-4 mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm sm:text-sm"
          {...register(name)}
        />
      )}
      {errors[name] && (
        <span className="block pt-1 text-xs text-red-500">
          {errors[name]?.message as string}
        </span>
      )}
    </div>
  );
};

export default FormInput;
