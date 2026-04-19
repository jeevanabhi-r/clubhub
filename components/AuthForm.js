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

    {msg.text && (
      <div className={`p-3 rounded ${msg.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
        {msg.text}
      </div>
    )}

    {view === 'login' && (
      <form onSubmit={handleLogin} className="space-y-4">

        {/* Email */}
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            placeholder="student@college.edu"
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <label>Password</label>
            <span className="text-orange-500 cursor-pointer">Forgot Password?</span>
          </div>

          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        {/* Button */}
        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg">
          {loading ? "Logging in..." : "Login to ClubHub"}
        </button>

        {/* Switch */}
        <p className="text-center text-gray-400">
          Don’t have an account?
          <button
            type="button"
            className="text-orange-500 ml-1"
            onClick={() => setView('register')}
          >
            Register
          </button>
        </p>

      </form>
    )}

    {/* REGISTER UI (keep simple or same style) */}
    {view === 'register' && (
      <form onSubmit={handleRegister} className="space-y-4">

        <input
          type="text"
          placeholder="Full Name"
          className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg">
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="text-center text-gray-400">
          Already have account?
          <button
            type="button"
            className="text-orange-500 ml-1"
            onClick={() => setView('login')}
          >
            Login
          </button>
        </p>

      </form>
    )}

  </div>
);
