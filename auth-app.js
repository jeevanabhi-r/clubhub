class ErrorBoundary extends React.Component {
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
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl overflow-hidden shadow-xl">

        {/* HEADER */}
        <div className="bg-orange-500 text-center p-6">
          <img 
            src="https://app.trickle.so/storage/public/images/usr_1df27d2b58000001/152dbf39-1d22-4364-af7d-3aa283498e1e.Untitled"
            className="h-16 mx-auto mb-2"
          />
          <h1 className="text-white text-2xl font-bold">ClubHub</h1>
          <p className="text-orange-100 text-sm">College Clubs & Events</p>
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
