function AuthForm() {
  const [view, setView] = React.useState('login');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [msg, setMsg] = React.useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('clubhub_user', JSON.stringify(user));
      window.location.href = 'dashboard.html';
    } else {
      setMsg("Invalid email or password");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.find(u => u.email === email)) {
      setMsg("User already exists");
      return;
    }

    const newUser = {
      name,
      email,
      password,
      role: 'student'
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    setMsg("Registered successfully! Login now");
    setView('login');
  };

  return (
    <div>
      <h2>{view === 'login' ? "Login" : "Register"}</h2>

      {msg && <p style={{color:'red'}}>{msg}</p>}

      {view === 'login' ? (
        <form onSubmit={handleLogin}>
          <input placeholder="Email" onChange={e=>setEmail(e.target.value)} />
          <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} />
          <button>Login</button>
          <p onClick={()=>setView('register')}>Register</p>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <input placeholder="Name" onChange={e=>setName(e.target.value)} />
          <input placeholder="Email" onChange={e=>setEmail(e.target.value)} />
          <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} />
          <button>Register</button>
          <p onClick={()=>setView('login')}>Login</p>
        </form>
      )}
    </div>
  );
}
