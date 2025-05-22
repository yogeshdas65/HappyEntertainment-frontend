import { appAxios } from "@service/apiInterCepters";
import { useMutation } from "@tanstack/react-query";

const addOfficer = async (data: any) => {
  return await appAxios.post("/createsaleofficer", data);
};

const useAddOfficerMutation = (successHandler: any, errorHandler: any) => {
  return useMutation({
    mutationFn: async (data: any) => await addOfficer(data),
    onSuccess: (data) => successHandler(),
    onError: (error) => errorHandler(error),
  });
};

export default useAddOfficerMutation;
