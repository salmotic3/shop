document.addEventListener('DOMContentLoaded', function() {
    // Load data from local storage
    let products = JSON.parse(localStorage.getItem('products')) || [];
    let requests = JSON.parse(localStorage.getItem('requests')) || [];
    
    // DOM elements
    const notification = document.getElementById('notification');
    
    // Show notification
    function showNotification(message, type = 'success') {
        notification.textContent = message;
        notification.style.background = type === 'success' ? '#28a745' : '#e74c3c';
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    
    // Render products
    function renderProducts(containerId, limit = null) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        if (products.length === 0) {
            container.innerHTML = '<p>No products available at the moment.</p>';
            return;
        }
        
        const productsToShow = limit ? products.slice(0, limit) : products;
        
        container.innerHTML = '';
        productsToShow.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-details">
                    <div class="product-name">${product.name}</div>
                    <div class="product-price">৳${product.price}</div>
                    <div class="product-description">${product.description || 'No description available'}</div>
                    <div class="product-actions">
                        <a href="request.html" class="btn btn-small">Request</a>
                    </div>
                </div>
            `;
            container.appendChild(productCard);
        });
    }
    
    // Render requests
    function renderRequests() {
        const container = document.getElementById('requests-list');
        if (!container) return;
        
        if (requests.length === 0) {
            container.innerHTML = '<p>No customer requests yet.</p>';
            return;
        }
        
        container.innerHTML = '';
        requests.forEach(request => {
            const requestCard = document.createElement('div');
            requestCard.className = 'request-card';
            requestCard.innerHTML = `
                <div class="request-header">
                    <div class="request-customer">${request.name}</div>
                    <div class="request-date">${formatDate(request.date)}</div>
                </div>
                <div class="request-product">
                    <strong>Product:</strong> ${request.productName}<br>
                    <strong>Budget:</strong> ৳${request.budget || 'Not specified'}
                </div>
                <div class="request-message">
                    <strong>Description:</strong> ${request.productDescription}
                </div>
                <div class="request-status status-${request.status}">${request.status.charAt(0).toUpperCase() + request.status.slice(1)}</div>
            `;
            container.appendChild(requestCard);
        });
    }
    
    // Initialize pages
    if (document.getElementById('featured-products')) {
        renderProducts('featured-products', 3);
    }
    
    if (document.getElementById('product-catalog')) {
        renderProducts('product-catalog');
    }
    
    // Product request form
    const requestForm = document.getElementById('product-request-form');
    if (requestForm) {
        requestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newRequest = {
                id: Date.now(),
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                productName: document.getElementById('product-name').value,
                productDescription: document.getElementById('product-description').value,
                budget: document.getElementById('budget').value,
                date: new Date().toISOString(),
                status: 'new'
            };
            
            requests.push(newRequest);
            localStorage.setItem('requests', JSON.stringify(requests));
            
            requestForm.reset();
            showNotification('Your request has been submitted successfully!');
        });
    }
    
    // Admin panel
    const adminTabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (adminTabs.length > 0) {
        adminTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                adminTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${tabId}-tab`) {
                        content.classList.add('active');
                    }
                });
                
                if (tabId === 'requests') {
                    renderRequests();
                }
            });
        });
        
        // Add product form
        const addProductForm = document.getElementById('add-product-form');
        if (addProductForm) {
            addProductForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const imageFile = document.getElementById('p-image').files[0];
                
                if (imageFile) {
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        const newProduct = {
                            id: Date.now(),
                            name: document.getElementById('p-name').value,
                            price: document.getElementById('p-price').value,
                            description: document.getElementById('p-description').value,
                            image: e.target.result
                        };
                        
                        products.push(newProduct);
                        localStorage.setItem('products', JSON.stringify(products));
                        
                        addProductForm.reset();
                        renderProducts('products-list');
                        showNotification('Product added successfully!');
                    };
                    
                    reader.readAsDataURL(imageFile);
                }
            });
            
            // Render products in admin
            renderProducts('products-list');
        }
    }
});
