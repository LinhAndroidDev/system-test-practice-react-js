import AuthService from "../services/AuthService.js";

class AuthController {
  constructor() {
    this.authService = new AuthService();
    this.user = null;
    this.isAuthenticated = false;
    this.loading = false;
    this.error = null;
    this.callbacks = {};
    
    // Check if user is already logged in
    this.checkAuth();
  }

  // Register callbacks for UI updates
  onUpdate(callback) {
    this.callbacks.update = callback;
  }

  notifyUpdate() {
    if (this.callbacks.update) {
      this.callbacks.update({
        user: this.user,
        isAuthenticated: this.isAuthenticated,
        loading: this.loading,
        error: this.error,
      });
    }
  }

  // Check authentication status
  checkAuth() {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.user = this.authService.getCurrentUser();
    }
    this.notifyUpdate();
  }

  // Handle user registration
  async register(formData) {
    // Validate form
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      this.error = "Vui lòng điền đầy đủ thông tin";
      this.notifyUpdate();
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      this.error = "Mật khẩu không khớp";
      this.notifyUpdate();
      return false;
    }

    if (formData.password.length < 6) {
      this.error = "Mật khẩu phải có ít nhất 6 ký tự";
      this.notifyUpdate();
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      this.error = "Email không hợp lệ";
      this.notifyUpdate();
      return false;
    }

    this.loading = true;
    this.error = null;
    this.notifyUpdate();

    try {
      const response = await this.authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      this.loading = false;
      this.notifyUpdate();
      return true;
    } catch (error) {
      this.loading = false;
      this.error = error.message || "Đăng ký thất bại. Vui lòng thử lại.";
      this.notifyUpdate();
      return false;
    }
  }

  // Handle user login
  async login(formData) {
    // Validate form
    if (!formData.email || !formData.password) {
      this.error = "Vui lòng điền đầy đủ thông tin";
      this.notifyUpdate();
      return false;
    }

    this.loading = true;
    this.error = null;
    this.notifyUpdate();

    try {
      const response = await this.authService.login({
        email: formData.email,
        password: formData.password,
      });

      this.user = response.user;
      this.isAuthenticated = true;
      this.loading = false;
      this.notifyUpdate();
      return true;
    } catch (error) {
      this.loading = false;
      this.error = error.message || "Đăng nhập thất bại. Vui lòng thử lại.";
      this.notifyUpdate();
      return false;
    }
  }

  // Handle user logout
  logout() {
    this.authService.logout();
    this.user = null;
    this.isAuthenticated = false;
    this.notifyUpdate();
  }

  // Clear error
  clearError() {
    this.error = null;
    this.notifyUpdate();
  }
}

export default AuthController;

