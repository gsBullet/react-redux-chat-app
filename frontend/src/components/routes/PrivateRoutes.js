import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const PrivateRoutes = ({ children }) => {
  const auth = useAuth();

  return auth ? children : <Navigate to={"/"} />;
};

export default PrivateRoutes;
