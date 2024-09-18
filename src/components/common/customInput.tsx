import clsx from "clsx";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
  fullWidth?: boolean;
  className?: string;
}

const CustomInput = ({
  label,
  errorMessage,
  fullWidth = false,
  className,
  ...props
}: CustomInputProps) => {
  return (
    <div className={clsx("flex flex-col", { "w-full": fullWidth }, className)}>
      {label && (
        <label className="text-md leading-md font-normal text-gray-500 mb-2">
          {label}
        </label>
      )}
      <input
        className={clsx(
          "p-3.5 px-5 rounded-lg bg-gray-100 border border-transparent",
          { "bg-red-100 border-red-200": errorMessage },
          "focus:outline-none focus:border-green-200",
          className
        )}
        {...props}
      />
      {errorMessage && (
        <p className="text-xs leading-4 font-normal text-red-200 mt-2">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default CustomInput;
