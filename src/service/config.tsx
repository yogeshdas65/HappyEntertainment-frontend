// export const BASE_URL_IOS = "http://localhost:5001/api";

// export const BASE_URL_EMULATOR = "http://10.0.2.2:5001/api";

// export const PRODUCTION_URL = "https://saleapp-server.onrender.com/api";

// export const SOCKET_URL = "http://localhost:5001/api";


import { Platform } from "react-native";

const isDev = true; // true in development mode

export const BASE_URL = isDev
  ? Platform.select({
      ios: "http://localhost:5001/api",
      android: "http://10.0.2.2:5001/api",
    })
  : "https://saleapp-server.onrender.com/api";

export const SOCKET_URL = isDev
  ? Platform.select({
      ios: "http://localhost:5001",
      android: "http://10.0.2.2:5001",
    })
  : "https://saleapp-server.onrender.com";