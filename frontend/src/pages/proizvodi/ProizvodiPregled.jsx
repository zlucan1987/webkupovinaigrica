import { useEffect, useState } from "react";
import ProizvodService from "../../services/ProizvodService";
import { Button, Table, Form, InputGroup, Row, Col, Card } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { RouteNames } from "../../constants";
import { 
    getGameImage, 
    getRandomRating, 
    hasDiscount, 
    getDiscountPercentage, 
    getProductImageWithFallback,
    refreshProductImage,
    checkImageExists
} from "../../utils/imageUtils";
import { useCart } from "../../context/CartContext";
import AuthService from "../../services/AuthService";
import "./ProizvodiPregled.css";

export default function ProizvodiPregled() {
    const [proizvodi, setProizvodi] = useState([]);
    const [filteredProizvodi, setFilteredProizvodi] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("nazivAsc");
    const [viewMode, setViewMode] = useState("grid"); // "grid" or "table"
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { addToCart } = useCart();
    
    // Check if user is admin
    useEffect(() => {
        setIsAdmin(AuthService.hasRole('Admin'));
    }, []);
    
    // Dohvati search parametar iz URL-a ako postoji
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const search = searchParams.get("search");
        if (search) {
            setSearchTerm(search);
        }
    }, [location]);

    // Funkcija za provjeru postoji li slika na serveru (koristi se u checkAllImages)
    // Ova funkcija je sada dostupna iz imageUtils.js

    // Funkcija za dohvaćanje proizvoda
    const fetchProducts = async () => {
        const odgovor = await ProizvodService.get();
        console.log("Dohvaćeni proizvodi:", odgovor);
        
        // Dodaj dodatne informacije proizvodima (slike, ocjene, popuste)
        if (Array.isArray(odgovor)) {
            // Prvo kreiramo osnovne objekte proizvoda
            const enhancedProizvodi = await Promise.all(odgovor.map(async proizvod => {
                // Koristimo naprednu funkciju za dohvaćanje slike s fallback mehanizmom
                const imageUrl = await getProductImageWithFallback(proizvod.sifra, proizvod.nazivIgre);
                
                // Dodajemo timestamp za izbjegavanje cache-a
                const timestamp = new Date().getTime();
                
                return {
                    ...proizvod,
                    imageUrl: imageUrl,
                    fallbackImageUrl: getGameImage(proizvod.nazivIgre),
                    rating: getRandomRating(),
                    discount: hasDiscount() ? getDiscountPercentage() : null,
                    timestamp: timestamp // Spremamo timestamp za kasnije osvježavanje
                };
            }));
            
            setProizvodi(enhancedProizvodi);
            setFilteredProizvodi(enhancedProizvodi);
            
            // Provjeri postoje li slike na serveru i ažuriraj stanje
            const checkAllImages = async () => {
                console.log("Provjera postojanja slika na serveru...");
                
                // Provjeri postoji li zastavica za nedavno ažuriranu sliku
                const lastUpdatedProduct = localStorage.getItem('last_updated_product');
                if (lastUpdatedProduct) {
                    console.log(`Pronađena nedavno ažurirana slika za proizvod ID: ${lastUpdatedProduct}`);
                    
                    // Provjeri postoji li slika za ažurirani proizvod
                    const productId = parseInt(lastUpdatedProduct);
                    const imageUrl = `/slike/proizvodi/${productId}.png?t=${new Date().getTime()}`;
                    
                    // Očisti cache za ovaj proizvod da bi se slika ponovno provjerila
                    localStorage.removeItem(`img_cache_status_${productId}`);
                    
                    const imageExists = await checkImageExists(imageUrl);
                    console.log(`Slika za proizvod ID ${productId} ${imageExists ? 'postoji' : 'ne postoji'} na serveru`);
                    
                    // Ako slika postoji, ažuriraj cache
                    if (imageExists) {
                        localStorage.setItem(`img_cache_status_${productId}`, 'exists');
                    }
                }
                
                // Čistimo localStorage nakon što smo pročitali vrijednosti
                localStorage.removeItem('product_images_updated');
                localStorage.removeItem('last_updated_product');
                localStorage.removeItem('last_update_time');
            };
            
            // Pokreni provjeru slika
            checkAllImages();
        }
    };
    
    // Funkcija za ručno osvježavanje slika proizvoda
    const refreshProductImages = () => {
        console.log("Osvježavanje slika proizvoda");
        
        // Osvježi cache za sve proizvode
        proizvodi.forEach(proizvod => {
            refreshProductImage(proizvod.sifra);
        });
        
        // Ažuriraj URL-ove slika s novim timestampom
        setProizvodi(prevProizvodi => 
            prevProizvodi.map(proizvod => ({
                ...proizvod,
                imageUrl: `/slike/proizvodi/${proizvod.sifra}.png?t=${new Date().getTime()}`
            }))
        );
    };
    
    // Dohvati proizvode pri učitavanju komponente
    useEffect(() => {
        fetchProducts();
        
        // Dodajemo event listener za osvježavanje slika kada korisnik dođe natrag na stranicu
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                // Osvježi slike proizvoda
                refreshProductImages();
            }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Cleanup
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);
    
    // Filtriraj i sortiraj proizvode kad se promijeni pojam za pretragu ili opcija sortiranja
    useEffect(() => {
        let filtered = [...proizvodi];
        
        // Filtriraj po search termu
        if (searchTerm) {
            filtered = filtered.filter(proizvod => 
                proizvod.nazivIgre.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Sortiraj po odabranoj opciji
        switch (sortOption) {
            case "nazivAsc":
                filtered.sort((a, b) => a.nazivIgre.localeCompare(b.nazivIgre));
                break;
            case "nazivDesc":
                filtered.sort((a, b) => b.nazivIgre.localeCompare(a.nazivIgre));
                break;
            case "cijenaAsc":
                filtered.sort((a, b) => a.cijena - b.cijena);
                break;
            case "cijenaDesc":
                filtered.sort((a, b) => b.cijena - a.cijena);
                break;
            case "ratingDesc":
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            default:
                break;
        }
        
        setFilteredProizvodi(filtered);
    }, [searchTerm, sortOption, proizvodi]);

    function obrisi(sifra) {
        if (!confirm("Sigurno obrisati?")) {
            return;
        }
        brisanjeProizvoda(sifra);
    }

    async function brisanjeProizvoda(sifra) {
        const odgovor = await ProizvodService.obrisi(sifra);
        if (odgovor.greska) {
            alert(odgovor.poruka);
            return;
        }
        
        // Fetch products again after deletion
        fetchProducts();
    }

    const handleAddToCart = (proizvod) => {
        addToCart(proizvod);
    };
    
    const renderRatingStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={i <= rating ? "star filled" : "star"}>
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="proizvodi-komponenta">
            <div className="proizvodi-header">
                {isAdmin && (
                    <Link to={RouteNames.PROIZVOD_NOVI} className="btn btn-success siroko">
                        Dodaj novi proizvod
                    </Link>
                )}
                
                <div className="filter-sort-container">
                    <Row className="align-items-center">
                        <Col md={4}>
                            <InputGroup className="mb-3">
                                <Form.Control
                                    placeholder="Pretraži igrice..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Button variant="outline-secondary">
                                    <i className="bi bi-search"></i>
                                </Button>
                            </InputGroup>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Select 
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                >
                                    <option value="nazivAsc">Naziv (A-Z)</option>
                                    <option value="nazivDesc">Naziv (Z-A)</option>
                                    <option value="cijenaAsc">Cijena (najniža prvo)</option>
                                    <option value="cijenaDesc">Cijena (najviša prvo)</option>
                                    <option value="ratingDesc">Ocjena (najviša prvo)</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <div className="view-toggle">
                                <Button 
                                    variant={viewMode === "grid" ? "primary" : "outline-primary"}
                                    className="me-2"
                                    onClick={() => setViewMode("grid")}
                                >
                                    <i className="bi bi-grid-3x3-gap-fill"></i>
                                </Button>
                                <Button 
                                    variant={viewMode === "table" ? "primary" : "outline-primary"}
                                    onClick={() => setViewMode("table")}
                                >
                                    <i className="bi bi-list-ul"></i>
                                </Button>
                            </div>
                        </Col>
                        <Col md={2}>
                            <Button 
                                variant="outline-info" 
                                className="w-100 mb-3"
                                onClick={() => fetchProducts()}
                                title="Osvježi slike proizvoda"
                            >
                                <i className="bi bi-arrow-clockwise"></i> Osvježi
                            </Button>
                        </Col>
                    </Row>
                </div>
            </div>
            
            {viewMode === "grid" ? (
                <div className="proizvodi-grid proizvodi-compact">
                    <Row xs={1} md={3} lg={5} className="g-4">
                        {filteredProizvodi.map((proizvod) => (
                            <Col key={proizvod.sifra}>
                                <Card className="proizvod-card">
                                    <div className="image-container">
                                        <Card.Img 
                                            variant="top" 
                                            src={proizvod.imageUrl} 
                                            alt={proizvod.nazivIgre}
                                            onClick={() => navigate(`/proizvodi/${proizvod.sifra}`)}
                                            onError={(e) => {
                                                console.log(`Slika nije pronađena za proizvod: ${proizvod.nazivIgre} (ID: ${proizvod.sifra}), koristi se fallback slika`);
                                                e.target.onerror = null;
                                                e.target.src = proizvod.fallbackImageUrl;
                                                
                                                // Označi sliku kao nepostojeću u cache-u
                                                refreshProductImage(proizvod.sifra);
                                            }}
                                            key={`${proizvod.sifra}-${proizvod.timestamp}`} // Dodajemo key za forsiranje ponovnog renderiranja
                                        />
                                        <div className="rating">
                                            {renderRatingStars(proizvod.rating)}
                                        </div>
                                        {proizvod.discount && (
                                            <div className="discount-badge">
                                                -{proizvod.discount}%
                                            </div>
                                        )}
                                    </div>
                                    <Card.Body>
                                        <Card.Title>{proizvod.nazivIgre}</Card.Title>
                                        <div className="price-container">
                                            {proizvod.discount ? (
                                                <>
                                                    <span className="original-price">
                                                        {proizvod.cijena.toFixed(2)} €
                                                    </span>
                                                    <span className="discounted-price">
                                                        {(proizvod.cijena * (1 - proizvod.discount / 100)).toFixed(2)} €
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="price">
                                                    {proizvod.cijena.toFixed(2)} €
                                                </span>
                                            )}
                                        </div>
                                        <div className="card-actions">
                                            <Button 
                                                variant="primary" 
                                                onClick={() => handleAddToCart(proizvod)}
                                            >
                                                Dodaj u košaricu
                                            </Button>
                                            {isAdmin && (
                                                <div className="admin-actions">
                                                    <Button 
                                                        variant="outline-secondary" 
                                                        size="sm"
                                                        onClick={() => navigate(`/proizvodi/${proizvod.sifra}`)}
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </Button>
                                                    <Button 
                                                        variant="outline-danger" 
                                                        size="sm"
                                                        onClick={() => obrisi(proizvod.sifra)}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Slika</th>
                            <th>Naziv igre</th>
                            <th>Cijena</th>
                            <th>Ocjena</th>
                            <th>Akcija</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProizvodi.map((proizvod) => (
                            <tr key={proizvod.sifra}>
                                <td>
                                    <img 
                                        src={proizvod.imageUrl} 
                                        alt={proizvod.nazivIgre} 
                                        className="table-image"
                                        onError={(e) => {
                                            console.log(`Slika nije pronađena za proizvod: ${proizvod.nazivIgre} (ID: ${proizvod.sifra}), koristi se fallback slika`);
                                            e.target.onerror = null;
                                            e.target.src = proizvod.fallbackImageUrl;
                                            
                                            // Označi sliku kao nepostojeću u cache-u
                                            refreshProductImage(proizvod.sifra);
                                        }}
                                        key={`${proizvod.sifra}-${proizvod.timestamp}`} // Dodajemo key za forsiranje ponovnog renderiranja
                                    />
                                </td>
                                <td>{proizvod.nazivIgre}</td>
                                <td>
                                    {proizvod.discount ? (
                                        <>
                                            <span className="original-price">
                                                {proizvod.cijena.toFixed(2)} €
                                            </span>
                                            <span className="discounted-price">
                                                {(proizvod.cijena * (1 - proizvod.discount / 100)).toFixed(2)} €
                                            </span>
                                        </>
                                    ) : (
                                        <span>{proizvod.cijena.toFixed(2)} €</span>
                                    )}
                                </td>
                                <td>{renderRatingStars(proizvod.rating)}</td>
                                <td>
                                    <Button 
                                        variant="primary" 
                                        size="sm" 
                                        className="me-2"
                                        onClick={() => handleAddToCart(proizvod)}
                                    >
                                        Dodaj u košaricu
                                    </Button>
                                    {isAdmin && (
                                        <>
                                            <Button 
                                                variant="outline-secondary" 
                                                size="sm" 
                                                className="me-2"
                                                onClick={() => navigate(`/proizvodi/${proizvod.sifra}`)}
                                            >
                                                Promjena
                                            </Button>
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm"
                                                onClick={() => obrisi(proizvod.sifra)}
                                            >
                                                Obriši
                                            </Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
}
