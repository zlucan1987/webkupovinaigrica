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

// Ključevi za localStorage
const USER_PROFILE_PICTURES_KEY = 'user_profile_pictures';
const KUPAC_PROFILE_PICTURES_KEY = 'kupac_profile_pictures';
const MISSING_IMAGES_CACHE_KEY = 'missing_profile_images';

// Dohvaća mapu profilnih slika korisnika iz localStorage
const getUserProfilePicturesMap = () => {
    const storedPictures = localStorage.getItem(USER_PROFILE_PICTURES_KEY);
    return storedPictures ? JSON.parse(storedPictures) : {};
};

// Dohvaća mapu profilnih slika kupaca iz localStorage
const getKupacProfilePicturesMap = () => {
    const storedPictures = localStorage.getItem(KUPAC_PROFILE_PICTURES_KEY);
    return storedPictures ? JSON.parse(storedPictures) : {};
};

// Dohvaća mapu slika koje ne postoje na serveru
const getMissingImagesMap = () => {
    const storedMissingImages = localStorage.getItem(MISSING_IMAGES_CACHE_KEY);
    return storedMissingImages ? JSON.parse(storedMissingImages) : {};
};

// Dodaje sliku u mapu slika koje ne postoje na serveru
const addToMissingImagesCache = (id) => {
    const missingImagesMap = getMissingImagesMap();
    missingImagesMap[id] = true;
    localStorage.setItem(MISSING_IMAGES_CACHE_KEY, JSON.stringify(missingImagesMap));
};

// Provjerava je li slika već poznata kao nepostojeća
const isImageKnownMissing = (id) => {
    const missingImagesMap = getMissingImagesMap();
    return !!missingImagesMap[id];
};

// Uklanja sliku iz mape slika koje ne postoje na serveru (koristi se kada se slika doda)
const removeFromMissingImagesCache = (id) => {
    const missingImagesMap = getMissingImagesMap();
    if (missingImagesMap[id]) {
        delete missingImagesMap[id];
        localStorage.setItem(MISSING_IMAGES_CACHE_KEY, JSON.stringify(missingImagesMap));
    }
};

// Dohvaća profilnu sliku za korisnika
const getUserProfilePicture = (userId) => {
    if (!userId) return DEFAULT_PROFILE_PICTURE;
    
    try {
        // Prvo provjeri u user_profile_pictures
        const userPicturesMap = getUserProfilePicturesMap();
        const savedUserPicture = userPicturesMap[userId];
        
        // Ako postoji slika u user_profile_pictures, koristi nju
        if (savedUserPicture) {
            // Ako je to lokalna slika, vrati je odmah
            if (savedUserPicture.startsWith('/ProfilePictures/')) {
                return savedUserPicture;
            }
            
            // Dodaj timestamp za izbjegavanje cache-a ako je to URL do slike na serveru
            if (savedUserPicture.includes('/slike/kupci/')) {
                const baseUrl = savedUserPicture.split('?')[0]; // Ukloni postojeći timestamp ako postoji
                return `${baseUrl}?t=${new Date().getTime()}`;
            }
            return savedUserPicture;
        }
        
        // Ako ne postoji slika u user_profile_pictures, provjeri u kupac_profile_pictures
        // Ovo je za slučaj kada je korisnik ujedno i kupac s istim ID-om
        const kupacPicturesMap = getKupacProfilePicturesMap();
        const savedKupacPicture = kupacPicturesMap[userId];
        
        // Ako postoji slika u kupac_profile_pictures, koristi nju i spremi je u user_profile_pictures
        if (savedKupacPicture) {
            // Ako je to lokalna slika, vrati je odmah
            if (savedKupacPicture.startsWith('/ProfilePictures/')) {
                // Spremi sliku u user_profile_pictures za buduće korištenje
                setUserProfilePicture(userId, savedKupacPicture);
                return savedKupacPicture;
            }
            
            // Dodaj timestamp za izbjegavanje cache-a ako je to URL do slike na serveru
            if (savedKupacPicture.includes('/slike/kupci/')) {
                const baseUrl = savedKupacPicture.split('?')[0]; // Ukloni postojeći timestamp ako postoji
                const imageUrl = `${baseUrl}?t=${new Date().getTime()}`;
                
                // Spremi sliku u user_profile_pictures za buduće korištenje
                setUserProfilePicture(userId, imageUrl);
                
                return imageUrl;
            }
            
            // Spremi sliku u user_profile_pictures za buduće korištenje
            setUserProfilePicture(userId, savedKupacPicture);
            
            return savedKupacPicture;
        }
        
        // Provjeri je li slika već poznata kao nepostojeća
        if (isImageKnownMissing(userId)) {
            // Postavi defaultnu sliku za korisnika
            setUserProfilePicture(userId, DEFAULT_PROFILE_PICTURE);
            return DEFAULT_PROFILE_PICTURE;
        }
        
        // Ako ne postoji slika ni u user_profile_pictures ni u kupac_profile_pictures,
        // i nije poznato da ne postoji na serveru, provjeri postoji li slika na serveru
        const serverImageUrl = `https://www.brutallucko.online/slike/kupci/${userId}.png?t=${new Date().getTime()}`;
        
        // Provjeri postoji li slika na serveru
        const img = new window.Image();
        img.onload = () => {
            // Slika postoji na serveru
            // Spremi URL u localStorage za buduće korištenje
            setUserProfilePicture(userId, serverImageUrl);
            // Ukloni iz cache-a nepostojećih slika ako je bila tamo
            removeFromMissingImagesCache(userId);
        };
        img.onerror = () => {
            // Slika ne postoji na serveru
            // Dodaj u cache nepostojećih slika
            addToMissingImagesCache(userId);
            // Postavi defaultnu sliku za korisnika
            setUserProfilePicture(userId, DEFAULT_PROFILE_PICTURE);
        };
        img.src = serverImageUrl;
        
        // Vrati default sliku dok se ne provjeri postoji li slika na serveru
        return DEFAULT_PROFILE_PICTURE;
    } catch (error) {
        console.error("Error getting user profile picture:", error);
        return DEFAULT_PROFILE_PICTURE;
    }
};

