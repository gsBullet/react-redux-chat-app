import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedOut } from "../../features/auth/authSlice";
import gravaterUrl from "gravatar-url";

export default function Navigation() {
  const { user } = useSelector((state) => state?.auth) || {};
  const { email, name } = user || {};
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(userLoggedOut());
    localStorage.removeItem("auth");
  };
  return (
    <nav className="border-general sticky top-0 z-40 border-b bg-violet-700 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between h-16 items-center">
          <Link to="/">
            <img
              className="h-10 inline border rounded"
              src={gravaterUrl(email, { size: 80 })}
              alt="user_image"
            />
            <h4 className="inline-block text-4xl pl-2 text-white font-bold leading-[22px] align-middle capitalize">
              {name}
            </h4>
          </Link>
          <ul>
            <li className="text-white">
              <span className="cursor-pointer" onClick={logout}>
                {" "}
                Logout
              </span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
