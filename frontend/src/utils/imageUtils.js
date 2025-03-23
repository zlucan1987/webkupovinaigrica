// Putanje do profilnih slika kupaca
const profilePictures = [
    '/ProfilePictures/preview.webp',
    '/ProfilePictures/preview1.webp',
    '/ProfilePictures/preview2.webp',
    '/ProfilePictures/preview3.webp',
    '/ProfilePictures/preview4.webp',
    '/ProfilePictures/preview5.webp',
    '/ProfilePictures/preview6.webp',
    '/ProfilePictures/preview7.webp',
    '/ProfilePictures/preview8.webp',
    '/ProfilePictures/preview9.webp',
    '/ProfilePictures/preview10.webp',
    '/ProfilePictures/preview11.webp',
    '/ProfilePictures/preview12.webp',
    '/ProfilePictures/preview13.webp',
    '/ProfilePictures/preview14.webp'
];

// Default profilna slika za nove korisnike
const DEFAULT_PROFILE_PICTURE = '/ProfilePictures/preview.webp';

// Ključevi za localStorage - konsolidirani pristup
const IMAGE_CACHE_KEY = 'image_cache_v1';
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 sata u milisekundama

/**
 * Struktura image_cache_v1:
 * {
 *   profiles: {
 *     [id]: { path: string, timestamp: number, exists: boolean }
 *   },
 *   products: {
 *     [id]: { path: string, timestamp: number, exists: boolean }
 *   },
 *   lastCleanup: number
 * }
 */

// Dohvaća cijeli cache slika
const getImageCache = () => {
    const cache = localStorage.getItem(IMAGE_CACHE_KEY);
    if (!cache) {
        // Inicijalizacija cache-a ako ne postoji
        const initialCache = {
            profiles: {},
            products: {},
            lastCleanup: Date.now()
        };
        localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(initialCache));
        return initialCache;
    }
    return JSON.parse(cache);
};

// Sprema cijeli cache slika
const saveImageCache = (cache) => {
    localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(cache));
};

// Čisti zastarjele zapise u cache-u
const cleanupImageCache = () => {
    const cache = getImageCache();
    const now = Date.now();
    
    // Čistimo cache samo jednom dnevno
    if (now - cache.lastCleanup < CACHE_EXPIRY_TIME) {
        return cache;
    }
    
    const cleanupCache = (section) => {
        Object.keys(cache[section]).forEach(id => {
            const entry = cache[section][id];
            if (now - entry.timestamp > CACHE_EXPIRY_TIME) {
                delete cache[section][id];
            }
        });
    };
    
    cleanupCache('profiles');
    cleanupCache('products');
    cache.lastCleanup = now;
    
    saveImageCache(cache);
    return cache;
};

// Dohvaća informacije o slici profila iz cache-a
const getProfileImageFromCache = (id) => {
    const cache = cleanupImageCache();
    return cache.profiles[id];
};

// Sprema informacije o slici profila u cache
const saveProfileImageToCache = (id, path, exists = true) => {
    const cache = getImageCache();
    cache.profiles[id] = {
        path,
        timestamp: Date.now(),
        exists
    };
    saveImageCache(cache);
};

// Dohvaća informacije o slici proizvoda iz cache-a
const getProductImageFromCache = (id) => {
    const cache = cleanupImageCache();
    return cache.products[id];
};

// Sprema informacije o slici proizvoda u cache
const saveProductImageToCache = (id, path, exists = true) => {
    const cache = getImageCache();
    cache.products[id] = {
        path,
        timestamp: Date.now(),
        exists
    };
    saveImageCache(cache);
};

// Označava sliku kao nepostojeću u cache-u
const markImageAsMissing = (type, id) => {
    const cache = getImageCache();
    if (type === 'profile') {
        cache.profiles[id] = {
            path: DEFAULT_PROFILE_PICTURE,
            timestamp: Date.now(),
            exists: false
        };
    } else if (type === 'product') {
        cache.products[id] = {
            path: null, // Null će signalizirati da treba koristiti fallback
            timestamp: Date.now(),
            exists: false
        };
    }
    saveImageCache(cache);
};

// Uklanja sliku iz cache-a (koristi se kada se slika doda ili ažurira)
const removeFromImageCache = (type, id) => {
    const cache = getImageCache();
    if (type === 'profile' && cache.profiles[id]) {
        delete cache.profiles[id];
    } else if (type === 'product' && cache.products[id]) {
        delete cache.products[id];
    }
    saveImageCache(cache);
};

