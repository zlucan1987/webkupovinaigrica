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
    
    // Ako nema podudaranja, vraća nasumičnu sliku
    return getRandomGameImage();
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

export {
    profilePictures,
    gameImages,
    getRandomProfilePicture,
    getRandomGameImage,
    getGameImage,
    getRandomRating,
    hasDiscount,
    getDiscountPercentage
};
