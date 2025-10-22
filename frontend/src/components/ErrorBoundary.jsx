import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    console.error('ErrorBoundary caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, background: '#fff1f0', color: '#610000', minHeight: '100vh' }}>
          <h1 style={{ marginTop: 0 }}>Ứng dụng gặp lỗi</h1>
          <p>Có lỗi xảy ra trong quá trình render. Nội dung lỗi được hiển thị bên dưới.</p>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#fff', padding: 12, borderRadius: 6 }}>
            {String(this.state.error && this.state.error.toString())}
            {this.state.info && this.state.info.componentStack}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
