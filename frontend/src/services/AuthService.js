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
            console.log('Login attempt with:', { KorisnickoIme: email, Password: password });
            
            const response = await HttpService.post('/Autentifikacija/Login', { 
                KorisnickoIme: email, 
                Password: password 
            });
            
            console.log('Login response:', response);
            
            const token = response.data;
            
            // Store the token with Bearer prefix
            this.setToken(token);
            
            // Update HttpService headers with the new token
            HttpService.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            return true;
        } catch (error) {
            console.error('Login error:', error);
            console.error('Error details:', {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    data: error.config?.data
                }
            });
            throw error;
        }
    }

    // Register method
    async register(userData) {
        try {
            // Ensure proper field names for backend
            const formattedUserData = {
                KorisnickoIme: userData.KorisnickoIme || userData.email,
                Lozinka: userData.Lozinka || userData.lozinka || userData.password,
                Ime: userData.Ime || userData.ime,
                Prezime: userData.Prezime || userData.prezime
            };
            
            console.log('Register attempt with:', formattedUserData);
            
            const response = await HttpService.post('/Autentifikacija/Register', formattedUserData);
            
            console.log('Register response:', response);
            
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            console.error('Error details:', {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    data: error.config?.data
                }
            });
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
