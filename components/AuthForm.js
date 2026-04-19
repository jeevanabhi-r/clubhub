function AuthForm() {
  const [view, setView] = React.useState("login");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = React.useState({ type: "", text: "" });

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login clicked");
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Register clicked");
  };

  return (
    <div className="space-y-4">

      {view === "login" && (
        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-orange-500 text-white py-3 rounded-lg">
            Login
          </button>

          <p className="text-center text-gray-400">
            No account?
            <button
              type="button"
              className="text-orange-500 ml-1"
              onClick={() => setView("register")}
            >
              Register
            </button>
          </p>

        </form>
      )}

      {view === "register" && (
        <form onSubmit={handleRegister} className="space-y-4">

          <input
            type="text"
            placeholder="Name"
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-orange-500 text-white py-3 rounded-lg">
            Register
          </button>

          <p className="text-center text-gray-400">
            Already have account?
            <button
              type="button"
              className="text-orange-500 ml-1"
              onClick={() => setView("login")}
            >
              Login
            </button>
          </p>

        </form>
      )}

    </div>
  );
}