// Migracija starih podataka u novi cache sustav (jednokratno)
const migrateOldCacheData = () => {
    // Provjeri je li migracija već obavljena
    if (localStorage.getItem('cache_migration_done')) {
        return;
    }
    
    try {
        // Migriraj profile slike
        const oldUserPictures = localStorage.getItem('user_profile_pictures');
        const oldKupacPictures = localStorage.getItem('kupac_profile_pictures');
        const oldMissingImages = localStorage.getItem('missing_profile_images');
        
        if (oldUserPictures) {
            const userPictures = JSON.parse(oldUserPictures);
            Object.keys(userPictures).forEach(id => {
                saveProfileImageToCache(id, userPictures[id], true);
            });
        }
        
        if (oldKupacPictures) {
            const kupacPictures = JSON.parse(oldKupacPictures);
            Object.keys(kupacPictures).forEach(id => {
                saveProfileImageToCache(id, kupacPictures[id], true);
            });
        }
        
        if (oldMissingImages) {
            const missingImages = JSON.parse(oldMissingImages);
            Object.keys(missingImages).forEach(id => {
                if (missingImages[id]) {
                    markImageAsMissing('profile', id);
                }
            });
        }
        
        // Migriraj cache statuse proizvoda
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('img_cache_status_')) {
                const productId = key.replace('img_cache_status_', '');
                const status = localStorage.getItem(key);
                
                if (status === 'exists') {
                    const path = `/slike/proizvodi/${productId}.png`;
                    saveProductImageToCache(productId, path, true);
                } else if (status === 'not_exists') {
                    markImageAsMissing('product', productId);
                }
            }
        });
        
        // Označi migraciju kao završenu
        localStorage.setItem('cache_migration_done', 'true');
        
        // Obriši stare ključeve nakon uspješne migracije
        localStorage.removeItem('user_profile_pictures');
        localStorage.removeItem('kupac_profile_pictures');
        localStorage.removeItem('missing_profile_images');
        
        // Obriši stare cache statuse proizvoda
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('img_cache_status_')) {
                localStorage.removeItem(key);
            }
        });
        
        console.log('Migracija cache podataka uspješno završena');
    } catch (error) {
        console.error('Greška prilikom migracije cache podataka:', error);
    }
};

// Pokreni migraciju pri učitavanju
migrateOldCacheData();

// Dohvaća profilnu sliku za korisnika
const getUserProfilePicture = (userId) => {
    if (!userId) return DEFAULT_PROFILE_PICTURE;
    
    try {
        // Provjeri u konsolidiranom cache-u
        const cachedImage = getProfileImageFromCache(userId);
        
        if (cachedImage) {
            // Ako je slika označena kao nepostojeća, vrati default
            if (!cachedImage.exists) {
                return DEFAULT_PROFILE_PICTURE;
            }
            
            // Ako je to lokalna slika, vrati je odmah
            if (cachedImage.path.startsWith('/ProfilePictures/')) {
                return cachedImage.path;
            }
            
            // Dodaj timestamp za izbjegavanje cache-a ako je to URL do slike na serveru
            if (cachedImage.path.includes('/slike/kupci/')) {
                const baseUrl = cachedImage.path.split('?')[0]; // Ukloni postojeći timestamp ako postoji
                return `${baseUrl}?t=${new Date().getTime()}`;
            }
            
            return cachedImage.path;
        }
        
        // Ako ne postoji u cache-u, provjeri postoji li slika na serveru
        const serverImageUrl = `https://www.brutallucko.online/slike/kupci/${userId}.png?t=${new Date().getTime()}`;
        
        // Provjeri postoji li slika na serveru
        const img = new window.Image();
        img.onload = () => {
            // Slika postoji na serveru
            // Spremi URL u cache za buduće korištenje
            saveProfileImageToCache(userId, serverImageUrl, true);
        };
        img.onerror = () => {
            // Slika ne postoji na serveru
            // Označi kao nepostojeću u cache-u
            markImageAsMissing('profile', userId);
        };
        img.src = serverImageUrl;
        
        // Vrati default sliku dok se ne provjeri postoji li slika na serveru
        return DEFAULT_PROFILE_PICTURE;
    } catch (error) {
        console.error("Greška prilikom dohvaćanja profilne slike korisnika:", error);
        return DEFAULT_PROFILE_PICTURE;
    }
};

// Postavlja profilnu sliku za korisnika
const setUserProfilePicture = (userId, picturePath) => {
    if (!userId) return;
    
    try {
        // Spremi u konsolidirani cache
        saveProfileImageToCache(userId, picturePath, picturePath !== DEFAULT_PROFILE_PICTURE);
    } catch (error) {
        console.error("Greška prilikom postavljanja profilne slike korisnika:", error);
    }
};

