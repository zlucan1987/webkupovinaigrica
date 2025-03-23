import { createContext, useState, useContext, useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [notification, setNotification] = useState({ show: false, message: '', product: null });
    
    useEffect(() => {
        calculateTotal();
    }, [cartItems]);
    
    const addToCart = (product) => {
        const existingItem = cartItems.find(item => item.sifra === product.sifra);
        
        if (existingItem) {
            setCartItems(
                cartItems.map(item => 
                    item.sifra === product.sifra 
                        ? { ...item, quantity: item.quantity + 1 } 
                        : item
                )
            );
        } else {
            setCartItems([...cartItems, { ...product, quantity: 1 }]);
        }
        
        // Show notification
        setNotification({ 
            show: true, 
            message: `${product.nazivIgre} dodana u košaricu`, 
            product 
        });
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            setNotification({ show: false, message: '', product: null });
        }, 3000);
    };
    
    const removeFromCart = (productId) => {
        setCartItems(cartItems.filter(item => item.sifra !== productId));
    };
    
    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        
        setCartItems(
            cartItems.map(item => 
                item.sifra === productId 
                    ? { ...item, quantity } 
                    : item
            )
        );
    };
    
    const clearCart = () => {
        setCartItems([]);
    };
    
    const calculateTotal = () => {
        const total = cartItems.reduce((sum, item) => {
            const itemPrice = item.cijena * item.quantity;
            return sum + itemPrice;
        }, 0);
        
        setTotalPrice(total);
    };
    
    const applyDiscount = (discountPercent) => {
        const discountMultiplier = 1 - (discountPercent / 100);
        return (totalPrice * discountMultiplier).toFixed(2);
    };
    
    const value = {
        cartItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyDiscount,
        notification
    };
    
    return (
        <CartContext.Provider value={value}>
            {children}
            
            {/* Notification Toast */}
            <ToastContainer 
                position="bottom-end" 
                className="p-3" 
                style={{ zIndex: 1070 }}
            >
                <Toast 
                    show={notification.show} 
                    onClose={() => setNotification({ show: false, message: '', product: null })}
                    bg="success"
                    delay={3000}
                    autohide
                >
                    <Toast.Header closeButton={true}>
                        <strong className="me-auto">Košarica</strong>
                    </Toast.Header>
                    <Toast.Body className="text-white">
                        {notification.message}
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </CartContext.Provider>
    );
};
