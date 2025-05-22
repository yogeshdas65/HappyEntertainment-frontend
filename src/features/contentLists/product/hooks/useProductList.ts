import { appAxios } from "../../../../service/apiInterCepters";
import { useAuthStore } from "../../../../state/authStore";
import { useQuery } from "@tanstack/react-query";

const getProductList = (
  search: string,
  currentPage: number = 1,
  limit: number = 10,
  pack?: string,
  brand?: string,
  name?: string,
  authstate?: string,
  role?: string
) => {


  console.log("getProductList Input:", { search, currentPage, limit, pack, brand, name, authstate, role });

  let productUrl = `/getproduct?limit=${limit}&skip=${(currentPage - 1) * limit}`;


  if (role === "ADMIN" || role === "ADMINVIEW" && authstate?.trim()) {
    productUrl += `&state=${authstate ? encodeURIComponent(authstate) : ""}`;
  }

  if (search) {
    productUrl += `&search=${encodeURIComponent(search)}`;
  } else {
    if (pack) productUrl += `&packagingType=${encodeURIComponent(pack)}`;
    if (brand) productUrl += `&brand=${encodeURIComponent(brand)}`;
    if (name) productUrl += `&name=${encodeURIComponent(name)}`;
  }

  console.log("Final Product URL:", productUrl);


  return appAxios
    .get(productUrl)
    .then((response: any) => response?.data)
    .catch((error: any) => {
      console.error("An error occurred:", error.response);
      throw new Error(
        error.response?.data?.message || "Error fetching products"
      );
    });
};

const useProductList = (
  search: string,
  currentPage: number = 1,
  limit: number = 10,
  pack?: string,
  brand?: string,
  name?: string,
  state?: string
) => {
  const { authUser, setAuthState, authstate } = useAuthStore();
  
  let role = authUser?.role;

  const queryKey = ["Product-List", { search, currentPage, limit, pack, brand, name, authstate, role }];

  return useQuery({
    queryKey,
    queryFn: () => getProductList(search, currentPage, limit, pack, brand, name, authstate, role),
    staleTime: 5000,
  });
};

export default useProductList;

