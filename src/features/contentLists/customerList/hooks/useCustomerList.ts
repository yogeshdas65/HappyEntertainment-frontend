import { appAxios } from "@service/apiInterCepters";
import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const getCustomerList = (
  search = "",
  currentPage = 1,
  limit = 15,
  state = "",
  street = "",
  city = "",
  zipCode = "",
  saleOfficerId = ""
) => {
  let customerUrl = `/allcustomer?limit=${limit}&skip=${(currentPage - 1) * limit}`;

  const queryParams = new URLSearchParams();
  if (search) queryParams.append("search", search);
  if (state) queryParams.append("state", state);
  if (street) queryParams.append("street", street);
  if (city) queryParams.append("city", city);
  if (zipCode) queryParams.append("zipCode", zipCode);
  if (saleOfficerId) queryParams.append("saleOfficerId", saleOfficerId);

  if (queryParams.toString()) {
    customerUrl += `&${queryParams.toString()}`;
  }

  console.log("Final Customer URL:", customerUrl);

  return appAxios
    .get(customerUrl)
    .then((response) => response?.data)
    .catch((error) => {
      console.error("An error occurred:", error.response);
      throw new Error(
        error.response?.data?.message || "Error fetching customers"
      );
    });
};

const useCustomerList = (
  search = "",
  currentPage = 1,
  limit = 15,
  state = "",
  street = "",
  city = "",
  zipCode = "",
  saleOfficerId = ""
) => {
  const queryClient = useQueryClient();
  const queryKey = useMemo(
    () => ["Customer-List", search, currentPage, state, street, city, zipCode, saleOfficerId],
    [search, currentPage, state, street, city, zipCode, saleOfficerId]
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey });
    };
  }, [queryClient, queryKey]);

  return useQuery({
    queryKey,
    queryFn: () => getCustomerList(search, currentPage, limit, state, street, city, zipCode),
    staleTime: 60000,
  });
};

export default useCustomerList;
