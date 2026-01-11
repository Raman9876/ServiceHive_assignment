import { AlertCircle, CheckCircle, Info, XCircle, X } from "lucide-react";

const Alert = ({ type = "info", title, message, onClose }) => {
  const types = {
    info: {
      bg: "bg-glow-cyan/10 border-glow-cyan/30",
      icon: Info,
      iconColor: "text-glow-cyan",
      titleColor: "text-glow-cyan",
      textColor: "text-text-secondary",
    },
    success: {
      bg: "bg-status-online/10 border-status-online/30",
      icon: CheckCircle,
      iconColor: "text-status-online",
      titleColor: "text-status-online",
      textColor: "text-text-secondary",
    },
    warning: {
      bg: "bg-status-warning/10 border-status-warning/30",
      icon: AlertCircle,
      iconColor: "text-status-warning",
      titleColor: "text-status-warning",
      textColor: "text-text-secondary",
    },
    error: {
      bg: "bg-red-500/10 border-red-500/30",
      icon: XCircle,
      iconColor: "text-red-400",
      titleColor: "text-red-400",
      textColor: "text-text-secondary",
    },
  };

  const config = types[type];
  const Icon = config.icon;

  return (
    <div className={`${config.bg} border p-4`}>
      <div className="flex">
        <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0`} />
        <div className="ml-3 flex-1">
          {title && (
            <h4
              className={`text-sm font-mono font-medium ${config.titleColor}`}
            >
              {title}
            </h4>
          )}
          {message && (
            <p
              className={`text-sm font-mono ${config.textColor} ${
                title ? "mt-1" : ""
              }`}
            >
              {message}
            </p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`ml-3 ${config.iconColor} hover:opacity-70`}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
