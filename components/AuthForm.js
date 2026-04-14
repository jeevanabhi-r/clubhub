function AuthForm() {
  const [view, setView] = React.useState('login'); // login, register, forgot, otp
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = React.useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = React.useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setMsg({ type: '', text: '' });
    try {
      const res = await trickleListObjects('user', 100, true);
      const user = res.items.find(u => u.objectData.email === email && u.objectData.password === password);
      
      if (user) {
        localStorage.setItem('clubhub_user', JSON.stringify({ ...user.objectData, id: user.objectId }));
        window.location.href = 'dashboard.html';
      } else {
        setMsg({ type: 'error', text: 'Invalid email or password' });
      }
    } catch (err) {
      console.error(err);
      setMsg({ type: 'error', text: 'An error occurred during login.' });
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !name) return;
    setLoading(true);
    setMsg({ type: '', text: '' });
    try {
      const res = await trickleListObjects('user', 100, true);
      const existingUser = res.items.find(u => u.objectData.email === email);
      
      if (existingUser) {
        setMsg({ type: 'error', text: 'Email already registered.' });
      } else {
        await trickleCreateObject('user', {
          name,
          email,
          password,
          role: 'student',
          avatar: ''
        });
        setMsg({ type: 'success', text: 'Registration successful! Please login.' });
        setTimeout(() => setView('login'), 2000);
      }
    } catch (err) {
      console.error(err);
      setMsg({ type: 'error', text: 'Registration failed.' });
    }
    setLoading(false);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setMsg({ type: '', text: '' });
    try {
      const res = await trickleListObjects('user', 100, true);
      const user = res.items.find(u => u.objectData.email === email);
      
      if (user) {
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 5 * 60000).toISOString();
        
        await trickleUpdateObject('user', user.objectId, {
          ...user.objectData,
          otp: generatedOtp,
          otpExpiry: expiry
        });

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
    try {
      const res = await trickleListObjects('user', 100, true);
      const user = res.items.find(u => u.objectData.email === email);
      
      if (user) {
        const isExpired = new Date(user.objectData.otpExpiry) < new Date();
        if (user.objectData.otp === otp && !isExpired) {
          await trickleUpdateObject('user', user.objectId, {
            ...user.objectData,
            password: password,
            otp: '',
            otpExpiry: ''
          });
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
    } catch (err) {
      console.error(err);
      setMsg({ type: 'error', text: 'Failed to verify OTP.' });
    }
    setLoading(false);
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