import { useState } from "react";
import { Link } from "react-router";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    console.log(email, password);
    setEmail("");
    setPassword("");
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
