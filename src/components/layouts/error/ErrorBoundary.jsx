import Errors from "pages/errors";
import * as React from "react";
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true, error: info });
    // You can also log the error to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      return <Errors error={this.state.error} />;
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
