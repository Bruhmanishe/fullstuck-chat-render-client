import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import Error from "./elements/Error.jsx";
import ErrorContextProvider from "./context/ErrorContext.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <ErrorContextProvider>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </ErrorContextProvider>

  // </StrictMode>
);
