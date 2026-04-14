function AuthForm() {
  const [view, setView] = React.useState("login");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [msg, setMsg] = React.useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem("clubhub_user", JSON.stringify(user));
      window.location.href = "dashboard.html";
    } else {
      setMsg("Invalid email or password");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.find((u) => u.email === email)) {
      setMsg("User already exists");
      return;
    }

    const newUser = { name, email, password };
    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    setMsg("Registered successfully!");
    setView("login");
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg w-80 shadow-lg">
      <h2 className="text-xl mb-4 text-center font-bold">
        {view === "login" ? "Login" : "Register"}
      </h2>

      {msg && <p className="text-red-400 text-sm mb-2">{msg}</p>}

      {view === "login" ? (
        <form onSubmit={handleLogin}>
          <input
            className="w-full p-2 mb-2 text-black rounded"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full p-2 mb-2 text-black rounded"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-orange-500 w-full p-2 rounded">
            Login
          </button>
          <p
            className="mt-3 text-sm cursor-pointer text-center"
            onClick={() => setView("register")}
          >
            Create account
          </p>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <input
            className="w-full p-2 mb-2 text-black rounded"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full p-2 mb-2 text-black rounded"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full p-2 mb-2 text-black rounded"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-orange-500 w-full p-2 rounded">
            Register
          </button>
          <p
            className="mt-3 text-sm cursor-pointer text-center"
            onClick={() => setView("login")}
          >
            Back to login
          </p>
        </form>
      )}
    </div>
  );
}