// Postavlja profilnu sliku za korisnika
const setUserProfilePicture = (userId, picturePath) => {
    if (!userId) return;
    
    try {
        // Ako postavljamo novu sliku, ukloni iz cache-a nepostojećih slika
        if (picturePath !== DEFAULT_PROFILE_PICTURE) {
            removeFromMissingImagesCache(userId);
        }
        
        const picturesMap = getUserProfilePicturesMap();
        picturesMap[userId] = picturePath;
        localStorage.setItem(USER_PROFILE_PICTURES_KEY, JSON.stringify(picturesMap));
        
        // Ako je korisnik ujedno i kupac, spremi sliku i u kupac_profile_pictures
        const kupacPicturesMap = getKupacProfilePicturesMap();
        kupacPicturesMap[userId] = picturePath;
        localStorage.setItem(KUPAC_PROFILE_PICTURES_KEY, JSON.stringify(kupacPicturesMap));
    } catch (error) {
        console.error("Error setting user profile picture:", error);
    }
};

// Dohvaća profilnu sliku za kupca
const getKupacProfilePicture = (kupacSifra) => {
    if (!kupacSifra) return DEFAULT_PROFILE_PICTURE;
    
    try {
        // Prvo provjeri u kupac_profile_pictures
        const kupacPicturesMap = getKupacProfilePicturesMap();
        const savedKupacPicture = kupacPicturesMap[kupacSifra];
        
        // Ako postoji slika u kupac_profile_pictures, koristi nju
        if (savedKupacPicture) {
            // Ako je to lokalna slika, vrati je odmah
            if (savedKupacPicture.startsWith('/ProfilePictures/')) {
                return savedKupacPicture;
            }
            
            // Dodaj timestamp za izbjegavanje cache-a ako je to URL do slike na serveru
            if (savedKupacPicture.includes('/slike/kupci/')) {
                const baseUrl = savedKupacPicture.split('?')[0]; // Ukloni postojeći timestamp ako postoji
                return `${baseUrl}?t=${new Date().getTime()}`;
            }
            return savedKupacPicture;
        }
        
        // Ako ne postoji slika u kupac_profile_pictures, provjeri u user_profile_pictures
        // Ovo je za slučaj kada je kupac ujedno i korisnik s istim ID-om
        const userPicturesMap = getUserProfilePicturesMap();
        const savedUserPicture = userPicturesMap[kupacSifra];
        
        // Ako postoji slika u user_profile_pictures, koristi nju i spremi je u kupac_profile_pictures
        if (savedUserPicture) {
            // Ako je to lokalna slika, vrati je odmah
            if (savedUserPicture.startsWith('/ProfilePictures/')) {
                // Spremi sliku u kupac_profile_pictures za buduće korištenje
                setKupacProfilePicture(kupacSifra, savedUserPicture);
                return savedUserPicture;
            }
            
            // Dodaj timestamp za izbjegavanje cache-a ako je to URL do slike na serveru
            if (savedUserPicture.includes('/slike/kupci/')) {
                const baseUrl = savedUserPicture.split('?')[0]; // Ukloni postojeći timestamp ako postoji
                const imageUrl = `${baseUrl}?t=${new Date().getTime()}`;
                
                // Spremi sliku u kupac_profile_pictures za buduće korištenje
                setKupacProfilePicture(kupacSifra, imageUrl);
                
                return imageUrl;
            }
            
            // Spremi sliku u kupac_profile_pictures za buduće korištenje
            setKupacProfilePicture(kupacSifra, savedUserPicture);
            
            return savedUserPicture;
        }
        
        // Provjeri je li slika već poznata kao nepostojeća
        if (isImageKnownMissing(kupacSifra)) {
            // Postavi defaultnu sliku za kupca
            setKupacProfilePicture(kupacSifra, DEFAULT_PROFILE_PICTURE);
            return DEFAULT_PROFILE_PICTURE;
        }
        
        // Ako ne postoji slika ni u kupac_profile_pictures ni u user_profile_pictures,
        // i nije poznato da ne postoji na serveru, provjeri postoji li slika na serveru
        const serverImageUrl = `https://www.brutallucko.online/slike/kupci/${kupacSifra}.png?t=${new Date().getTime()}`;
        
        // Provjeri postoji li slika na serveru
        const img = new window.Image();
        img.onload = () => {
            // Slika postoji na serveru
            // Spremi URL u localStorage za buduće korištenje
            setKupacProfilePicture(kupacSifra, serverImageUrl);
            // Ukloni iz cache-a nepostojećih slika ako je bila tamo
            removeFromMissingImagesCache(kupacSifra);
        };
        img.onerror = () => {
            // Slika ne postoji na serveru
            // Dodaj u cache nepostojećih slika
            addToMissingImagesCache(kupacSifra);
            // Postavi defaultnu sliku za kupca
            setKupacProfilePicture(kupacSifra, DEFAULT_PROFILE_PICTURE);
        };
        img.src = serverImageUrl;
        
        // Vrati default sliku dok se ne provjeri postoji li slika na serveru
        return DEFAULT_PROFILE_PICTURE;
    } catch (error) {
        console.error("Error getting kupac profile picture:", error);
        return DEFAULT_PROFILE_PICTURE;
    }
};

