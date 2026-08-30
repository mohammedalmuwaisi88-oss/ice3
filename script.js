/**
 * Nana's Westbury — Production Application State & Engine
 * Built exclusively with Vanilla JavaScript (ES6+)
 */

// --- 1. PRODUCT DATABASE (EXACTLY 10 DESSERT PRODUCTS) ---
const PRODUCTS = [
    {
        id: 'prod-strawberry-dream',
        name: 'Strawberry Dream',
        description: 'Fresh strawberry ice cream topped with strawberries and cream.',
        price: 8.50,
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'prod-blueberry-bliss',
        name: 'Blueberry Bliss',
        description: 'Creamy blueberry dessert with a rich berry flavor.',
        price: 8.75,
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'prod-vanilla-cloud',
        name: 'Vanilla Cloud',
        description: 'Classic premium vanilla ice cream with a smooth creamy texture.',
        price: 7.50,
        image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'prod-chocolate-heaven',
        name: 'Chocolate Heaven',
        description: 'Rich chocolate ice cream for true chocolate lovers.',
        price: 8.25,
        image: 'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'prod-cookies-cream',
        name: 'Cookies & Cream',
        description: 'Creamy vanilla ice cream with crunchy cookie pieces.',
        price: 8.50,
        image: 'https://images.unsplash.com/photo-1560008511-11c63416e52d?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'prod-mango-paradise',
        name: 'Mango Paradise',
        description: 'Refreshing tropical mango ice cream.',
        price: 8.75,
        image: 'https://images.unsplash.com/photo-1549395156-e0c1fe6fc7a5?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'prod-berry-cheesecake',
        name: 'Berry Cheesecake',
        description: 'Creamy cheesecake-inspired ice cream with mixed berries.',
        price: 9.25,
        image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'prod-pistachio-cream',
        name: 'Pistachio Cream',
        description: 'Smooth pistachio ice cream with a rich nutty flavor.',
        price: 9.50,
        image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'prod-caramel-crunch',
        name: 'Caramel Crunch',
        description: 'Creamy caramel ice cream with crunchy caramel pieces.',
        price: 8.95,
        image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'prod-nanas-signature',
        name: 'Nana\'s Signature',
        description: 'A premium signature dessert inspired by Nana\'s special flavors.',
        price: 10.50,
        image: 'https://images.unsplash.com/photo-1576506295286-5cda482453a2?auto=format&fit=crop&w=600&q=80'
    }
];

// --- 2. GLOBAL STATE & LOCAL STORAGE ENGINE ---
const LOCAL_STORAGE_KEY = 'nanas_cart_store_v1';
let cartState = [];
let activeOrderSession = null;

/**
 * Load persisted cart state from browser LocalStorage
 */
function loadCart() {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        cartState = stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error('LocalStorage load exception:', e);
        cartState = [];
    }
}

/**
 * Persist current cart state to browser LocalStorage
 */
function saveCart() {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cartState));
    } catch (e) {
        console.error('LocalStorage write exception:', e);
    }
}

// --- 3. CURRENCY & FORMATTING HELPERS ---
const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
});

function formatPrice(amount) {
    return currencyFormatter.format(amount);
}

function calculateTotal() {
    return cartState.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function calculateTotalItems() {
    return cartState.reduce((sum, item) => sum + item.quantity, 0);
}

function generateOrderNumber() {
    const randomSixDigits = Math.floor(100000 + Math.random() * 900000);
    return `NAN-${randomSixDigits}`;
}

// --- 4. CART MUTATION CONTROLLERS ---
function addToCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cartState.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartState.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
    renderUI();
}

