const API_URL = "http://localhost:8080/api";

class AuthService {
  // Register new user
  async register(userData) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: 0, // Default role for normal users
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Đăng ký thất bại");
      }

      const data = await response.json();
      
      // Response format: { data: { userId: 2 }, message: "...", status: 200 }
      if (data.status === 200 && data.data) {
        return {
          success: true,
          userId: data.data.userId,
          message: data.message || "Đăng ký thành công!",
        };
      } else {
        throw new Error(data.message || "Đăng ký thất bại");
      }
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Đăng nhập thất bại");
      }

      const data = await response.json();
      
      // Response format: { data: { userId, username, role, auth: { accessToken } }, message, status }
      if (data.status === 200 && data.data && data.data.auth) {
        const { userId, username, role, auth } = data.data;
        
        // Save token to localStorage
        localStorage.setItem("authToken", auth.accessToken);
        
        // Save user data
        const userData = {
          id: userId,
          name: username,
          email: credentials.email,
          role: role,
        };
        localStorage.setItem("userData", JSON.stringify(userData));
        
        return {
          success: true,
          user: userData,
          token: auth.accessToken,
          message: data.message || "Đăng nhập thành công!",
        };
      } else {
        throw new Error(data.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  // Logout user
  logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem("authToken");
  }

  // Get current user data
  getCurrentUser() {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  }

  // Get auth token
  getToken() {
    return localStorage.getItem("authToken");
  }
}

export default AuthService;

