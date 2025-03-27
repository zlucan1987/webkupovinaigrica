import AuthService from '../services/AuthService';
import logger from './logger';

/**
 * Migrates user data from localStorage to the server
 * @returns {Promise<{success: boolean, message: string}>} Result of the migration
 */
export const migrateUserDataToServer = async () => {
    try {
        // Check if user is logged in
        if (!AuthService.isLoggedIn()) {
            return { success: false, message: 'Korisnik nije prijavljen. Prijavite se za migraciju podataka.' };
        }

        const userId = AuthService.getUserId();
        if (!userId) {
            return { success: false, message: 'Nije moguće dohvatiti ID korisnika.' };
        }

        logger.info(`Započinjem migraciju podataka za korisnika ${userId}`);

        // Get data from localStorage
        const nickname = localStorage.getItem(`user_nickname_${userId}`);
        const isNicknameLocked = localStorage.getItem(`nickname_locked_${userId}`) === 'true';

        // If there's no data to migrate, return success
        if (!nickname) {
            return { success: true, message: 'Nema podataka za migraciju.' };
        }

        // Send data to server
        try {
            // Update nickname on server
            await AuthService.setUserNickname(nickname);
            
            // If user is admin, update nickname lock status
            if (AuthService.hasRole('Admin')) {
                await AuthService.setNicknameLocked(userId, isNicknameLocked);
            }
            
            // Remove data from localStorage after successful migration
            localStorage.removeItem(`user_nickname_${userId}`);
            localStorage.removeItem(`nickname_locked_${userId}`);
            
            return { 
                success: true, 
                message: 'Podaci uspješno migrirani na server.' 
            };
        } catch (error) {
            logger.error('Greška prilikom migracije podataka na server:', error);
            return { 
                success: false, 
                message: 'Greška prilikom migracije podataka na server. Podaci su zadržani lokalno.' 
            };
        }
    } catch (error) {
        logger.error('Greška prilikom migracije podataka:', error);
        return { success: false, message: 'Greška prilikom migracije podataka.' };
    }
};

/**
 * Migrates all users' data from localStorage to the server (admin only)
 * @returns {Promise<{success: boolean, message: string, results: Array}>} Result of the migration
 */
export const migrateAllUsersDataToServer = async () => {
    try {
        // Check if user is admin
        if (!AuthService.hasRole('Admin')) {
            return { 
                success: false, 
                message: 'Samo administrator može migrirati podatke svih korisnika.' 
            };
        }

        logger.info('Započinjem migraciju podataka za sve korisnike');

        // Get all users
        const users = await AuthService.getAllUsers();
        if (!users || users.length === 0) {
            return { success: false, message: 'Nije moguće dohvatiti korisnike.' };
        }

        // Migrate data for each user
        const results = [];
        for (const user of users) {
            const userId = user.id;
            
            // Get data from localStorage
            const nickname = localStorage.getItem(`user_nickname_${userId}`);
            const isNicknameLocked = localStorage.getItem(`nickname_locked_${userId}`) === 'true';
            
            // If there's no data to migrate, skip this user
            if (!nickname) {
                results.push({ userId, success: true, message: 'Nema podataka za migraciju.' });
                continue;
            }
            
            try {
                // Update nickname on server
                await AuthService.setNicknameLocked(userId, isNicknameLocked);
                
                // Remove data from localStorage after successful migration
                localStorage.removeItem(`user_nickname_${userId}`);
                localStorage.removeItem(`nickname_locked_${userId}`);
                
                results.push({ 
                    userId, 
                    success: true, 
                    message: 'Podaci uspješno migrirani na server.' 
                });
            } catch (error) {
                logger.error(`Greška prilikom migracije podataka za korisnika ${userId}:`, error);
                results.push({ 
                    userId, 
                    success: false, 
                    message: 'Greška prilikom migracije podataka na server. Podaci su zadržani lokalno.' 
                });
            }
        }
        
        const successCount = results.filter(r => r.success).length;
        return { 
            success: successCount > 0, 
            message: `Migracija završena. Uspješno migrirano ${successCount} od ${results.length} korisnika.`,
            results
        };
    } catch (error) {
        logger.error('Greška prilikom migracije podataka svih korisnika:', error);
        return { 
            success: false, 
            message: 'Greška prilikom migracije podataka svih korisnika.',
            results: []
        };
    }
};

export default {
    migrateUserDataToServer,
    migrateAllUsersDataToServer
};
