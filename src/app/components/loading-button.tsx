import React from "react";
import { twMerge } from "tailwind-merge";
import Spinner from "./spinner";

type LoadingButtonProps = {
  loading: boolean;
  btnColor?: string;
  textColor?: string;
  children: React.ReactNode;
};

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  textColor = "text-white",
  btnColor = "bg-black",
  children,
  loading = false,
}) => {
  return (
    <button
      type="submit"
      className={twMerge(
        `!my-12 block w-full rounded-md px-4 py-4 text-sm font-medium tracking-widest text-white hover:bg-gray-800`,
        `${btnColor} ${loading && "bg-gray-600"}`,
      )}
    >
      {loading ? (
        <div className="flex w-full items-center justify-center gap-3">
          <Spinner />
          <span className={`${textColor} inline-block text-center`}>
            Loading...
          </span>
        </div>
      ) : (
        <span className={`${textColor}`}>{children}</span>
      )}
    </button>
  );
};
