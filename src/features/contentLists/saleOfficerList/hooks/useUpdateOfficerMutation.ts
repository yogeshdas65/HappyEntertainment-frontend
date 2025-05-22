import { appAxios } from "@service/apiInterCepters";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

const updateOfficer = async ({ saleOfficerId, data }: { saleOfficerId: any; data: any }) => {
    return await appAxios.put(`/updateofficer/${saleOfficerId}`, data);
};

const deleteOfficer = async (saleOfficerId: any) => {
    return await appAxios.delete(`/deleteofficer/${saleOfficerId}`);
};

type SaleOfficerMutationVariables = {
    saleOfficerId: any;
    data?: any;
};

const useOfficerMutation = (
    successHandler: () => void,
    errorHandler: (error: any) => void,
    isDelete: boolean = false
): UseMutationResult<any, Error, SaleOfficerMutationVariables> => {
    return useMutation({
        mutationFn: async (variables: SaleOfficerMutationVariables) => {
            if (isDelete) {
                return deleteOfficer(variables.saleOfficerId);
            } else {
                if (!variables.data) {
                    throw new Error("Data is required for update");
                }
                return updateOfficer(variables);
            }
        },
        onSuccess: successHandler,
        onError: errorHandler,
    });
};

export default useOfficerMutation;
