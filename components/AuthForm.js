function AuthForm() {
  const [view, setView] = React.useState("login");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = React.useState({ type: "", text: "" });

  React.useEffect(() => {
    if (localStorage.getItem("clubhub_user")) {
      window.location.href = "dashboard.html";
    }
  }, []);

  // 🔐 LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setMsg({ type: "", text: "" });

    try {
      const snapshot = await window.getDocs(
        window.collection(window.db, "users")
      );

      let foundUser = null;

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.email === email && data.password === password) {
          foundUser = data;
        }
      });

      if (foundUser) {
        localStorage.setItem("clubhub_user", JSON.stringify(foundUser));
        window.location.href = "dashboard.html";
      } else {
        setMsg({ type: "error", text: "Invalid email or password" });
      }
    } catch (err) {
      console.error(err);
      setMsg({ type: "error", text: "Login failed" });
    }

    setLoading(false);
  };

  // 📝 REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !name) return;

    setLoading(true);
    setMsg({ type: "", text: "" });

    try {
      const snapshot = await window.getDocs(
        window.collection(window.db, "users")
      );

      let exists = false;
      snapshot.forEach((doc) => {
        if (doc.data().email === email) {
          exists = true;
        }
      });

      if (exists) {
        setMsg({ type: "error", text: "Email already exists" });
        setLoading(false);
        return;
      }

      await window.addDoc(window.collection(window.db, "users"), {
        name,
        email,
        password,
        role: "student",
      });

      setMsg({ type: "success", text: "Registration successful" });

      setTimeout(() => {
        setView("login");
      }, 1500);
    } catch (err) {
      console.error(err);
      setMsg({ type: "error", text: "Registration failed" });
    }

    setLoading(false);
  };

  return (
    <div className="space-y-4">
      {msg.text && (
        <div
          className={`p-3 rounded ${
            msg.type === "error"
              ? "bg-red-500 text-white"
              : "bg-green-500 text-white"
          }`}
        >
          {msg.text}
        </div>
      )}

      {view === "login" && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm">Email</label>
            <input
              type="email"
              placeholder="student@college.edu"
              className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg">
            {loading ? "Logging in..." : "Login to ClubHub"}
          </button>

          <p className="text-center text-gray-400">
            Don’t have an account?
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
            placeholder="Full Name"
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg">
            {loading ? "Creating..." : "Register"}
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
