import { appAxios } from "@service/apiInterCepters";
import { useMutation } from "@tanstack/react-query";

const updateCustomer = async ({ customerId, data }: { customerId: any; data: any }) => {
    return await appAxios.put(`/updatecustomer/${customerId}`, data);
};

const deleteCustomer = async (customerId: any) => {
    return await appAxios.delete(`/deletecustomer/${customerId}`);
};

// Update the types for variables
type CustomerMutationVariables = {
  customerId: any;
  data?: any; // Optional data for delete operation
};

const useCustomerMutation = (
    successHandler: any,
    errorHandler: any,
    isDelete: boolean = false // Flag to indicate delete operation
) => {
    return useMutation({
        mutationFn: async (variables: CustomerMutationVariables) => {
            // If it's a delete operation, only customerId is needed
            if (isDelete) {
                return deleteCustomer(variables.customerId);
            } else {
                // For update operation, both customerId and data are required
                if (!variables.data) {
                    throw new Error("Data is required for update");
                }
                return updateCustomer(variables);
            }
        },
        onSuccess: (data) => successHandler(),
        onError: (error) => errorHandler(error),
    });
};

export default useCustomerMutation;
