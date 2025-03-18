import { HttpService } from './HttpService';
import { getUserProfilePicture, setUserProfilePicture } from '../utils/imageUtils';
import KupacService from './KupacService';

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
        
        console.log('Checking role:', role);
        console.log('User info:', userInfo);
        
        // Check for role claim in different formats
        // 1. Check for 'role' claim (string or array)
        if (userInfo.role) {
            console.log('Found role claim:', userInfo.role);
            if (Array.isArray(userInfo.role)) {
                return userInfo.role.includes(role);
            } else if (typeof userInfo.role === 'string') {
                return userInfo.role === role;
            }
        }
        
        // 2. Check for 'roles' claim (array)
        if (userInfo.roles && Array.isArray(userInfo.roles)) {
            console.log('Found roles claim:', userInfo.roles);
            return userInfo.roles.includes(role);
        }
        
        // 3. Check for 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role' claim
        const msRoleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
        if (userInfo[msRoleClaim]) {
            console.log('Found MS role claim:', userInfo[msRoleClaim]);
            if (Array.isArray(userInfo[msRoleClaim])) {
                return userInfo[msRoleClaim].includes(role);
            } else if (typeof userInfo[msRoleClaim] === 'string') {
                return userInfo[msRoleClaim] === role;
            }
        }
        
        console.log('No matching role claims found');
        return false;
    }

    // Check if user has any of the specified roles
    hasAnyRole(roles) {
        if (!Array.isArray(roles) || roles.length === 0) return false;
        return roles.some(role => this.hasRole(role));
    }

    // Get user's name
    getUserName() {
        const userInfo = this.getUserInfo();
        if (!userInfo) return '';
        
        return userInfo.name || userInfo.sub || '';
    }
    
    // Get user's ID
    getUserId() {
        const userInfo = this.getUserInfo();
        if (!userInfo) return null;
        
        return userInfo.nameid || userInfo.sub || null;
    }
    
    // Get user's profile picture
    getUserProfilePicture() {
        const userId = this.getUserId();
        return getUserProfilePicture(userId);
    }
    
    // Update user's profile picture
    updateUserProfilePicture(picturePath) {
        const userId = this.getUserId();
        if (!userId) return false;
        
        setUserProfilePicture(userId, picturePath);
        return true;
    }
    
    // Upload user's profile picture
    async uploadProfilePicture(base64Image) {
        const userId = this.getUserId();
        if (!userId) return { success: false, error: 'Korisnik nije prijavljen' };
        
        // Koristimo KupacService za upload slike
        const result = await KupacService.postaviSliku(userId, base64Image);
        
        if (!result.greska) {
            // Ako je upload uspješan, ažuriramo lokalnu sliku
            // Koristimo apsolutnu putanju do slike na serveru
            const imageUrl = `https://www.brutallucko.online/slike/kupci/${userId}.png?t=${new Date().getTime()}`; // Dodajemo timestamp za izbjegavanje cache-a
            setUserProfilePicture(userId, imageUrl);
            return { success: true };
        } else {
            return { success: false, error: result.poruka };
        }
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
