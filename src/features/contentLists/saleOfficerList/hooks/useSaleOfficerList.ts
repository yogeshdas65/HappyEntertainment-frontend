import { appAxios } from "@service/apiInterCepters";
import { useQuery } from "@tanstack/react-query";

const getSaleOfficerList = (
  search = "",
  currentPage = 1,
  limit = 10,
  name = "",
  email = "",
  assignedRegion = "",
  city = "",
  zipCode = ""
) => {
  let productUrl = `/allofficer?limit=${limit}&skip=${(currentPage - 1) * limit}`;

  const queryParams = new URLSearchParams();
  if (search) queryParams.append("search", search);
  if (name) queryParams.append("name", name);
  if (email) queryParams.append("email", email);
  if (assignedRegion) queryParams.append("assignedRegion", assignedRegion);
  if (city) queryParams.append("city", city);
  if (zipCode) queryParams.append("zipCode", zipCode);

  if (queryParams.toString()) {
    productUrl += `&${queryParams.toString()}`;
  }

  console.log("Final Sale Officer URL:", productUrl);

  return appAxios
    .get(productUrl)
    .then((response) => response?.data)
    .catch((error) => {
      console.error("An error occurred:", error.response);
      throw new Error(
        error.response?.data?.message || "Error fetching sale officers"
      );
    });
};

const useSaleOfficerList = (
  search = "",
  currentPage = 1,
  limit = 10,
  name = "",
  email = "",
  assignedRegion = "",
  city = "",
  zipCode = ""
) => {
  return useQuery({
    queryKey: [
      "SaleOfficer-List",
      search,
      currentPage,
      name,
      email,
      assignedRegion,
      city,
      zipCode,
    ],
    queryFn: () => getSaleOfficerList(search, currentPage, limit, name, email, assignedRegion, city, zipCode),
    staleTime: 5000,
  });
};

export default useSaleOfficerList;
