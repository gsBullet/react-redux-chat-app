import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import Conversation from "./pages/Conversation";
import Inbox from "./pages/Inbox";
import Login from "./pages/Login";
import Register from "./pages/Register";
import useAuthChecked from "./hooks/useAuthCheck";
import PrivateRoutes from "./components/routes/PrivateRoutes";
import PublicRoutes from "./components/routes/PublicRoutes";

function App() {
  const authchecked = useAuthChecked();
  return (
    <>
      {!authchecked ? (
        "Authorization checking ......"
      ) : (
        <HashRouter
          future={{
            v7_startTransition: true,
          }}
        >
          <Routes>
            <Route
              path="/"
              element={
                <PublicRoutes>
                  <Login />
                </PublicRoutes>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoutes>
                  {" "}
                  <Register />
                </PublicRoutes>
              }
            />
            <Route
              path="/inbox"
              element={
                <PrivateRoutes>
                  {" "}
                  <Conversation />
                </PrivateRoutes>
              }
            />
            <Route
              path="/inbox/:id"
              element={
                <PrivateRoutes>
                  <Inbox />
                </PrivateRoutes>
              }
            />
          </Routes>
        </HashRouter>
      )}
    </>
  );
}

export default App;
