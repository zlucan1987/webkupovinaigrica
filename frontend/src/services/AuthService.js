import { HttpService } from './HttpService';

class AuthService {
    // Store the token in localStorage
    setToken(token) {
        localStorage.setItem('jwtToken', token);
    }

    // Get the token from localStorage
    getToken() {
        return localStorage.getItem('jwtToken');
    }

    // Remove the token from localStorage
    removeToken() {
        localStorage.removeItem('jwtToken');
    }

    // Check if user is logged in
    isLoggedIn() {
        return !!this.getToken();
    }

    // Parse JWT token to get user info
    getUserInfo() {
        const token = this.getToken();
        if (!token) return null;
        
        try {
            // Get the payload part of the JWT token
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error parsing token:', error);
            return null;
        }
    }

    // Check if user has a specific role
    hasRole(role) {
        const userInfo = this.getUserInfo();
        if (!userInfo) return false;
        
        const userRoles = userInfo.roles || [];
        return userRoles.includes(role);
    }

    // Check if user has any of the specified roles
    hasAnyRole(roles) {
        const userInfo = this.getUserInfo();
        if (!userInfo) return false;
        
        const userRoles = userInfo.roles || [];
        return roles.some(role => userRoles.includes(role));
    }

    // Get user's name
    getUserName() {
        const userInfo = this.getUserInfo();
        if (!userInfo) return '';
        
        return userInfo.name || userInfo.sub || '';
    }

    // Login method
    async login(email, password) {
        try {
            const response = await HttpService.post('/Autentifikacija/Login', { email, password });
            const token = response.data;
            
            // Store the token with Bearer prefix
            this.setToken(token);
            
            // Update HttpService headers with the new token
            HttpService.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            return true;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    // Register method
    async register(userData) {
        try {
            const response = await HttpService.post('/Autentifikacija/Register', userData);
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    // Logout method
    logout() {
        this.removeToken();
        // Remove Authorization header
        delete HttpService.defaults.headers.common['Authorization'];
    }
}

export default new AuthService();
