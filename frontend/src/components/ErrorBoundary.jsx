import { Component } from "react";

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="text-center max-w-md">
            <h1 className="font-heading text-2xl uppercase text-secondary mb-2">
              Something went wrong
            </h1>
            <p className="text-muted-foreground text-sm mb-6">
              The page encountered an error. Try refreshing, or go back to the home page.
            </p>
            <button
              type="button"
              onClick={() => window.location.assign("/")}
              className="px-6 py-3 bg-primary text-primary-foreground font-heading uppercase text-sm tracking-wider hover:opacity-90"
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
