Rclass ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-red-500 p-4">Something went wrong</div>;
    }
    return this.props.children;
  }
}

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">

      {/* CARD */}
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-orange-500 p-8 text-center relative">
          
          <img
            src="https://app.trickle.so/storage/public/images/usr_1df27d2b58000001/152dbf39-1d22-4364-af7d-3aa283498e1e.Untitled"
            className="h-16 mx-auto mb-4 bg-white p-2 rounded-lg"
          />

          <h1 className="text-2xl font-bold text-white">ClubHub</h1>
          <p className="text-orange-100">College Clubs & Events</p>

          {/* Theme icon (optional UI) */}
          <div className="absolute right-4 bottom-4 text-white text-xl cursor-pointer">
            ☀️
          </div>
        </div>

        {/* FORM */}
        <div className="p-6">
          <AuthForm />
        </div>

      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
