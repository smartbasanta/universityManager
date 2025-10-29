import { axiosPrivateInstance } from "@/api/axois-config";
import { allCountry } from "@/api/utils/util";

export const utilService = {
  async getAllCountry() {
    try {
      const { data } = await axiosPrivateInstance.get(allCountry);
      return data;
    } catch (error) {
      throw error;
    }
  },
};
