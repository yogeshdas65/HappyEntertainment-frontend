import { appAxios } from "@service/apiInterCepters";
import { useMutation } from "@tanstack/react-query";

const addProduct = async (form: any) => {
    return await appAxios.post("/createproduct", form, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
};

const useAddProductMutation = (successHandler: any, errorHandler: any) => {
    return useMutation({
        mutationFn: async (form: any) => await addProduct(form),
        onSuccess: (data) => successHandler(),
        onError: (error) => errorHandler(error),
    });
};

export default useAddProductMutation;
