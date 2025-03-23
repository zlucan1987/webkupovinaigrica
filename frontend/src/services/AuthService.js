import { HttpService } from './HttpService';
import { getUserProfilePicture, setUserProfilePicture } from '../utils/imageUtils';
import KupacService from './KupacService';
import logger from '../utils/logger';

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
            logger.error('Error parsing token:', error);
            return null;
        }
    }

    // Check if user has a specific role
    hasRole(role) {
        const userInfo = this.getUserInfo();
        if (!userInfo) return false;
        
        logger.debug('Checking role:', role);
        logger.debug('User info:', userInfo);
        
        // Check for role claim in different formats
        // 1. Check for 'role' claim (string or array)
        if (userInfo.role) {
            logger.debug('Found role claim:', userInfo.role);
            if (Array.isArray(userInfo.role)) {
                return userInfo.role.includes(role);
            } else if (typeof userInfo.role === 'string') {
                return userInfo.role === role;
            }
        }
        
        // 2. Check for 'roles' claim (array)
        if (userInfo.roles && Array.isArray(userInfo.roles)) {
            logger.debug('Found roles claim:', userInfo.roles);
            return userInfo.roles.includes(role);
        }
        
        // 3. Check for 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role' claim
        const msRoleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
        if (userInfo[msRoleClaim]) {
            logger.debug('Found MS role claim:', userInfo[msRoleClaim]);
            if (Array.isArray(userInfo[msRoleClaim])) {
                return userInfo[msRoleClaim].includes(role);
            } else if (typeof userInfo[msRoleClaim] === 'string') {
                return userInfo[msRoleClaim] === role;
            }
        }
        
        logger.debug('No matching role claims found');
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
    
    // Dohvati korisnikov nadimak
    getUserNickname() {
        const userId = this.getUserId();
        if (!userId) return '';
        
        // Dohvati nadimak iz localStorage
        const nickname = localStorage.getItem(`user_nickname_${userId}`);
        if (nickname) return nickname;
        
        // Ako nema nadimka, vrati ime ili korisničko ime
        const userInfo = this.getUserInfo();
        return userInfo?.nickname || this.getUserName();
    }
    
    // Postavi korisnikov nadimak
    setUserNickname(nickname) {
        const userId = this.getUserId();
        if (!userId) return false;
        
        // Provjeri je li nadimak zaključan
        if (this.isNicknameLocked() && !this.hasRole('Admin')) {
            logger.warn('Pokušaj promjene zaključanog nadimka od strane korisnika koji nije administrator');
            return false;
        }
        
        localStorage.setItem(`user_nickname_${userId}`, nickname);
        return true;
    }
    
    // Provjeri je li nadimak zaključan
    isNicknameLocked() {
        const userId = this.getUserId();
        if (!userId) return false;
        
        return localStorage.getItem(`nickname_locked_${userId}`) === 'true';
    }
    
    // Zaključaj/otključaj nadimak (samo za administratore)
    setNicknameLocked(locked) {
        const userId = this.getUserId();
        if (!userId) return false;
        
        // Samo administrator može zaključati/otključati nadimak
        if (!this.hasRole('Admin')) {
            logger.warn('Pokušaj zaključavanja/otključavanja nadimka od strane korisnika koji nije administrator');
            return false;
        }
        
        localStorage.setItem(`nickname_locked_${userId}`, locked.toString());
        return true;
    }
    
    // Get user's ID
    getUserId() {
        const userInfo = this.getUserInfo();
        if (!userInfo) return null;
        
        return userInfo.nameid || userInfo.sub || null;
    }
    
    // Get user's email
    getUserEmail() {
        const userInfo = this.getUserInfo();
        if (!userInfo) return '';
        
        return userInfo.email || userInfo.KorisnickoIme || '';
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
        
        try {
            logger.debug("AuthService.uploadProfilePicture: Uploading profile picture for user", userId);
            
            // Koristimo KupacService za upload slike
            const result = await KupacService.postaviSliku(userId, base64Image);
            
            if (!result.greska) {
                // Ako je upload uspješan, ažuriramo lokalnu sliku
                // Koristimo apsolutnu putanju do slike na serveru s timestampom za izbjegavanje cache-a
                const imageUrl = `https://www.brutallucko.online/slike/kupci/${userId}.png?t=${new Date().getTime()}`;
                logger.debug("AuthService.uploadProfilePicture: Setting profile picture URL to", imageUrl);
                
                // Spremamo URL u localStorage - ovo će također spremiti i u kupac_profile_pictures
                setUserProfilePicture(userId, imageUrl);
                
                // Provjeravamo je li slika stvarno dostupna - using window.Image to avoid conflict with React Bootstrap Image
                const img = new window.Image();
                img.onload = () => {
                    logger.debug("AuthService.uploadProfilePicture: Image loaded successfully");
                };
                img.onerror = () => {
                    logger.error("AuthService.uploadProfilePicture: Failed to load image from URL", imageUrl);
                };
                img.src = imageUrl;
                
                // Osvježavamo stranicu nakon 1 sekunde da bi se prikazala nova slika
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
                
                return { success: true, imageUrl };
            } else {
                logger.error("AuthService.uploadProfilePicture: Error from KupacService", result.poruka);
                return { success: false, error: result.poruka };
            }
        } catch (error) {
            logger.error("AuthService.uploadProfilePicture: Exception", error);
            return { success: false, error: 'Došlo je do greške prilikom uploada slike' };
        }
    }

    // Login method
    async login(email, password) {
        try {
            logger.debug('Login attempt with:', { KorisnickoIme: email, Password: '********' });
            
            const response = await HttpService.post('/Autentifikacija/Login', { 
                KorisnickoIme: email, 
                Password: password 
            });
            
            logger.debug('Login response:', response);
            
            const token = response.data;
            
            // Store the token with Bearer prefix
            this.setToken(token);
            
            // Update HttpService headers with the new token
            HttpService.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            return true;
        } catch (error) {
            logger.error('Login error:', error);
            logger.error('Error details:', {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                config: {
                    url: error.config?.url,
                    method: error.config?.method
                    // Intentionally omit data to avoid logging passwords
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
            
            // Log without password
            logger.debug('Register attempt with:', {
                KorisnickoIme: formattedUserData.KorisnickoIme,
                Ime: formattedUserData.Ime,
                Prezime: formattedUserData.Prezime,
                Lozinka: '********'
            });
            
            const response = await HttpService.post('/Autentifikacija/Register', formattedUserData);
            
            logger.debug('Register response:', response);
            
            return response.data;
        } catch (error) {
            logger.error('Registration error:', error);
            logger.error('Error details:', {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                config: {
                    url: error.config?.url,
                    method: error.config?.method
                    // Intentionally omit data to avoid logging passwords
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
