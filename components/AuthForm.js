function AuthForm() {
  const [view, setView] = React.useState('login'); // login, register, forgot, otp
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = React.useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = React.useState(false);

  const getUsers = () => JSON.parse(localStorage.getItem('clubhub_users') || '[]');
  const saveUsers = (users) => localStorage.setItem('clubhub_users', JSON.stringify(users));

  // Auto-redirect if already logged in, otherwise initialize admin user
  React.useEffect(() => {
    if (localStorage.getItem('clubhub_user')) {
      window.location.href = 'dashboard.html';
      return;
    }
    const users = getUsers();
    if (users.length === 0) {
      users.push({
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@college.edu',
        password: 'admin',
        role: 'admin',
        avatar: ''
      });
      saveUsers(users);
    }
  }, []);

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const userCred = await firebase.auth().signInWithEmailAndPassword(email, password);

    localStorage.setItem("clubhub_user", JSON.stringify({
      email: userCred.user.email,
      uid: userCred.user.uid
    }));

    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
  }
};

const handleRegister = async (e) => {
  e.preventDefault();

  if (!window.firebase || !firebase.auth) {
    alert("Firebase not loaded yet");
    return;
  }

  try {
    const userCred = await firebase.auth().createUserWithEmailAndPassword(email, password);

    await firebase.firestore().collection("users").doc(userCred.user.uid).set({
      name,
      email
    });

    alert("Registered successfully!");

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setMsg({ type: '', text: '' });
    
    try {
      const users = getUsers();
      const userIndex = users.findIndex(u => u.email === email);
      
      if (userIndex > -1) {
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 5 * 60000).toISOString();
        
        users[userIndex].otp = generatedOtp;
        users[userIndex].otpExpiry = expiry;
        saveUsers(users);

        // Send email via EmailJS official browser SDK
        await window.emailjs.send(
          'service_75u0cda',
          'template_918c9mi',
          {
            to_email: email,
            otp_code: generatedOtp.toString()
          },
          'jSvCapoUwGLGWTJKh'
        );
        
        setMsg({ type: 'success', text: `OTP sent to ${email}. Please check your inbox.` });
        setTimeout(() => setView('otp'), 2000);
      } else {
        setMsg({ type: 'error', text: 'Email not found.' });
      }
    } catch (err) {
      console.error("OTP send error:", err);
      let errorDetail = String(err);
      if (err) {
        errorDetail = err.text || err.message || (typeof err === 'object' ? JSON.stringify(err, Object.getOwnPropertyNames(err)) : String(err));
      }
      setMsg({ type: 'error', text: `Failed to send OTP. Detail: ${errorDetail}` });
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || !password) return;
    setLoading(true);
    setMsg({ type: '', text: '' });
    
    setTimeout(() => {
      const users = getUsers();
      const userIndex = users.findIndex(u => u.email === email);
      
      if (userIndex > -1) {
        const user = users[userIndex];
        const isExpired = new Date(user.otpExpiry) < new Date();
        if (user.otp === otp && !isExpired) {
          users[userIndex].password = password;
          users[userIndex].otp = '';
          users[userIndex].otpExpiry = '';
          saveUsers(users);
          
          setMsg({ type: 'success', text: 'Password reset successful! You can now login.' });
          setTimeout(() => {
            setView('login');
            setPassword('');
            setOtp('');
          }, 2000);
        } else {
          setMsg({ type: 'error', text: 'Invalid or expired OTP.' });
        }
      }
      setLoading(false);
    }, 500);
  };

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <div data-name="auth-form" data-file="components/AuthForm.js" className="relative">
      <button 
        onClick={toggleTheme} 
        className="absolute -top-16 right-0 p-2 text-white/80 hover:text-white transition-colors"
        title="Toggle Theme"
      >
        <div className="icon-moon dark:hidden text-xl"></div>
        <div className="icon-sun hidden dark:block text-xl"></div>
      </button>

      {msg.text && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${msg.type === 'error' ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>
          {msg.text}
        </div>
      )}

      {view === 'login' && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input type="email" required className="input-field dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={email} onChange={e=>setEmail(e.target.value)} placeholder="student@college.edu" disabled={loading} />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <button type="button" onClick={() => {setView('forgot'); setMsg({type:'',text:''})}} className="text-sm text-primary hover:underline" disabled={loading}>Forgot Password?</button>
            </div>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} required className="input-field dark:bg-gray-800 dark:border-gray-700 dark:text-white pr-10" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" disabled={loading} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <div className={showPassword ? 'icon-eye-off' : 'icon-eye'}></div>
              </button>
            </div>
          </div>
          <button type="submit" className="btn-primary mt-6" disabled={loading}>
            {loading ? 'Logging in...' : 'Login to ClubHub'}
          </button>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            Don't have an account? <button type="button" onClick={() => {setView('register'); setMsg({type:'',text:''})}} className="text-primary font-medium" disabled={loading}>Register</button>
          </p>
        </form>
      )}

      {view === 'register' && (
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input type="text" required className="input-field dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={name} onChange={e=>setName(e.target.value)} placeholder="John Doe" disabled={loading} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input type="email" required className="input-field dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={email} onChange={e=>setEmail(e.target.value)} placeholder="student@college.edu" disabled={loading} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} required className="input-field dark:bg-gray-800 dark:border-gray-700 dark:text-white pr-10" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" disabled={loading} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <div className={showPassword ? 'icon-eye-off' : 'icon-eye'}></div>
              </button>
            </div>
          </div>
          <button type="submit" className="btn-primary mt-6" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            Already have an account? <button type="button" onClick={() => {setView('login'); setMsg({type:'',text:''})}} className="text-primary font-medium" disabled={loading}>Login</button>
          </p>
        </form>
      )}

      {view === 'forgot' && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Enter your email address and we'll send you a 6-digit OTP to reset your password.</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input type="email" required className="input-field dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={email} onChange={e=>setEmail(e.target.value)} placeholder="student@college.edu" disabled={loading} />
          </div>
          <button type="submit" className="btn-primary mt-6" disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
          <button type="button" onClick={() => {setView('login'); setMsg({type:'',text:''})}} className="w-full mt-3 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-300" disabled={loading}>Back to Login</button>
        </form>
      )}

      {view === 'otp' && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Enter the 6-digit OTP sent to {email} and your new password.</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">OTP Code</label>
            <input type="text" required maxLength="6" className="input-field text-center tracking-widest text-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={otp} onChange={e=>setOtp(e.target.value)} placeholder="123456" disabled={loading} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} required className="input-field dark:bg-gray-800 dark:border-gray-700 dark:text-white pr-10" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" disabled={loading} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <div className={showPassword ? 'icon-eye-off' : 'icon-eye'}></div>
              </button>
            </div>
          </div>
          <button type="submit" className="btn-primary mt-6" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
          <button type="button" onClick={() => {setView('forgot'); setMsg({type:'',text:''})}} className="w-full mt-3 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-300" disabled={loading}>Back</button>
        </form>
      )}
    </div>
  );
}
