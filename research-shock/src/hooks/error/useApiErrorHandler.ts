import { AxiosError } from "axios";
import { toast } from "react-toastify";

interface ApiErrorResponse {
  error?: string;
  message?: string;
  statusCode?: number;
}

export const handleError = (error: unknown) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as AxiosError).isAxiosError
  ) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (axiosError.response) {
      toast.error(axiosError.response.data?.message || "Something went wrong!");
    } else if (axiosError.request) {
      toast.error("Network error. Please check your internet connection.");
    } else {
      toast.error("An unexpected error occurred.");
    }
  } else {
    toast.error("Something went wrong!");
  }
};
