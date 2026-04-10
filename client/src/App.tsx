import "./App.css";

import { DataProvider } from "./context/AppContext";

function App() {
  return (
    <>
      <DataProvider>
        <p></p>
      </DataProvider>
    </>
  );
}

export default App;
