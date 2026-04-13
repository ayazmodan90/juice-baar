// ZEST Juice Bar - Common JavaScript

// ==================== CURRENCY ====================
const currencies = [
    { code: 'USD', symbol: '$', rate: 1, name: 'US Dollar' },
    { code: 'EUR', symbol: '€', rate: 0.92, name: 'Euro' },
    { code: 'GBP', symbol: '£', rate: 0.79, name: 'British Pound' },
    { code: 'INR', symbol: '₹', rate: 83.12, name: 'Indian Rupee' },
    { code: 'AUD', symbol: 'A$', rate: 1.53, name: 'Australian Dollar' }
];

let currentCurrency = localStorage.getItem('selectedCurrency') || 'USD';

function initCurrencyDropdown() {
    const currencyBtn = document.getElementById('currencyBtn');
    const currencyDropdown = document.getElementById('currencyDropdown');
    if (currencyBtn && currencyDropdown) {
        currencyBtn.querySelector('span').textContent = currentCurrency;
        currencyBtn.addEventListener('click', e => {
            e.stopPropagation();
            currencyDropdown.classList.toggle('active');
        });
        document.addEventListener('click', () => currencyDropdown.classList.remove('active'));
        currencyDropdown.innerHTML = '';
        currencies.forEach(c => {
            const opt = document.createElement('div');
            opt.className = 'currency-option';
            opt.textContent = `${c.code} (${c.symbol})`;
            opt.onclick = () => selectCurrency(c.code);
            currencyDropdown.appendChild(opt);
        });
    }
}

function selectCurrency(code) {
    currentCurrency = code;
    localStorage.setItem('selectedCurrency', code);
    const btn = document.getElementById('currencyBtn');
    if (btn) btn.querySelector('span').textContent = code;
    updateAllPrices();
    const dd = document.getElementById('currencyDropdown');
    if (dd) dd.classList.remove('active');
}

function convertPrice(usdPrice) {
    const c = currencies.find(x => x.code === currentCurrency);
    if (!c) return `$${usdPrice}`;
    const val = (usdPrice * c.rate).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${c.symbol}${val}`;
}

function updateAllPrices() {
    document.querySelectorAll('[data-price]').forEach(el => {
        el.textContent = convertPrice(parseFloat(el.getAttribute('data-price')));
    });
}

// ==================== MOBILE MENU ====================
function toggleMobileMenu() {
    const nav = document.querySelector('.nav-links');
    const toggle = document.querySelector('.mobile-menu-toggle');
    if (nav && toggle) { nav.classList.toggle('active'); toggle.classList.toggle('active'); }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelector('.nav-links')?.classList.remove('active');
            document.querySelector('.mobile-menu-toggle')?.classList.remove('active');
        });
    });
});

// ==================== NAVBAR SCROLL ====================
function initNavbarScroll() {
    const nav = document.querySelector('nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 80) {
                nav.style.padding = '0.9rem 5%';
                nav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            } else {
                nav.style.padding = '1.2rem 5%';
                nav.style.boxShadow = 'none';
            }
        });
    }
}

// ==================== SCROLL REVEAL ====================
function reveal() {
    document.querySelectorAll('.reveal').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 120) {
            el.classList.add('active');
        }
    });
}

// ==================== SCROLL TO TOP ====================
function createScrollToTop() {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.className = 'scroll-to-top';
    btn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(btn);
    window.addEventListener('scroll', () => {
        btn.classList.toggle('show', window.pageYOffset > 300);
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ==================== CHAT WIDGET ====================
function createChatWidget() {
    const btn = document.createElement('button');
    btn.className = 'chat-widget';
    btn.innerHTML = '<i class="fas fa-comments"></i>';
    btn.setAttribute('aria-label', 'Chat with us');
    btn.onclick = () => alert('Chat coming soon! Call us: +1 (555) ZEST-BAR or email: hello@zestjuicebar.com');
    document.body.appendChild(btn);
}

// ==================== CART ====================
function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(i => i.id === id);
    if (item) item.quantity += 1;
    else cart.push({ id, name, price, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${name} added to cart! 🥤`);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((s, i) => s + i.quantity, 0);
    const el = document.getElementById('cart-count');
    if (el) { el.textContent = total; el.style.display = total > 0 ? 'flex' : 'none'; }
}

function showNotification(msg) {
    const n = document.createElement('div');
    n.className = 'notification';
    n.innerHTML = `<i class="fas fa-check-circle"></i><span>${msg}</span>`;
    document.body.appendChild(n);
    setTimeout(() => n.classList.add('show'), 100);
    setTimeout(() => { n.classList.remove('show'); setTimeout(() => n.remove(), 300); }, 3000);
}

// ==================== WISHLIST ====================
function toggleWishlist(id, name) {
    let list = JSON.parse(localStorage.getItem('wishlist')) || [];
    const idx = list.findIndex(i => i.id === id);
    if (idx > -1) { list.splice(idx, 1); showNotification('Removed from favorites'); }
    else { list.push({ id, name }); showNotification('Added to favorites! ❤️'); }
    localStorage.setItem('wishlist', JSON.stringify(list));
}

// ==================== COOKIE CONSENT ====================
function initCookieConsent() {
    if (!localStorage.getItem('cookieConsent')) {
        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.innerHTML = `<p>🍊 We use cookies to sweeten your experience. By continuing, you accept our cookie policy.</p><button onclick="acceptCookies()">Got it!</button>`;
        document.body.appendChild(banner);
    }
}

function acceptCookies() {
    localStorage.setItem('cookieConsent', 'true');
    const b = document.querySelector('.cookie-banner');
    if (b) { b.style.animation = 'slideOutDown 0.5s ease-out'; setTimeout(() => b.remove(), 500); }
}

// ==================== AUTH ====================
function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem('user'));
    const link = document.getElementById('loginLink');
    if (link) {
        if (user) {
            link.innerHTML = `<i class="fas fa-user"></i> ${user.name}`;
            link.href = '#';
            link.onclick = e => { e.preventDefault(); if (confirm('Logout?')) { localStorage.removeItem('user'); window.location.href = 'index.html'; } };
        } else {
            link.innerHTML = 'Login';
            link.href = 'login.html';
        }
    }
}

// ==================== UTILITY ====================
function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function trackEvent(name, data) { console.log('Event:', name, data); }

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    initCurrencyDropdown();
    updateAllPrices();
    window.addEventListener('scroll', reveal);
    reveal();
    initNavbarScroll();
    createScrollToTop();
    createChatWidget();
    checkLoginStatus();
    updateCartCount();
    setTimeout(initCookieConsent, 2000);

    document.querySelectorAll('.juice-card, .menu-card, .review-card').forEach((el, i) => {
        el.style.animationDelay = `${i * 0.08}s`;
    });
});

window.ZEST = {
    convertPrice, addToCart, toggleWishlist, selectCurrency,
    updateAllPrices, validateEmail, trackEvent, toggleMobileMenu
};
