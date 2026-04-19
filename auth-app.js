class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack); }
  render() {
    if (this.state.hasError) return <div className="p-4 text-red-500">Something went wrong.</div>;
    return this.props.children;
  }
}

function App() {
  try {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 dark:bg-black transition-colors" data-name="app" data-file="auth-app.js">
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 dark:border dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden transition-colors">
          <div className="bg-primary p-6 sm:p-8 text-center">
            <div className="flex justify-center mb-4">
              <img src="https://app.trickle.so/storage/public/images/usr_1df27d2b58000001/152dbf39-1d22-4364-af7d-3aa283498e1e.Untitled" alt="ClubHub Logo" className="h-16 w-auto object-contain rounded-xl bg-white p-1" />
            </div>
            <h1 className="text-2xl font-bold text-white">ClubHub</h1>
            <p className="text-orange-100 mt-1">College Clubs & Events</p>
          </div>
          <div className="p-6">
            <AuthForm />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);