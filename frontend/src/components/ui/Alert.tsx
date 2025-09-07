interface AlertProps {
  type?: "success" | "error" | "info" | "warning";
  message: string;
}

export default function Alert({ message, type = "info" }: AlertProps) {
  const baseStyles = "px-4 py-3 rounded-lg text-sm font-medium";

  const variants = {
    success: "bg-green-100 text-green-700 border border-green-300",
    error: "bg-red-100 text-red-700 border border-red-300",
    info: "bg-blue-100 text-blue-700 border border-blue-300",
    warning: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  };

  return <div className={`${baseStyles} ${variants[type]}`}>{message}</div>;
}
