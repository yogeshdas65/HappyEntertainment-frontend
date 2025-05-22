import { BASE_URL } from "../../../service/config";
import { useAuthStore } from "../../../state/authStore";
import { tokenKV, tokenStorage } from "../../../state/storage";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const login = async (loginDetail: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, loginDetail);
    const { accessToken, refreshToken, user } = response.data;
    await tokenKV.setItem('accessToken', accessToken);
    await tokenKV.setItem("refreshToken", refreshToken);

    const { setAuthUser } = useAuthStore.getState();
    setAuthUser(user);
    return user; // Ensure this is returned
  } catch (error) {
    console.log("Login error:", error); // Log any errors from the login API
    throw error; // Ensure the error is thrown to trigger the onError handler
  }
};

const useLoginMutation = (successHandler: any, errorHandler: any) => {
  return useMutation({
    mutationFn: async (loginDetail: any) => await login(loginDetail),
    onSuccess: (data) => {
      successHandler(data); // Trigger the success handler
    },
    onError: (error) => {
      console.log("Mutation failed with error:", error); // Log any error encountered
      errorHandler(error); // Trigger the error handler
    },
  });
};

export default useLoginMutation;
