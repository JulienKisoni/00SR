import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
  }

  render() {
    // @ts-ignore
    if (this.state.hasError && this.props.fallback) {
      // You can render any custom fallback UI
      // @ts-ignore
      return this.props.fallback;
    }
    // @ts-ignore
    return this.props.children;
  }
}

export default ErrorBoundary;
