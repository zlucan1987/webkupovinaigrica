import { HttpService } from '../../services/HttpService';
// Removed PRODUKCIJA import as it's redundant with HttpService baseURL

const dohvatiProizvode = async () => {
    try {
        console.log("dohvatiProizvode: Dohvaćam proizvode s API-ja");
        const response = await HttpService.get('/Proizvod');
        return response.data;
    } catch (error) {
        console.error('Greška pri dohvaćanju proizvoda:', error);
        return [];
    }
};

export default dohvatiProizvode;
