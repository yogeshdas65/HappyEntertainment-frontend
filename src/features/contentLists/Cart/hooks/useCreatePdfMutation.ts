import { useMutation } from "@tanstack/react-query";
import { Platform } from "react-native";
import RNFS from "react-native-fs";
import Toast from "react-native-toast-message";
import { appAxios } from "@service/apiInterCepters";

const createPdf = async (orderId: any) => {
  let url = `/orderpdf/${orderId}`;
  const response = await appAxios.get(url);
  return response.data;
};

const useCreatePdfMutation = (pdfSuccessHandler: any, pdfErrorHandler: any) => {
  return useMutation({
    mutationFn: async (orderData: any) => await createPdf(orderData),
    onSuccess: async (data) => await pdfSuccessHandler(data),
    onError: (error) => pdfErrorHandler(error),
  });
};

export default useCreatePdfMutation;
