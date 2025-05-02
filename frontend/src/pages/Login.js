/* eslint-disable no-unused-vars */
import { Link, useNavigate } from "react-router-dom";
import logoImage from "../assets/images/lws-logo-light.svg";
import Error from "../components/ui/Error";
import { useEffect, useState } from "react";
import {
  authApi,
  useGoogleAuthMutation,
  useLoginMutation,
} from "../features/auth/authApi";
import { authWithGoogle } from "../config/gmailConfig";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [login, { data, isLoading, error: responseError }] = useLoginMutation();
  const [googleAuth, { error: googleError }] = useGoogleAuthMutation();

  useEffect(() => {
    if (data?.accessToken && data?.user) {
      navigate("/inbox");
    }

    if (responseError?.data) {
      setError(responseError?.data);
    }
  }, [data, responseError, navigate]);

  useEffect(() => {
    if (googleError?.data) {
      setError(googleError?.data);
    }
  }, [googleError]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!password) {
      setError("Password is required");
      return;
    }
    if (!email) {
      setError("Email is required");
      return;
    }
    login({ email, password });
  };

  async function handleGoogleAuth(e) {
    e.preventDefault();
    // Google OAuth implementation here
    authWithGoogle()
      .then((user) => {
        googleAuth({
          accessToken: user.accessToken,
          user: {
            name: user?.displayName,
            email: user?.email,
          },
        });
      })
      .catch((err) => {
        console.log("Google auth error", err);
      });
  }

  return (
    <div className="grid place-items-center h-screen bg-[#F9FAFB">
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <Link to="/">
              <img
                className="mx-auto h-12 w-auto"
                src={logoImage}
                alt="Learn with sumit"
              />
            </Link>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                disabled={isLoading}
              >
                Sign in
              </button>
            </div>
          </form>
          {error !== "" && <Error message={error?.message} />}
          <div className="flex  flex-col justify-end">
            {/* <div className="text-sm">
                <Link
                  to="/register"
                  className="font-medium text-violet-600 hover:text-violet-500"
                >
                  Register
                </Link>
              </div> */}
            <div>
              <div className="text-sm lowercase text-center">OR</div>
            </div>

            <div className="text-sm text-center mt-3">
              <button
                className=" py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                onClick={handleGoogleAuth}
              >
                <i className="fa-brands fa-google font-medium text-white"></i>{" "}
                &nbsp; Continue With Google
              </button>
            </div>
            <div className="text-sm text-center mt-3">
              <button
                className=" py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                // onClick={handleGoogleAuth}
              >
                <i className="fa-brands fa-facebook font-medium text-white"></i>{" "}
                &nbsp; Continue With Facebook
              </button>
            </div>
            <div className="text-sm text-center mt-3">
              <button
                className=" py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                // onClick={handleGoogleAuth}
              >
                <i className="fa-brands fa-github font-medium text-white"></i>{" "}
                &nbsp; Continue With Github
              </button>
            </div>
            <div className="text-sm text-center mt-3">
              <button
                className=" py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                // onClick={handleGoogleAuth}
              >
                <i className="fa-brands fa-twitter font-medium text-white"></i>{" "}
                &nbsp; Continue With Twitter
              </button>
            </div>

            <div className="mt-3">
              <p className="text-sm text-center">
                Don't have account?{" "}
                <Link
                  to={"/register"}
                  className="font-medium text-violet-600 hover:text-violet-500"
                >
                  Register Now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
