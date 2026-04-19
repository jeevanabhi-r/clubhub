function AuthForm() {
  const [view, setView] = React.useState('login');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = React.useState({ type: '', text: '' });

  React.useEffect(() => {
    if (localStorage.getItem('clubhub_user')) {
      window.location.href = 'dashboard.html';
    }
  }, []);

  // 🔐 LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) return;

    setLoading(true);
    setMsg({ type: '', text: '' });

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
        setMsg({ type: 'error', text: 'Invalid email or password' });
      }

    } catch (err) {
      console.error(err);
      setMsg({ type: 'error', text: 'Login failed' });
    }

    setLoading(false);
  };

  // 📝 REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email || !password || !name) return;

    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      await window.addDoc(window.collection(window.db, "users"), {
        name,
        email,
        password,
        role: "student"
      });

      localStorage.setItem("clubhub_user", JSON.stringify({
        name,
        email,
        role: "student"
      }));

      setMsg({ type: 'success', text: 'Registration successful!' });

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1500);

    } catch (err) {
      console.error(err);
      setMsg({ type: 'error', text: 'Registration failed' });
    }

    setLoading(false);
  };

  return (
    <div className="space-y-4">

      {msg.text && (
        <div className={`p-3 rounded ${msg.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
          {msg.text}
        </div>
      )}

      {view === 'login' && (
        <form onSubmit={handleLogin} className="space-y-3">
          <input type="email" placeholder="Email" className="input-field"
            value={email} onChange={e => setEmail(e.target.value)} />

          <input type="password" placeholder="Password" className="input-field"
            value={password} onChange={e => setPassword(e.target.value)} />

          <button className="btn-primary">
            {loading ? "Logging in..." : "Login"}
          </button>

          <p>
            No account?
            <button type="button" onClick={() => setView('register')}>
              Register
            </button>
          </p>
        </form>
      )}

      {view === 'register' && (
        <form onSubmit={handleRegister} className="space-y-3">
          <input type="text" placeholder="Name" className="input-field"
            value={name} onChange={e => setName(e.target.value)} />

          <input type="email" placeholder="Email" className="input-field"
            value={email} onChange={e => setEmail(e.target.value)} />

          <input type="password" placeholder="Password" className="input-field"
            value={password} onChange={e => setPassword(e.target.value)} />

          <button className="btn-primary">
            {loading ? "Creating..." : "Register"}
          </button>

          <p>
            Already have account?
            <button type="button" onClick={() => setView('login')}>
              Login
            </button>
          </p>
        </form>
      )}
    </div>
  );
}
