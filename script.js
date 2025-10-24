
const menuItems = [
    {
        id: 1,
        name: "Margherita Pizza",
        description: "Fresh tomatoes, mozzarella, basil, and olive oil",
        price: 12.99,
        category: "pizza",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        name: "Pepperoni Pizza",
        description: "Classic pepperoni with mozzarella and tomato sauce",
        price: 14.99,
        category: "pizza",
        image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        name: "Classic Cheeseburger",
        description: "Beef patty, cheddar cheese, lettuce, tomato, and special sauce",
        price: 10.99,
        category: "burger",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        name: "BBQ Bacon Burger",
        description: "Beef patty, crispy bacon, onion rings, and BBQ sauce",
        price: 13.99,
        category: "burger",
        image: "https://images.unsplash.com/photo-1553979459-d2c46d8c6d50?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 5,
        name: "California Roll",
        description: "Crab, avocado, cucumber, and sesame seeds",
        price: 8.99,
        category: "sushi",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 6,
        name: "Salmon Nigiri",
        description: "Fresh salmon over seasoned rice",
        price: 7.99,
        category: "sushi",
        image: "https://images.unsplash.com/photo-1603048148421-751e9d8f1b9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 7,
        name: "Chocolate Lava Cake",
        description: "Warm chocolate cake with a molten center, served with vanilla ice cream",
        price: 6.99,
        category: "dessert",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 8,
        name: "New York Cheesecake",
        description: "Classic creamy cheesecake with a graham cracker crust",
        price: 7.99,
        category: "dessert",
        image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    }
];

// DOM Elements
const menuItemsContainer = document.querySelector('.menu-items');
const categoryButtons = document.querySelectorAll('.category-btn');
const cartIcon = document.querySelector('.cart-icon');
const cartSidebar = document.querySelector('.cart-sidebar');
const closeCartBtn = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotalElement = document.querySelector('.total-amount');
const checkoutBtn = document.querySelector('.checkout-btn');
const cartCountElement = document.querySelector('.cart-count');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

// Cart array
let cart = [];

// Initialize the app
function init() {
    renderMenuItems(menuItems);
    setupEventListeners();
    updateCartCount();
}

// Render menu items
function renderMenuItems(items) {
    menuItemsContainer.innerHTML = '';
    
    items.forEach(item => {
        const menuItemElement = document.createElement('div');
        menuItemElement.className = 'menu-item';
        menuItemElement.innerHTML = `
            <div class="menu-item-img" style="background-image: url('${item.image}')"></div>
            <div class="menu-item-info">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="menu-item-price">$${item.price.toFixed(2)}</div>
                <button class="add-to-cart" data-id="${item.id}">
                    <i class="fas fa-plus"></i> Add to Cart
                </button>
            </div>
        `;
        menuItemsContainer.appendChild(menuItemElement);
    });
}

// Filter menu items by category
function filterMenu(category) {
    if (category === 'all') {
        renderMenuItems(menuItems);
    } else {
        const filteredItems = menuItems.filter(item => item.category === category);
        renderMenuItems(filteredItems);
    }
}

// Add item to cart
function addToCart(itemId) {
    const item = menuItems.find(item => item.id === itemId);
    if (!item) return;
    
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`${item.name} added to cart!`);
}

// Update cart display
function updateCart() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotalElement.textContent = '$0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
            </div>
            <div class="cart-item-actions">
                <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
                <i class="fas fa-trash remove-item" data-id="${item.id}"></i>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    cartTotalElement.textContent = `$${total.toFixed(2)}`;
    updateCartCount();
}

// Update cart count badge
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = count;
    cartCountElement.style.display = count > 0 ? 'block' : 'none';
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style notification
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#4ecdc4';
    notification.style.color = 'white';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '10px';
    notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    notification.style.zIndex = '3000';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.transition = 'opacity 0.3s, transform 0.3s';
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Setup event listeners
function setupEventListeners() {
    // Category filtering
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter menu
            const category = button.dataset.category;
            filterMenu(category);
        });
    });
    
    // Add to cart buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart')) {
            const button = e.target.closest('.add-to-cart');
            const itemId = parseInt(button.dataset.id);
            addToCart(itemId);
        }
    });
    
    // Cart interactions
    document.addEventListener('click', (e) => {
        // Open cart
        if (e.target.closest('.cart-icon')) {
            cartSidebar.classList.add('active');
        }
        
        // Close cart
        if (e.target.closest('.close-cart')) {
            cartSidebar.classList.remove('active');
        }
        
        // Remove item
        if (e.target.classList.contains('remove-item')) {
            const itemId = parseInt(e.target.dataset.id);
            cart = cart.filter(item => item.id !== itemId);
            updateCart();
        }
        
        // Increase quantity
        if (e.target.classList.contains('increase')) {
            const itemId = parseInt(e.target.dataset.id);
            const item = cart.find(item => item.id === itemId);
            if (item) {
                item.quantity += 1;
                updateCart();
            }
        }
        
        // Decrease quantity
        if (e.target.classList.contains('decrease')) {
            const itemId = parseInt(e.target.dataset.id);
            const item = cart.find(item => item.id === itemId);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
                updateCart();
            } else if (item && item.quantity === 1) {
                cart = cart.filter(cartItem => cartItem.id !== itemId);
                updateCart();
            }
        }
    });
    
    // Quantity input change
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('quantity-input')) {
            const itemId = parseInt(e.target.dataset.id);
            const newQuantity = parseInt(e.target.value);
            
            if (newQuantity >= 1) {
                const item = cart.find(item => item.id === itemId);
                if (item) {
                    item.quantity = newQuantity;
                    updateCart();
                }
            } else {
                e.target.value = 1;
            }
        }
    });
    
    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
    
    // Checkout button
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
            return;
        }
        showNotification('Proceeding to checkout...');
        // In a real app, this would redirect to checkout page
    });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
