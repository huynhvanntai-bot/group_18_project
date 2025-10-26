// Frontend token management service - SV2
class TokenService {
  constructor() {
    this.accessTokenKey = 'accessToken';
    this.refreshTokenKey = 'refreshToken';
    this.userKey = 'user';
    this.refreshPromise = null;
  }

  // Lưu tokens vào localStorage
  saveTokens(accessToken, refreshToken, user = null) {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    if (user) {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
  }

  // Lấy access token
  getAccessToken() {
    return localStorage.getItem(this.accessTokenKey);
  }

  // Lấy refresh token
  getRefreshToken() {
    return localStorage.getItem(this.refreshTokenKey);
  }

  // Lấy user info
  getUser() {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  // Xóa tất cả tokens
  clearTokens() {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userKey);
  }

  // Kiểm tra có token không
  hasTokens() {
    return !!this.getAccessToken() && !!this.getRefreshToken();
  }

  // Refresh access token
  async refreshAccessToken() {
    // Nếu đang có request refresh, đợi nó hoàn thành
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('Không có refresh token');
    }

    this.refreshPromise = this._performRefresh(refreshToken);
    
    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.refreshPromise = null;
    }
  }

  async _performRefresh(refreshToken) {
    try {
      const response = await fetch('http://localhost:5000/api/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) {
        throw new Error('Refresh token thất bại');
      }

      const data = await response.json();
      
      // Lưu tokens mới
      this.saveTokens(data.accessToken, data.refreshToken, data.user);
      
      return data.accessToken;
    } catch (error) {
      // Refresh thất bại, xóa tokens và redirect login
      this.clearTokens();
      window.location.href = '/login';
      throw error;
    }
  }

  // Tạo headers với Authorization
  getAuthHeaders() {
    const token = this.getAccessToken();
    return token ? { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json; charset=utf-8'
    } : {
      'Content-Type': 'application/json; charset=utf-8'
    };
  }

  // Fetch với auto-refresh
  async authenticatedFetch(url, options = {}) {
    const headers = {
      ...this.getAuthHeaders(),
      ...options.headers
    };

    let response = await fetch(url, {
      ...options,
      headers
    });

    // Nếu access token hết hạn (401), thử refresh
    if (response.status === 401) {
      try {
        console.log('🔄 Access token hết hạn, đang refresh...');
        await this.refreshAccessToken();
        
        // Retry request với token mới
        const newHeaders = {
          ...this.getAuthHeaders(),
          ...options.headers
        };
        
        response = await fetch(url, {
          ...options,
          headers: newHeaders
        });
        
        console.log('✅ Refresh token thành công, request đã được thực hiện lại');
      } catch (error) {
        console.error('❌ Refresh token thất bại:', error);
        throw error;
      }
    }

    return response;
  }

  // Login method
  async login(email, password) {
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Đăng nhập thất bại');
      }

      const data = await response.json();
      
      // Lưu tokens
      this.saveTokens(data.accessToken, data.refreshToken, data.user);
      
      return data;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  }

  // Logout method
  async logout() {
    try {
      const refreshToken = this.getRefreshToken();
      
      if (refreshToken) {
        await fetch('http://localhost:5000/api/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: JSON.stringify({ refreshToken })
        });
      }
    } catch (error) {
      console.error('❌ Logout error:', error);
    } finally {
      this.clearTokens();
    }
  }
}

// Export singleton instance
const tokenService = new TokenService();
export default tokenService;