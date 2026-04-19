function AuthForm() {
  const [view, setView] = React.useState("login");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");

  return (
    <div className="space-y-4">

      {view === "login" && (
        <form className="space-y-3">

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-gray-800 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-gray-800 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-orange-500 p-3 rounded text-white">
            Login
          </button>

          <p className="text-gray-400 text-center">
            No account?
            <button onClick={() => setView("register")} className="text-orange-500 ml-1">
              Register
            </button>
          </p>

        </form>
      )}

      {view === "register" && (
        <form className="space-y-3">

          <input
            type="text"
            placeholder="Name"
            className="w-full p-3 rounded bg-gray-800 text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-gray-800 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-gray-800 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-orange-500 p-3 rounded text-white">
            Register
          </button>

          <p className="text-gray-400 text-center">
            Already have account?
            <button onClick={() => setView("login")} className="text-orange-500 ml-1">
              Login
            </button>
          </p>

        </form>
      )}

    </div>
  );
}
