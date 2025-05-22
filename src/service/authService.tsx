import axios from "axios";
import {  BASE_URL } from "./config";
import { tokenKV, tokenStorage } from "../state/storage";
import { useAuthStore } from "../state/authStore";
import { resetAndNavigate } from "../utils/NavigationUtils";
import { appAxios } from "./apiInterCepters";

export const Login = async (logindetail: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, logindetail);
    const { accessToken, refreshToken, user } = response.data;
    tokenStorage.set("accessToken", accessToken);
    tokenStorage.set("refreshToken", refreshToken);
    const { setAuthUser } = useAuthStore.getState();
    setAuthUser(user);
  } catch (error) {
    console.log("Login Error", error);
  }
};

export const refetchUser = async (setAuthUser: any) => {
  try {
    const response = await appAxios.get(`/user`);
    setAuthUser(response.data.user);
  } catch (error) {
    console.log("Login Error", error);
  }
};

export const refresh_tokens = async () => {
  try {
     const refreshToken = await tokenKV.getItem('refreshToken');
    const response = await axios.post(`${BASE_URL}/refresh-token`, {
      refreshToken,
    });
    const new_access_token = response.data.accessToken;
    const new_refresh_token = response.data.refreshToken;
    await tokenKV.setItem('accessToken', new_access_token);
    await tokenKV.setItem("refreshToken", new_refresh_token);

    return new_access_token;
  } catch (error) {
    console.log("REFRESH TOKEN ERROR", error);
    tokenStorage.clearAll();
    resetAndNavigate("HomePage");
  }
};
