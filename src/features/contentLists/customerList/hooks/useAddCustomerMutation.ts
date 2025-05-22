import { appAxios } from "@service/apiInterCepters";
import { useMutation } from "@tanstack/react-query";

const addCustomer = async (form: any) => {
  return await appAxios.post("/createcustomer", form);
};

const useAddCustomerMutation = (successHandler: any, errorHandler: any) => {
  return useMutation({
    mutationFn: async (form: any) => await addCustomer(form),
    onSuccess: (data) => successHandler(),
    onError: (error) => errorHandler(error),
  });
};

export default useAddCustomerMutation;
