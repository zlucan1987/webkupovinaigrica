export const RouteNames = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  RESET_PASSWORD: '/reset-password',
  MANUAL_TOKEN: '/manual-token',
  USER_PROFILE: '/profile',
  KUPAC_PREGLED: '/kupci',
  KUPAC_NOVI: '/kupci/dodaj',
  KUPAC_PROMJENA: '/kupci/:sifra',
  PROIZVOD_PREGLED: '/proizvodi',
  PROIZVOD_NOVI: '/proizvodi/dodaj',
  PROIZVOD_PROMJENA: '/proizvodi/:sifra',
  RACUN_PREGLED: '/racuni',
  RACUN_NOVI: '/racuni/dodaj',
  RACUN_PROMJENA: '/racuni/:sifra',
  STAVKA_PREGLED: '/stavke',
  STAVKA_NOVA: '/stavke/dodaj',
  STAVKA_PROMJENA: '/stavke/promjena/:sifra',
  ERA_DIAGRAM: '/era-diagram',
  SWAGGER: '/swagger',
  SALES_GRAPH: '/sales-graph',
  USER_MANAGEMENT: '/admin/users',
  ADMIN_ROLE_TEST: '/admin/role-test',
  PRODUCT_IMAGE_MANAGEMENT: '/admin/product-images',
};

// API endpoint
export const PRODUKCIJA = 'https://www.brutallucko.online/api/v1';

// Environment detection
export const isProduction = () => {
  // Check if we're in production mode using Vite's environment variable
  // This will be 'production' when built with 'npm run build'
  return import.meta.env.MODE === 'production';
};

// Sensitive field names that should be sanitized in logs
export const SENSITIVE_FIELDS = [
  'ime', 'prezime', 'email', 'ulica', 'mjesto', 'telefon', 'oib', 
  'password', 'lozinka', 'token', 'authorization', 'jwt', 
  'name', 'firstName', 'lastName', 'address', 'phone'
];
