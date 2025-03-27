import { createContext, useState, useContext, useEffect } from 'react';
import { Toast } from 'react-bootstrap';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [notifications, setNotifications] = useState([]);
    
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
        
        // Create a new notification with unique ID
        const newNotification = { 
            id: Date.now(), // Use timestamp as unique ID
            message: `${product.nazivIgre} dodana u košaricu`, 
            product 
        };
        
        // Add new notification to the array
        setNotifications(prev => [...prev, newNotification]);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            removeNotification(newNotification.id);
        }, 3000);
    };
    
    // Function to remove a specific notification by ID
    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
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
        applyDiscount
    };
    
    return (
        <CartContext.Provider value={value}>
            {children}
            
            {/* Notification Toasts */}
            <div 
                style={{ 
                    position: 'fixed', 
                    bottom: '20px', 
                    right: '20px', 
                    zIndex: 1070,
                    display: 'flex',
                    flexDirection: 'column-reverse', // Newest at the bottom
                    gap: '10px'
                }}
            >
                {notifications.map(notification => (
                    <Toast 
                        key={notification.id}
                        onClose={() => removeNotification(notification.id)}
                        bg="success"
                        className="mb-2"
                    >
                        <Toast.Header closeButton={true}>
                            <strong className="me-auto">Košarica</strong>
                        </Toast.Header>
                        <Toast.Body className="text-white">
                            {notification.message}
                        </Toast.Body>
                    </Toast>
                ))}
            </div>
        </CartContext.Provider>
    );
};
