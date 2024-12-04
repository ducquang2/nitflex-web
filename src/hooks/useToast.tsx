import { toast, ToastOptions } from "react-toastify";

const defaultOption: ToastOptions = {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
};

const toastConfig: { [key: string]: ToastOptions } = {
  error: {
    ...defaultOption,
    className: "!bg-error",
  },
  success: {
    ...defaultOption,
    className: "!bg-success",
  },
  info: {
    ...defaultOption,
    className: "!bg-info",
  },
  warning: {
    ...defaultOption,
    className: "!bg-warning",
  },
}

/** @description should refactor useToast hook - use directly Toast component makes more sense */
function useToast() {
  const error = (message: string, opts?: ToastOptions) => {
    toast.error(message, { ...toastConfig['error'], ...opts })
  }

  const success = (message: string, opts?: ToastOptions) => {
    toast.success(message, { ...toastConfig['success'], ...opts })
  }

  const info = (message: string, opts?: ToastOptions) => {
    toast.info(message, { ...toastConfig['info'], ...opts })
  }

  const warning = (message: string, opts?: ToastOptions) => {
    toast.warning(message, { ...toastConfig['warning'], ...opts })
  }

  return { error, success, info, warning }
}

export { toastConfig, useToast };