// Dohvaća profilnu sliku za kupca (sada koristi isti cache kao i korisnici)
const getKupacProfilePicture = (kupacSifra) => {
    // Koristimo istu funkciju kao i za korisnike jer sada imamo konsolidirani cache
    return getUserProfilePicture(kupacSifra);
};

// Postavlja profilnu sliku za kupca (sada koristi isti cache kao i korisnici)
const setKupacProfilePicture = (kupacSifra, picturePath) => {
    // Koristimo istu funkciju kao i za korisnike jer sada imamo konsolidirani cache
    setUserProfilePicture(kupacSifra, picturePath);
};

// Putanje do slika igrica
const gameImages = [
    '/GamesPictures/Apex Legends.jpg',
    '/GamesPictures/Call of Duty Modern Warfare III.jpg',
    '/GamesPictures/Counter Strike 2.jpg',
    '/GamesPictures/Cyberpunk 2077.jpg',
    '/GamesPictures/Dota 2.jpg',
    '/GamesPictures/EA Sports FC 24.jpg',
    '/GamesPictures/Final Fantasy XVI.jpg',
    '/GamesPictures/Fortnite.jpg',
    '/GamesPictures/Forza Horizon 5.jpg',
    '/GamesPictures/Grand Theft Auto V.jpg',
    '/GamesPictures/League of legends.jpg',
    '/GamesPictures/Minecraft.jpg',
    '/GamesPictures/Overwatch 2.jpg',
    '/GamesPictures/PUBG Battlegrounds.jpg',
    '/GamesPictures/The Legend of Zelda Tears of the Kingdom.jpg',
    '/GamesPictures/The Legend.jpg',
    '/GamesPictures/Valorant.jpg'
];

// Dohvaća nasumičnu profilnu sliku za kupca
const getRandomProfilePicture = () => {
    const randomIndex = Math.floor(Math.random() * profilePictures.length);
    return profilePictures[randomIndex];
};

// Dohvaća nasumičnu sliku igrice
const getRandomGameImage = () => {
    const randomIndex = Math.floor(Math.random() * gameImages.length);
    return gameImages[randomIndex];
};

// Putanja do placeholder slike kada nema odgovarajuće slike za igricu
const noImagePlaceholder = '/GamesPictures/no-image.svg';

// Dohvaća odgovarajuću sliku za igricu prema nazivu
const getGameImage = (gameName) => {
    // Prvo traži točno podudaranje
    const exactMatch = gameImages.find(path => {
        const fileName = path.split('/').pop().replace('.jpg', '');
        return fileName.toLowerCase() === gameName.toLowerCase();
    });
    
    if (exactMatch) {
        return exactMatch;
    }
    
    // Ako nema točnog podudaranja, traži djelomično podudaranje
    const partialMatch = gameImages.find(path => {
        const fileName = path.split('/').pop().replace('.jpg', '');
        return gameName.toLowerCase().includes(fileName.toLowerCase()) || 
               fileName.toLowerCase().includes(gameName.toLowerCase());
    });
    
    if (partialMatch) {
        return partialMatch;
    }
    
    // Ako nema podudaranja, vraća placeholder sliku "nema slike"
    return noImagePlaceholder;
};

// Provjeri postoji li slika na serveru
const checkImageExists = (url) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
};

// Napredna funkcija za dohvaćanje slike proizvoda s boljim upravljanjem cache-om
const getProductImageWithFallback = async (productId, productName) => {
    // Generiraj URL s timestampom za izbjegavanje cache-a
    const timestamp = new Date().getTime();
    const serverImageUrl = `/slike/proizvodi/${productId}.png?t=${timestamp}`;
    
    // Provjeri postoji li slika u konsolidiranom cache-u
    const cachedImage = getProductImageFromCache(productId);
    
    // Ako imamo informaciju u cache-u
    if (cachedImage) {
        // Ako znamo da slika postoji
        if (cachedImage.exists) {
            console.log(`Slika za proizvod ID ${productId} pronađena u cache-u`);
            return cachedImage.path;
        } 
        // Ako znamo da slika ne postoji
        else {
            console.log(`Slika za proizvod ID ${productId} nije pronađena u cache-u, koristi se fallback`);
            return getGameImage(productName);
        }
    }
    
    // Ako nemamo informaciju u cache-u, provjeri postoji li slika na serveru
    try {
        const exists = await checkImageExists(serverImageUrl);
        
        if (exists) {
            console.log(`Slika za proizvod ID ${productId} pronađena na serveru, sprema se u cache`);
            saveProductImageToCache(productId, serverImageUrl, true);
            return serverImageUrl;
        } else {
            console.log(`Slika za proizvod ID ${productId} nije pronađena na serveru, koristi se fallback`);
            markImageAsMissing('product', productId);
            return getGameImage(productName);
        }
    } catch (error) {
        console.error('Greška prilikom provjere slike:', error);
        return getGameImage(productName);
    }
};

