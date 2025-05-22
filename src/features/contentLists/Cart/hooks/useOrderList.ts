import { appAxios } from "@service/apiInterCepters";
import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const getOrderList = (
  search = "",
  currentPage = 1,
  limit = 10,
  saleOfficerName = "",
  customerName = "",
  state = "",
  city = "",
  street = "",
  productBrand = "",
  productName = "",
  productPrice = "",
  productLength = "",
  productGrossWeight = "",
  productCoreWeight = ""
) => {
  let orderUrl = `/allorder?limit=${limit}&skip=${(currentPage - 1) * limit}`;

  const queryParams = new URLSearchParams();
  if (search) queryParams.append("search", search);
  if (saleOfficerName) queryParams.append("saleOfficerName", saleOfficerName);
  if (customerName) queryParams.append("customerName", customerName);
  if (state) queryParams.append("state", state);
  if (city) queryParams.append("city", city);
  if (street) queryParams.append("street", street);
  if (productBrand) queryParams.append("productBrand", productBrand);
  if (productName) queryParams.append("productName", productName);
  if (productPrice) queryParams.append("productPrice", productPrice);
  if (productLength) queryParams.append("productLength", productLength);
  if (productGrossWeight) queryParams.append("productGrossWeight", productGrossWeight);
  if (productCoreWeight) queryParams.append("productCoreWeight", productCoreWeight);

  if (queryParams.toString()) {
    orderUrl += `&${queryParams.toString()}`;
  }

  console.log("Final Order URL:", orderUrl);

  return appAxios
    .get(orderUrl)
    .then((response) => response?.data)
    .catch((error) => {
      console.error("An error occurred:", error.response);
      throw new Error(error.response?.data?.message || "Error fetching orders");
    });
};

const useOrderList = (
  search = "",
  currentPage = 1,
  limit = 10,
  saleOfficerName = "",
  customerName = "",
  state = "",
  city = "",
  street = "",
  productBrand = "",
  productName = "",
  productPrice = "",
  productLength = "",
  productGrossWeight = "",
  productCoreWeight = ""
) => {
  const queryClient = useQueryClient();

  const queryKey = useMemo(
    () => [
      "Order-List",
      search,
      currentPage,
      saleOfficerName,
      customerName,
      state,
      city,
      street,
      productBrand,
      productName,
      productPrice,
      productLength,
      productGrossWeight,
      productCoreWeight,
    ],
    [
      search,
      currentPage,
      saleOfficerName,
      customerName,
      state,
      city,
      street,
      productBrand,
      productName,
      productPrice,
      productLength,
      productGrossWeight,
      productCoreWeight,
    ]
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey });
    };
  }, [queryClient, queryKey]);

  return useQuery({
    queryKey,
    queryFn: () =>
      getOrderList(
        search,
        currentPage,
        limit,
        saleOfficerName,
        customerName,
        state,
        city,
        street,
        productBrand,
        productName,
        productPrice,
        productLength,
        productGrossWeight,
        productCoreWeight
      ),
    staleTime: 60000,
  });
};

export default useOrderList;
