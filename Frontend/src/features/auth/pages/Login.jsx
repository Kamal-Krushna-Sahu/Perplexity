import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.js";

function Login() {
  /** 
    if you want to destructure in one line
    i.e. const { user, loading } = useSelector((state) => state.auth.user);
    it will throw an error
    Cannot destructure property 'user' of 'useSelector(...)' as it is null.
    so do it one by one.
  */
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { handleLogin } = useAuth();

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    await handleLogin({ email, password });
    navigate("/");
  }

  // logged in user can't access Login page
  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="min-h-screen w-full flex justify-center items-center">
      <div className="flex flex-col items-center p-10 w-100">
        <h1 className="text-[#D97757] text-3xl font-bold">LOGIN</h1>

        <form
          className="flex flex-col items-center gap-2 w-full py-5"
          onSubmit={handleSubmit}
        >
          <input
            className="border border-[#D97757] w-full px-4 py-2 rounded-full outline-none"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="border border-[#D97757] w-full px-4 py-2 rounded-full outline-none"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-[#D97757] px-4 py-2 rounded-full cursor-pointer w-full">
            Login
          </button>
        </form>
        <p>
          Don't have an account{" "}
          <Link to={"/register"}>
            <span className="text-[#D97757] font-bold">Register</span>
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
