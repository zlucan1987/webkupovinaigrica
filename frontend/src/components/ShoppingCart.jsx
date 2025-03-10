import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Button, Offcanvas, ListGroup, Form, Badge } from 'react-bootstrap';

const ShoppingCart = () => {
    const [show, setShow] = useState(false);
    const [discountCode, setDiscountCode] = useState('');
    const [discountApplied, setDiscountApplied] = useState(false);
    
    const { 
        cartItems, 
        totalPrice, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        applyDiscount 
    } = useCart();
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    const handleApplyDiscount = () => {
        if (discountCode.trim() !== '') {
            setDiscountApplied(true);
        }
    };
    
    const handleCheckout = () => {
        alert('Hvala na kupnji!');
        clearCart();
        handleClose();
    };
    
    return (
        <>
            <Button 
                variant="outline-light" 
                className="cart-button" 
                onClick={handleShow}
            >
                <img 
                    src="/logooo1.png" 
                    alt="Košarica" 
                    className="cart-icon" 
                />
                {cartItems.length > 0 && (
                    <Badge 
                        pill 
                        bg="danger" 
                        className="cart-badge"
                    >
                        {cartItems.reduce((total, item) => total + item.quantity, 0)}
                    </Badge>
                )}
            </Button>
            
            <Offcanvas show={show} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Košarica</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {cartItems.length === 0 ? (
                        <p>Vaša košarica je prazna.</p>
                    ) : (
                        <>
                            <ListGroup variant="flush">
                                {cartItems.map((item) => (
                                    <ListGroup.Item key={item.sifra} className="cart-item">
                                        <div className="cart-item-details">
                                            <div className="cart-item-image">
                                                <img 
                                                    src={item.imageUrl || 'https://via.placeholder.com/50'} 
                                                    alt={item.nazivIgre} 
                                                />
                                            </div>
                                            <div className="cart-item-info">
                                                <h5>{item.nazivIgre}</h5>
                                                <p>Cijena: {item.cijena} €</p>
                                            </div>
                                        </div>
                                        <div className="cart-item-actions">
                                            <Form.Control
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.sifra, parseInt(e.target.value))}
                                                className="quantity-input"
                                            />
                                            <Button 
                                                variant="danger" 
                                                size="sm"
                                                onClick={() => removeFromCart(item.sifra)}
                                            >
                                                Ukloni
                                            </Button>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            
                            <div className="discount-section mt-3">
                                <Form.Group className="mb-3">
                                    <Form.Label>Kod za popust</Form.Label>
                                    <div className="d-flex">
                                        <Form.Control
                                            type="text"
                                            placeholder="Unesite kod"
                                            value={discountCode}
                                            onChange={(e) => setDiscountCode(e.target.value)}
                                            disabled={discountApplied}
                                        />
                                        <Button 
                                            variant="outline-primary" 
                                            onClick={handleApplyDiscount}
                                            disabled={discountApplied}
                                            className="ms-2"
                                        >
                                            Primijeni
                                        </Button>
                                    </div>
                                </Form.Group>
                            </div>
                            
                            <div className="cart-summary mt-3">
                                <div className="d-flex justify-content-between">
                                    <span>Ukupno:</span>
                                    <span>{totalPrice.toFixed(2)} €</span>
                                </div>
                                
                                {discountApplied && (
                                    <div className="d-flex justify-content-between text-success">
                                        <span>S popustom (20%):</span>
                                        <span>{applyDiscount(20)} €</span>
                                    </div>
                                )}
                                
                                <div className="d-grid gap-2 mt-3">
                                    <Button 
                                        variant="primary" 
                                        onClick={handleCheckout}
                                    >
                                        Završi kupnju
                                    </Button>
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={clearCart}
                                    >
                                        Isprazni košaricu
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default ShoppingCart;
