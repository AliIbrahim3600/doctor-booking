import { createContext, useState } from "react";
import type { ReactNode } from "react";


type DataContextType = {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
};
const DataContext = createContext<DataContextType | undefined>(undefined);

type DataProviderProps = {
  children: ReactNode;
};

export const DataProvider = ({ children }: DataProviderProps) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <DataContext.Provider value={{ isDarkMode, setIsDarkMode, searchQuery, setSearchQuery }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;