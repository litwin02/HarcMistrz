import React, { createContext, useContext } from "react";

const ApiContext = createContext<string>("");

export const ApiProvider: React.FC<{ baseUrl: string; children: React.ReactNode }> = ({ baseUrl, children }) => (
  <ApiContext.Provider value={baseUrl}>{children}</ApiContext.Provider>
);

export const useApi = () => useContext(ApiContext);
