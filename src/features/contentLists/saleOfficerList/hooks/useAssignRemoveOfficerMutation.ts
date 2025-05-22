import { appAxios } from "@service/apiInterCepters";
import { useMutation } from "@tanstack/react-query";

const updateCustomer = async (data: any) => {
    return await appAxios.put(`/assigncustomerinsaleofficer`, data);
};

const useAssignRemoveOfficerMutation = (
  successHandler: any,
  errorHandler: any
) => {
  return useMutation({
      mutationFn: async (data) => updateCustomer(data),
    onSuccess: (data) => successHandler(),
    onError: (error) => errorHandler(error),
  });
};

export default useAssignRemoveOfficerMutation;
