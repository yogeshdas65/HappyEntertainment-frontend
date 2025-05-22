import { appAxios } from "../../../../service/apiInterCepters";
import { useMutation } from "@tanstack/react-query";

interface UploadParams {
    form: FormData;
    onProgress: (progress: number) => void;
}

const uploadDocument = async ({ form, onProgress }: UploadParams) => {
    if (!form) {
        throw new Error("Missing parameters");
    }

    const result = await appAxios.post(`/updateproduct-byexcel`, form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(progress);
            }
        },
    });

    return result;
};

const useUploadExcelMutation = (
    successHandler: () => void,
    errorHandler: (error: unknown) => void,
    onProgress: (progress: number) => void
) => {
    return useMutation({
        mutationFn: (form: FormData) => uploadDocument({ form, onProgress }),
        onSuccess: () => successHandler(),
        onError: (error) => errorHandler(error),
    });
};

export default useUploadExcelMutation;
