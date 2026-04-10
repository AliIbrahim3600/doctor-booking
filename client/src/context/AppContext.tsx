import { createContext, useState } from "react";
import type { ReactNode } from "react";


type DataContextType = {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};
const DataContext = createContext<DataContextType | undefined>(undefined);

type DataProviderProps = {
  children: ReactNode;
};

export const DataProvider = ({ children }: DataProviderProps) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  return (
    <DataContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;