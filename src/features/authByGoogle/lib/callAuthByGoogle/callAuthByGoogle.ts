import { API_URL } from "@/shared/config";

export const callAuthByGoogle = () => {
  window.location.replace(`${API_URL}/auth/google`);
};
