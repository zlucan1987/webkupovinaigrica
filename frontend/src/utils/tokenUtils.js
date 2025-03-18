import AuthService from '../services/AuthService';
import { HttpService } from '../services/HttpService';

/**
 * Manually set a JWT token for authentication
 * @param {string} token - The JWT token to set
 * @returns {object} - The decoded user info from the token
 */
export const setManualToken = (token) => {
    if (!token) {
        console.error('No token provided');
        return null;
    }

    try {
        // Store the token
        AuthService.setToken(token);
        
        // Set the token in the HTTP service headers
        HttpService.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Return the decoded user info
        return AuthService.getUserInfo();
    } catch (error) {
        console.error('Error setting token:', error);
        return null;
    }
};

/**
 * Check if a token is valid
 * @param {string} token - The JWT token to validate
 * @returns {boolean} - Whether the token is valid
 */
export const isTokenValid = (token) => {
    if (!token) return false;
    
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
        
        const payload = JSON.parse(jsonPayload);
        
        // Check if token is expired
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp > currentTime;
    } catch (error) {
        console.error('Error validating token:', error);
        return false;
    }
};
