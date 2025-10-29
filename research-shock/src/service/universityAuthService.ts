import { axiosPublicInstance, axiosPrivateInstance } from "@/api/axois-config";

const universityGetVerified = "/auth/get-verify";
const universityLogin = "/auth/signin";
const universitySignup = "/auth/register-university";
const universityUserInfo = "/auth/user-info";

interface LoginCredentials {
  email: string;
  password: string;
}

interface GetVerified {
  email: string;
}

interface SignUp {
  password: string;
  university_name: string;
  country: string;
}

interface UniversityInfo {
  userInfo: {
    id: string;
    university: {
      id: string;
      createdAt: string;
      updatedAt: string;
      university_name: string;
      banner: string | null;
      logo: string | null;
      address: string | null;
      website: string | null;
      status: string;
      country: string;
      description: string | null;
    };
  };
  role: string;
}

export const universityAuthService = {
  async login(requestBody: LoginCredentials) {
    try {
      const { data } = await axiosPublicInstance.post(
        universityLogin,
        requestBody
      );
      return data;
    } catch (error) {
      throw error;
    }
  },

  async getVerified(requestBody: GetVerified) {
    try {
      const { data } = await axiosPublicInstance.post( 
        universityGetVerified,
        requestBody
      );
      return data;
    } catch (error) {
      throw error;
    }
  },

  async signup({ requestBody, token }: { requestBody: SignUp; token: string }) {
    try {
      const { data } = await axiosPublicInstance.post(
        universitySignup,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      throw error;
    }
  },

  async getUserInfo(): Promise<UniversityInfo> {
    try {
      const { data } = await axiosPrivateInstance.get(universityUserInfo);
      return data;
    } catch (error) {
      throw error;
    }
  },
};
