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
  return <Dashboard />;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
