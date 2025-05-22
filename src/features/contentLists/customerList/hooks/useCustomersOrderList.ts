import { appAxios } from "@service/apiInterCepters";
import { useQuery } from "@tanstack/react-query";

const getCustomerOrderList = (_id: any ,search: string, currentPage: number = 1, limit: number = 10) => {
  const sanitizedSearch = search || "";

  let Url = sanitizedSearch
    ? `/getorderbycustomer/${_id}?search=${sanitizedSearch}?limit=${limit}&skip=${(currentPage - 1) * limit}`
    : `/getorderbycustomer/${_id}?limit=${limit}&skip=${(currentPage - 1) * limit}`;

  return appAxios
    .get(Url)
    .then((response: any) => {
      return response?.data;
    })
    .catch((error: any) => {
      console.log("An error occurred:", error.response);
      throw new Error(
        error.response?.data?.message || "Error fetching allcustomer"
      );
    });
};

const useCustomersOrderList = (_id: string ,search: string, currentPage: number = 1, limit: number = 10) => {
  const sanitizedSearch = search || "";

  const queryKey = ["CustomersOrder-List", sanitizedSearch, currentPage]; // Include currentPage for cache management

  return useQuery({
    queryKey, // Cache key
    queryFn: () => getCustomerOrderList(_id , sanitizedSearch, currentPage, limit), // Fetching function with pagination
    // staleTime: 60000, // Cache validity (optional)
     refetchOnWindowFocus: false, // Disable refetching on window focus (optional)
  });
};

export default useCustomersOrderList;
