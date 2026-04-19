function AuthForm() {
  const [view, setView] = React.useState("login");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  // 🔐 LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const snapshot = await window.getDocs(
        window.collection(window.db, "users")
      );

      let foundUser = null;

      snapshot.forEach((doc) => {
        const user = doc.data();
        if (user.email === email && user.password === password) {
          foundUser = user;
        }
      });

      if (foundUser) {
        localStorage.setItem("clubhub_user", JSON.stringify(foundUser));
        window.location.href = "dashboard.html";
      } else {
        setMsg("❌ Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setMsg("❌ Login error");
    }
  };

  // 📝 REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await window.addDoc(window.collection(window.db, "users"), {
        name,
        email,
        password,
        role: "student"
      });

      setMsg("✅ Registered successfully");
      setView("login");
    } catch (err) {
      console.error(err);
      setMsg("❌ Registration failed");
    }
  };

  return (
    <div className="space-y-4 text-white">

      {/* MESSAGE */}
      {msg && (
        <div className="bg-red-500 p-2 rounded text-center">
          {msg}
        </div>
      )}

      {/* LOGIN */}
      {view === "login" && (
        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 bg-zinc-800 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 bg-zinc-800 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-orange-500 py-2 rounded">
            Login
          </button>

          <p className="text-center">
            No account?
            <span
              className="text-orange-500 cursor-pointer ml-1"
              onClick={() => setView("register")}
            >
              Register
            </span>
          </p>

        </form>
      )}

      {/* REGISTER */}
      {view === "register" && (
        <form onSubmit={handleRegister} className="space-y-4">

          <input
            type="text"
            placeholder="Name"
            className="w-full px-4 py-2 bg-zinc-800 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 bg-zinc-800 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 bg-zinc-800 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-orange-500 py-2 rounded">
            Register
          </button>

          <p className="text-center">
            Already have account?
            <span
              className="text-orange-500 cursor-pointer ml-1"
              onClick={() => setView("login")}
            >
              Login
            </span>
          </p>

        </form>
      )}

    </div>
  );
}
