import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Chunk Load Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render any custom fallback UI
      return <h1>Something went wrong. Please refresh the page.</h1>;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;