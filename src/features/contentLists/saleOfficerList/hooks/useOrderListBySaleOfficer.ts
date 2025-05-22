import { appAxios } from "@service/apiInterCepters";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

const getOrderList = (
    _id: string,
    search: string,
    currentPage: number = 1,
    limit: number = 10
) => {
    const sanitizedSearch = search || "";

    let Url = sanitizedSearch
        ? `/getorderbysaleofficer/${_id}?search=${sanitizedSearch}&limit=${limit}&skip=${(currentPage - 1) * limit
        }`
        : `/getorderbysaleofficer/${_id}?limit=${limit}&skip=${(currentPage - 1) * limit
        }`;

    return appAxios
        .get(Url)
        .then((response: any) => {
            return response?.data;
        })
        .catch((error: any) => {
            throw new Error(
                error.response?.data?.message || "Error fetching Customer"
            );
        });
};

const useOrderListBySaleOfficer = (
    _id: string, search: string, currentPage: number = 1, limit: number = 10, p0: { enabled: boolean; }) => {
    const queryClient = useQueryClient();
    const sanitizedSearch = search || "";
    // Memoize queryKey to prevent unnecessary re-renders
    const queryKey = useMemo(
        () => ["OrderListBySaleOfficer-List", _id, sanitizedSearch, currentPage],
        [_id, sanitizedSearch, currentPage]
    );

    useEffect(() => {
        return () => {
            queryClient.removeQueries(queryKey);
        };
    }, [queryClient, queryKey]);

    return useQuery({
        queryKey, // Cache key
        queryFn: () => getOrderList(_id, sanitizedSearch, currentPage, limit), // Fetching function with pagination
        // staleTime: 0, // Cache validity (optional)
        refetchOnWindowFocus: false, // Disable refetching on window focus (optional)
        //  cacheTime: 0,
    });
};

export default useOrderListBySaleOfficer;
