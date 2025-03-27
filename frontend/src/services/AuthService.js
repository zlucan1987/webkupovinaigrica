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
        if (!token) return {};
        
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
            
            const parsedPayload = JSON.parse(jsonPayload);
            logger.debug('Parsed JWT payload:', parsedPayload);
            
            return parsedPayload;
        } catch (error) {
            logger.error('Error parsing token:', error);
            return {};  // Return empty object instead of null to prevent errors
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
    
    // Dohvati detalje o korisniku
    async getUserDetails(userId = null) {
        try {
            // Ako nije proslijeđen ID, koristi ID trenutnog korisnika
            const id = userId || this.getUserId();
            if (!id) return null;
            
            logger.debug('Dohvaćanje detalja o korisniku:', id);
            
            const response = await HttpService.get(`/Autentifikacija/Users/${id}/Details`);
            logger.debug('Dohvaćeni detalji o korisniku:', response.data);
            
            return response.data;
        } catch (error) {
            logger.error('Error fetching user details:', error);
            return null;
        }
    }
    
    // Dohvati sve korisnike (samo za administratore)
    async getAllUsers() {
        try {
            if (!this.hasRole('Admin')) {
                logger.warn('Pokušaj dohvaćanja svih korisnika od strane korisnika koji nije administrator');
                return null;
            }
            
            logger.debug('Dohvaćanje svih korisnika');
            
            const response = await HttpService.get('/Autentifikacija/Users');
            logger.debug('Dohvaćeni svi korisnici:', response.data);
            
            return response.data;
        } catch (error) {
            logger.error('Error fetching all users:', error);
            return null;
        }
    }
    
    // Obriši korisnika (samo za administratore)
    async deleteUser(userId) {
        try {
            if (!this.hasRole('Admin')) {
                logger.warn('Pokušaj brisanja korisnika od strane korisnika koji nije administrator');
                return { success: false, error: 'Samo administrator može brisati korisnike' };
            }
            
            logger.debug('Brisanje korisnika:', userId);
            
            await HttpService.delete(`/Autentifikacija/Users/${userId}`);
            
            return { success: true };
        } catch (error) {
            logger.error('Error deleting user:', error);
            return { 
                success: false, 
                error: error.response?.data || 'Došlo je do greške prilikom brisanja korisnika' 
            };
        }
    }
    
    // Dohvati korisnikov nadimak
    getUserNickname() {
        const userId = this.getUserId();
        if (!userId) return '';
        
        // Prvo provjeri u localStorage kao brzi pristup
        const localNickname = localStorage.getItem(`user_nickname_${userId}`);
        if (localNickname) {
            logger.debug('Retrieved nickname from localStorage:', localNickname);
            return localNickname;
        }
        
        // Ako nema u localStorage, provjeri u JWT tokenu
        const userInfo = this.getUserInfo();
        if (userInfo && userInfo.nickname) {
            logger.debug('Retrieved nickname from JWT token:', userInfo.nickname);
            // Spremi u localStorage za buduće korištenje
            localStorage.setItem(`user_nickname_${userId}`, userInfo.nickname);
            return userInfo.nickname;
        }
        
        // Ako nema nadimka, vrati ime ili korisničko ime
        const fallbackName = this.getUserName();
        logger.debug('Using fallback name as nickname:', fallbackName);
        return fallbackName;
    }
    
    // Dohvati korisnikov nadimak s backenda (asinkrono)
    async fetchUserNicknameFromServer() {
        const userId = this.getUserId();
        if (!userId) return '';
        
        try {
            logger.debug('Fetching nickname from server for user:', userId);
            // Pokušaj dohvatiti nadimak s backenda
            const userDetails = await this.getUserDetails(userId);
            if (userDetails && userDetails.nickname) {
                logger.debug('Retrieved nickname from server:', userDetails.nickname);
                // Spremi u localStorage za buduće korištenje
                localStorage.setItem(`user_nickname_${userId}`, userDetails.nickname);
                return userDetails.nickname;
            }
        } catch (error) {
            logger.error('Error fetching nickname from server:', error);
        }
        
        // Ako nije uspjelo dohvatiti s backenda, vrati što već imamo
        return this.getUserNickname();
    }
    
    // Postavi korisnikov nadimak
    async setUserNickname(nickname) {
        const userId = this.getUserId();
        if (!userId) return { success: false, error: 'Korisnik nije prijavljen' };
        
        try {
            // Prvo pokušaj ažurirati nadimak na backendu
            await HttpService.put(`/Autentifikacija/Users/${userId}/Nickname`, {
                Nickname: nickname,
                Locked: false
            });
            
            // Ako je uspješno, ažuriraj i lokalno
            localStorage.setItem(`user_nickname_${userId}`, nickname);
            
            return { success: true };
        } catch (error) {
            logger.error('Error updating nickname on server:', error);
            
            // Ako backend nije dostupan, provjeri je li nadimak zaključan lokalno
            if (this.isNicknameLocked() && !this.hasRole('Admin')) {
                logger.warn('Pokušaj promjene zaključanog nadimka od strane korisnika koji nije administrator');
                return { success: false, error: 'Nadimak je zaključan i ne može se promijeniti' };
            }
            
            // Spremi lokalno kao fallback
            localStorage.setItem(`user_nickname_${userId}`, nickname);
            return { success: true, warning: 'Nadimak je spremljen samo lokalno jer server nije dostupan' };
        }
    }
    
    // Provjeri je li nadimak zaključan
    async isNicknameLocked() {
        const userId = this.getUserId();
        if (!userId) return false;
        
        try {
            // Prvo pokušaj dohvatiti status zaključanosti s backenda
            const userDetails = await this.getUserDetails(userId);
            if (userDetails && userDetails.nicknameLocked !== undefined) {
                return userDetails.nicknameLocked;
            }
        } catch (error) {
            logger.error('Error fetching nickname lock status from server:', error);
        }
        
        // Ako nije uspjelo dohvatiti s backenda, koristi localStorage kao fallback
        return localStorage.getItem(`nickname_locked_${userId}`) === 'true';
    }
    
    // Zaključaj/otključaj nadimak (samo za administratore)
    async setNicknameLocked(userId, locked) {
        if (!this.hasRole('Admin')) {
            logger.warn('Pokušaj zaključavanja/otključavanja nadimka od strane korisnika koji nije administrator');
            return { success: false, error: 'Samo administrator može zaključati/otključati nadimak' };
        }
        
        try {
            // Dohvati trenutni nadimak korisnika
            const userDetails = await this.getUserDetails(userId);
            const nickname = userDetails?.nickname || '';
            
            // Ažuriraj nadimak i status zaključanosti na backendu
            await HttpService.put(`/Autentifikacija/Users/${userId}/Nickname`, {
                Nickname: nickname,
                Locked: locked
            });
            
            // Ako je uspješno, ažuriraj i lokalno
            localStorage.setItem(`nickname_locked_${userId}`, locked.toString());
            
            return { success: true };
        } catch (error) {
            logger.error('Error updating nickname lock status on server:', error);
            
            // Spremi lokalno kao fallback
            localStorage.setItem(`nickname_locked_${userId}`, locked.toString());
            return { success: true, warning: 'Status zaključanosti je spremljen samo lokalno jer server nije dostupan' };
        }
    }
    
    // Ažuriraj korisničke podatke
    async updateUserProfile(userData) {
        const userId = this.getUserId();
        if (!userId) return { success: false, error: 'Korisnik nije prijavljen' };
        
        try {
            await HttpService.put(`/Autentifikacija/Users/${userId}`, userData);
            return { success: true };
        } catch (error) {
            logger.error('Error updating user profile:', error);
            return { success: false, error: error.response?.data || 'Došlo je do greške prilikom ažuriranja profila' };
        }
    }
    
    // Promijeni lozinku
    async changePassword(currentPassword, newPassword) {
        try {
            await HttpService.post('/Autentifikacija/ChangePassword', {
                TrenutnaLozinka: currentPassword,
                NovaLozinka: newPassword
            });
            return { success: true };
        } catch (error) {
            logger.error('Error changing password:', error);
            return { success: false, error: error.response?.data || 'Došlo je do greške prilikom promjene lozinke' };
        }
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
        
        // Prvo pokušaj dohvatiti email iz JWT tokena
        // JWT token može sadržavati email u različitim formatima ovisno o tome kako je generiran
        const email = userInfo.email || 
                     userInfo.Email || 
                     userInfo.KorisnickoIme || 
                     userInfo['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
                     '';
        
        logger.debug('Retrieved user email:', email);
        return email;
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
    logout(clearCartCallback = null) {
        this.removeToken();
        // Remove Authorization header
        delete HttpService.defaults.headers.common['Authorization'];
        
        // Clear cart if callback is provided
        if (typeof clearCartCallback === 'function') {
            clearCartCallback();
        }
    }
}

export default new AuthService();
