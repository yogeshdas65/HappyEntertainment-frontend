import { appAxios } from "@service/apiInterCepters";
import { useMutation } from "@tanstack/react-query";

const createOrder = async (orderData: any) => {
  try {
    const response = await appAxios.post("/createorder", orderData);
    return response?.data?.order;
  } catch (error: any) {
    console.error("Order creation failed:", error?.response);
    throw new Error(
      error?.response?.data?.message || "Something went wrong while creating the order."
    );
  }
};

const useCreateOrderMutation = (
  successHandler: (orderId: any) => void,
  errorHandler: (error: any) => void
) => {
  return useMutation({
    mutationFn: createOrder,
    onSuccess: successHandler,
    onError: errorHandler,
  });
};

export default useCreateOrderMutation;
