import { appAxios } from "../../../../service/apiInterCepters";
import { useAuthStore } from "../../../../state/authStore";
import { useQuery } from "@tanstack/react-query";

const getStateList = () => {
  return appAxios
    .get("/getstate")
    .then((response: any) => response?.data)
    .catch((error: any) => {
      console.error("An error occurred:", error.response);
      throw new Error(
        error.response?.data?.message || "Error fetching states"
      );
    });
};

const useStateList = () => {
  const { authUser, setAuthState, authstate } = useAuthStore();
  const role = authUser?.role;

  console.log("useStateList hitting", authstate);

  return useQuery({
    queryKey: ["State-List"],
    queryFn: getStateList,
    enabled: role === "ADMIN" || role === "ADMINVIEW", // ✅ Only run query if role is ADMIN
    staleTime: 5000,
  });
};

export default useStateList;
