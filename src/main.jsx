import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import { store } from "./store.js";
import { fetchCurrentUser } from "./features/auth/authSlice.js";
import App from "./App.jsx";

// If a token cookie already exists, fetch the user it belongs to
if (store.getState().auth.token) {
  store.dispatch(fetchCurrentUser());
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);