function updateQuantity(productId, delta) {
    const item = cartState.find(item => item.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    saveCart();
    renderUI();
}

function removeFromCart(productId) {
    cartState = cartState.filter(item => item.id !== productId);
    saveCart();
    renderUI();
}

// --- 5. DOM RENDERING ENGINE ---
function renderProductGrid() {
    const gridContainer = document.getElementById('product-grid');
    if (!gridContainer) return;

    gridContainer.innerHTML = PRODUCTS.map(product => {
        const cartItem = cartState.find(item => item.id === product.id);
        const quantity = cartItem ? cartItem.quantity : 0;

        const actionUI = quantity > 0 ? `
            <div class="qty-control-inline">
                <button class="qty-btn" onclick="updateQuantity('${product.id}', -1)" aria-label="Decrease quantity">-</button>
                <span class="qty-val">${quantity}</span>
                <button class="qty-btn" onclick="updateQuantity('${product.id}', 1)" aria-label="Increase quantity">+</button>
            </div>
        ` : `
            <button class="add-btn" onclick="addToCart('${product.id}')">+ Add</button>
        `;

        return `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image-box">
                    <img src="${product.image}" alt="${product.name} - Nana's Westbury" loading="lazy">
                </div>
                <div class="product-details">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-desc">${product.description}</p>
                    <div class="product-bottom">
                        <span class="product-price">${formatPrice(product.price)}</span>
                        ${actionUI}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderCartDrawer() {
    const cartBody = document.getElementById('cart-body');
    const subtotalEl = document.getElementById('cart-subtotal');
    const badgeEl = document.getElementById('cart-badge-count');
    const mobileCountEl = document.getElementById('m-cart-count');
    const mobileTotalEl = document.getElementById('m-cart-total');

    const totalCount = calculateTotalItems();
    const totalPrice = calculateTotal();

    // Update global indicators
    if (badgeEl) badgeEl.textContent = totalCount;
    if (mobileCountEl) mobileCountEl.textContent = `${totalCount} ${totalCount === 1 ? 'Item' : 'Items'}`;
    if (mobileTotalEl) mobileTotalEl.textContent = formatPrice(totalPrice);
    if (subtotalEl) subtotalEl.textContent = formatPrice(totalPrice);

    if (!cartBody) return;

    if (cartState.length === 0) {
        cartBody.innerHTML = `
            <div class="cart-empty-state">
                <h4>Your cart is empty.</h4>
                <p>Discover something sweet from our menu collection.</p>
                <button class="btn btn-secondary" onclick="closeCart(); location.href='#menu';">Explore Menu</button>
            </div>
        `;
        document.getElementById('cart-footer').style.display = 'none';
        return;
    }

    document.getElementById('cart-footer').style.display = 'block';

    cartBody.innerHTML = cartState.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
                <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">Remove</button>
            </div>
            <div class="qty-control-inline">
                <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
            </div>
        </div>
    `).join('');
}

function renderUI() {
    renderProductGrid();
    renderCartDrawer();
}

// --- 6. CART DRAWER TOGGLE CONTROLS ---
function openCart() {
    document.getElementById('cart-drawer').classList.add('active');
    document.getElementById('cart-backdrop').classList.add('active');
    document.getElementById('cart-drawer').setAttribute('aria-hidden', 'false');
}

function closeCart() {
    document.getElementById('cart-drawer').classList.remove('active');
    document.getElementById('cart-backdrop').classList.remove('active');
    document.getElementById('cart-drawer').setAttribute('aria-hidden', 'true');
}

// --- 7. CHECKOUT & WHATSAPP INTEGRATION PIPELINE ---
function openCheckoutModal() {
    if (cartState.length === 0) return;
    closeCart();
    document.getElementById('checkout-modal').classList.add('active');
}

function closeCheckoutModal() {
    document.getElementById('checkout-modal').classList.remove('active');
}

function openSummaryModal() {
    document.getElementById('summary-modal').classList.add('active');
}

function closeSummaryModal() {
    document.getElementById('summary-modal').classList.remove('active');
}

function handleCheckoutSubmit(e) {
    e.preventDefault();
    const customerName = document.getElementById('cust-name').value.trim();
    const customerNote = document.getElementById('cust-note').value.trim();

    if (!customerName) return;

    activeOrderSession = {
        orderId: generateOrderNumber(),
        customerName: customerName,
        customerNote: customerNote || 'None',
        items: [...cartState],
        total: calculateTotal()
    };

    closeCheckoutModal();
    renderSummaryModal();
    openSummaryModal();
}

function renderSummaryModal() {
    if (!activeOrderSession) return;

    document.getElementById('summary-order-id').textContent = activeOrderSession.orderId;
    
    const receiptContainer = document.getElementById('summary-receipt-body');
    const itemsMarkup = activeOrderSession.items.map(item => `
        <div class="receipt-row">
            <span>${item.name} (×${item.quantity})</span>
            <span>${formatPrice(item.price * item.quantity)}</span>
        </div>
    `).join('');

    receiptContainer.innerHTML = `
        <div class="receipt-row">
            <strong>Customer:</strong>
            <span>${activeOrderSession.customerName}</span>
        </div>
        ${activeOrderSession.customerNote !== 'None' ? `
        <div class="receipt-row" style="margin-bottom: 0.8rem;">
            <strong>Note:</strong>
            <span style="max-width: 60%; text-align: right;">${activeOrderSession.customerNote}</span>
        </div>` : ''}
        <hr style="border: none; border-top: 1px dashed #E8DFD5; margin: 0.75rem 0;">
        ${itemsMarkup}
        <div class="receipt-row total">
            <span>Total Amount</span>
            <span>${formatPrice(activeOrderSession.total)}</span>
        </div>
    `;
}

/**
 * Encodes order details into an invoice payload and triggers WhatsApp deep link
 */
function launchWhatsAppOrder() {
    if (!activeOrderSession) return;

    const sellerPhone = '96872420073';
    
    let itemsText = activeOrderSession.items.map(item => {
        return `${item.name}\nQty: ${item.quantity}\nPrice: ${formatPrice(item.price)}\nTotal: ${formatPrice(item.price * item.quantity)}\n`;
    }).join('\n');

    const rawMessage = 
`--------------------------------
NANA'S
Westbury, NY

NEW ORDER
--------------------------------

Customer:
${activeOrderSession.customerName}

Order #:
${activeOrderSession.orderId}

--------------------------------
ITEMS
--------------------------------

${itemsText}
--------------------------------
SUBTOTAL: ${formatPrice(activeOrderSession.total)}

Customer Note:
${activeOrderSession.customerNote}

--------------------------------

Thank you for ordering from Nana's.

Please confirm the order and payment method.

--------------------------------`;

    const encodedMessage = encodeURIComponent(rawMessage);
    const whatsappUrl = `https://wa.me/${sellerPhone}?text=${encodedMessage}`;

    // Open WhatsApp in new tab/app window
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}

// --- 8. EVENT LISTENERS INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize State
    loadCart();
    renderUI();

    // 2. Navigation Scroll Effect & Mobile Menu
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile nav on click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // 3. Cart Drawer Triggers
    document.getElementById('cart-trigger')?.addEventListener('click', openCart);
    document.getElementById('cart-close')?.addEventListener('click', closeCart);
    document.getElementById('cart-backdrop')?.addEventListener('click', closeCart);
    document.getElementById('m-cart-trigger')?.addEventListener('click', openCart);
    document.getElementById('footer-open-cart')?.addEventListener('click', openCart);

    // 4. Checkout Flow Triggers
    document.getElementById('btn-proceed-checkout')?.addEventListener('click', openCheckoutModal);
    document.getElementById('checkout-close')?.addEventListener('click', closeCheckoutModal);
    document.getElementById('checkout-form')?.addEventListener('submit', handleCheckoutSubmit);

    // 5. WhatsApp & Summary Triggers
    document.getElementById('btn-whatsapp-confirm')?.addEventListener('click', launchWhatsAppOrder);
    document.getElementById('btn-edit-order')?.addEventListener('click', () => {
        closeSummaryModal();
        openCart();
    });
});
