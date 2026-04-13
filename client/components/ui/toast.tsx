import { toast as sonnerToast } from "sonner";

export function showToast(
  title: string,
  description?: string,
  variant: "success" | "warning" | "info" | "error" = "info",
  duration?: number
) {
  const period = duration ? duration : 5000;
  sonnerToast[variant](title, {
    duration: period,
    description,

    action: {
      label: "Dismiss",
      onClick: () => {},
    },

    className: "toast-container",
    descriptionClassName: "toast-description",

    actionButtonStyle: {
      color: "white",
    },

    style: {
      backgroundColor:
        variant === "success"
          ? "darkgreen"
          : variant === "warning"
          ? "orangered"
          : variant === "error"
          ? "darkred"
          : "gray",
      fontWeight: "bold",
      border: "gray",
    },
  });
}

/**
 * Show a generic or specific error toast.
 * @param message  Optional custom message; falls back to a generic one.
 */
export function errorToast(message?: string) {
  sonnerToast.error("Oops! Something went wrong", {
    description:
      message ??
      "We're sorry, we were unable to complete your request. You can try again or contact the support team if the problem persists.",
    action: {
      label: "Dismiss",
      onClick: () => {},
    },
  });
}

export function DateToast(title: string) {
  sonnerToast.info(title, {
    duration: 2000,

    className: "toast-container",
    descriptionClassName: "toast-description",

    actionButtonStyle: {
      color: "white",
    },

    style: {
      backgroundColor: "amber",
      fontWeight: "bold",
      border: "gray",
    },
  });
}