// Generira nasumičnu ocjenu za igricu (1-5)
const getRandomRating = () => {
    return (Math.floor(Math.random() * 5) + 1);
};

// Određuje hoće li igrica imati popust
const hasDiscount = () => {
    return Math.random() > 0.7;
};

// Generira nasumični postotak popusta (10-60%)
const getDiscountPercentage = () => {
    return Math.floor(Math.random() * 50) + 10;
};

// Funkcija za konverziju u base64 je zamijenjena poboljšanom verzijom ispod

// Dohvaća sliku proizvoda prema ID-u
const getProductImageById = (productId) => {
    // Provjeri postoji li slika u cache-u
    const cachedImage = getProductImageFromCache(productId);
    
    // Ako imamo informaciju u cache-u i slika postoji
    if (cachedImage && cachedImage.exists) {
        // Vraćamo URL do slike na serveru s timestampom za izbjegavanje cache-a
        return `${cachedImage.path.split('?')[0]}?t=${new Date().getTime()}`;
    }
    
    // Ako nemamo informaciju ili slika ne postoji, vraćamo standardni URL
    return `/slike/proizvodi/${productId}.png?t=${new Date().getTime()}`;
};

// Kompresira sliku prije konverzije u base64
const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
    return new Promise((resolve, reject) => {
        // Ako datoteka nije slika, vrati je bez kompresije
        if (!file.type.startsWith('image/')) {
            resolve(file);
            return;
        }
        
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            
            img.onload = () => {
                // Izračunaj nove dimenzije slike
                let width = img.width;
                let height = img.height;
                
                if (width > maxWidth) {
                    height = Math.round(height * (maxWidth / width));
                    width = maxWidth;
                }
                
                if (height > maxHeight) {
                    width = Math.round(width * (maxHeight / height));
                    height = maxHeight;
                }
                
                // Kreiraj canvas za kompresiju
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                
                // Nacrtaj sliku na canvas
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Konvertiraj canvas u blob
                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Canvas je prazan'));
                        return;
                    }
                    
                    // Kreiraj novu datoteku iz blob-a
                    const compressedFile = new File([blob], file.name, {
                        type: 'image/jpeg', // Uvijek koristimo JPEG za bolju kompresiju
                        lastModified: Date.now()
                    });
                    
                    console.log(`Slika kompresirana: ${file.size} -> ${compressedFile.size} (${Math.round(compressedFile.size / file.size * 100)}%)`);
                    
                    resolve(compressedFile);
                }, 'image/jpeg', quality);
            };
            
            img.onerror = (error) => {
                reject(error);
            };
        };
        
        reader.onerror = (error) => {
            reject(error);
        };
    });
};

// Poboljšana funkcija za konverziju u base64 s kompresijom
const convertToBase64 = async (file) => {
    try {
        // Prvo kompresiramo sliku
        const compressedFile = await compressImage(file);
        
        // Zatim je konvertiramo u base64
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(compressedFile);
            reader.onload = () => {
                // Uklanjamo prefix "data:image/jpeg;base64," iz Base64 stringa
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    } catch (error) {
        console.error('Greška prilikom kompresije slike:', error);
        
        // Ako kompresija ne uspije, koristi originalnu sliku
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    }
};

// Osvježava sliku proizvoda u cache-u (koristi se nakon uploada nove slike)
const refreshProductImage = (productId) => {
    // Ukloni sliku iz cache-a da bi se ponovno dohvatila sa servera
    removeFromImageCache('product', productId);
    console.log(`Cache za sliku proizvoda ID ${productId} osvježen`);
};

export {
    profilePictures,
    gameImages,
    getRandomProfilePicture,
    getRandomGameImage,
    getGameImage,
    getRandomRating,
    hasDiscount,
    getDiscountPercentage,
    getUserProfilePicture,
    setUserProfilePicture,
    getKupacProfilePicture,
    setKupacProfilePicture,
    convertToBase64,
    getProductImageById,
    checkImageExists,
    getProductImageWithFallback,
    DEFAULT_PROFILE_PICTURE,
    refreshProductImage,
    compressImage
};
