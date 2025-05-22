import { appAxios } from "@service/apiInterCepters";
import { useMutation } from "@tanstack/react-query";

const updateProduct = async ({ productId, form }: { productId: any; form: any }) => {
    return await appAxios.put(`/updateproduct/${productId}`, form, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

const useUpdateProductMutation = (successHandler: any, errorHandler: any) => {
    return useMutation({
        mutationFn: async (variables: { productId: any; form: any }) => await updateProduct(variables),
        onSuccess: (data) => successHandler(),
        onError: (error) => errorHandler(error),
    });
};

export default useUpdateProductMutation;
