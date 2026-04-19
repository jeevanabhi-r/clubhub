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
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-orange-500 p-8 text-center">
          <h1 className="text-2xl font-bold text-white">ClubHub</h1>
          <p className="text-orange-100">College Clubs & Events</p>
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
