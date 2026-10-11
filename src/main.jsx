import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import { store } from "./store.js";
import { fetchCurrentUser } from "./features/auth/authSlice.js";
import App from "./App.jsx";

// Can't inspect the httpOnly cookie from JS, so always ask the backend once on load.
store.dispatch(fetchCurrentUser());

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);