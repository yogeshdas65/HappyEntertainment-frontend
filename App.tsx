import { View, Text } from "react-native";
import React from "react";
import Navigation from "./src/navigation/Navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Toast from 'react-native-toast-message';

const queryClient = new QueryClient();

const App = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Navigation />
        <Toast />
      </QueryClientProvider>
    </>
  );
};

export default App;