// Postavlja profilnu sliku za kupca
const setKupacProfilePicture = (kupacSifra, picturePath) => {
    if (!kupacSifra) return;
    
    try {
        // Ako postavljamo novu sliku, ukloni iz cache-a nepostojećih slika
        if (picturePath !== DEFAULT_PROFILE_PICTURE) {
            removeFromMissingImagesCache(kupacSifra);
        }
        
        const picturesMap = getKupacProfilePicturesMap();
        picturesMap[kupacSifra] = picturePath;
        localStorage.setItem(KUPAC_PROFILE_PICTURES_KEY, JSON.stringify(picturesMap));
        
        // Ako je kupac ujedno i korisnik, spremi sliku i u user_profile_pictures
        const userPicturesMap = getUserProfilePicturesMap();
        userPicturesMap[kupacSifra] = picturePath;
        localStorage.setItem(USER_PROFILE_PICTURES_KEY, JSON.stringify(userPicturesMap));
    } catch (error) {
        console.error("Error setting kupac profile picture:", error);
    }
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
    
    // Provjeri postoji li slika u localStorage cache-u
    const cacheKey = `img_cache_status_${productId}`;
    const cachedStatus = localStorage.getItem(cacheKey);
    
    // Ako znamo da slika postoji na serveru (iz cache-a)
    if (cachedStatus === 'exists') {
        console.log(`Slika za proizvod ID ${productId} pronađena u cache-u`);
        return serverImageUrl;
    }
    
    // Ako znamo da slika ne postoji na serveru (iz cache-a)
    if (cachedStatus === 'not_exists') {
        console.log(`Slika za proizvod ID ${productId} nije pronađena u cache-u, koristi se fallback`);
        return getGameImage(productName);
    }
    
    // Ako nemamo informaciju u cache-u, provjeri postoji li slika na serveru
    try {
        const exists = await checkImageExists(serverImageUrl);
        
        if (exists) {
            console.log(`Slika za proizvod ID ${productId} pronađena na serveru, sprema se u cache`);
            localStorage.setItem(cacheKey, 'exists');
            return serverImageUrl;
        } else {
            console.log(`Slika za proizvod ID ${productId} nije pronađena na serveru, koristi se fallback`);
            localStorage.setItem(cacheKey, 'not_exists');
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

// Konvertira File objekt u Base64 string
const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // Uklanjamo prefix "data:image/png;base64," iz Base64 stringa
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
        };
        reader.onerror = (error) => {
            reject(error);
        };
    });
};

// Dohvaća sliku proizvoda prema ID-u
const getProductImageById = (productId) => {
    // Vraćamo URL do slike na serveru s timestampom za izbjegavanje cache-a
    return `/slike/proizvodi/${productId}.png?t=${new Date().getTime()}`;
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
    DEFAULT_PROFILE_PICTURE
};
