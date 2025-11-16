// Cart functionality
console.log("cart.js loaded");

// Инициализация корзины
let cart = {
    items: [],
    
    // Загрузка корзины из localStorage
    load() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
        }
        this.updateCartCount();
    },
    
    // Сохранение корзины в localStorage
    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartCount();
    },
    
    // Добавление товара в корзину
    addItem(productId, productName, productPrice, productImage) {
        // Проверяем, есть ли уже такой товар в корзине
        const existingItem = this.items.find(item => item.id === productId);
        
        if (existingItem) {
            // Если товар уже есть, увеличиваем количество
            existingItem.quantity += 1;
        } else {
            // Если товара нет, добавляем новый
            this.items.push({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
        }
        
        this.save();
        this.showNotification('Товар добавлен в корзину!');
    },
    
    // Получение общего количества товаров
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    },
    
    // Обновление счетчика корзины
    updateCartCount() {
        const count = this.getTotalItems();
        const cartLinks = document.querySelectorAll('.cart-link');
        const cartCounts = document.querySelectorAll('.cart-count');
        
        // Обновляем все счетчики
        cartCounts.forEach(cartCount => {
            cartCount.textContent = count;
        });
        
        // Обновляем все ссылки корзины
        cartLinks.forEach(cartLink => {
            // Обновляем счетчик на иконке для мобильных устройств
            const cartIconBadge = cartLink.querySelector('.cart-icon-badge');
            if (cartIconBadge) {
                cartIconBadge.textContent = count > 99 ? '99+' : count;
                cartIconBadge.style.display = count > 0 ? 'flex' : 'none';
            }
            
            // Добавляем класс активности, если корзина не пуста
            if (count > 0) {
                cartLink.classList.add('cart-has-items');
                cartLink.setAttribute('data-count', count > 99 ? '99+' : count);
            } else {
                cartLink.classList.remove('cart-has-items');
                cartLink.removeAttribute('data-count');
            }
        });
    },
    
    // Показ уведомления
    showNotification(message) {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Показываем уведомление
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Скрываем и удаляем уведомление через 3 секунды
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    },
    
    // Получение всех товаров
    getItems() {
        return this.items;
    },
    
    // Удаление товара из корзины
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
        this.renderCart();
    },
    
    // Изменение количества товара
    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = newQuantity;
                this.save();
                this.renderCart();
            }
        }
    },
    
    // Увеличение количества товара
    increaseQuantity(productId) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity += 1;
            this.save();
            this.renderCart();
        }
    },
    
    // Уменьшение количества товара
    decreaseQuantity(productId) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (item.quantity > 1) {
                item.quantity -= 1;
                this.save();
                this.renderCart();
            } else {
                // Если количество равно 1, удаляем товар при нажатии на минус
                this.removeItem(productId);
            }
        }
    },
    
    // Получение общей суммы
    getTotalPrice() {
        return this.items.reduce((total, item) => {
            const priceStr = item.price.replace(/[^\d]/g, '').replace(/\s/g, '');
            const price = parseFloat(priceStr) || 0;
            return total + (price * item.quantity);
        }, 0);
    },
    
    // Форматирование цены
    formatPrice(price) {
        return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
    },
    
    // Отрисовка корзины
    renderCart() {
        const cartItemsContainer = document.getElementById('cartItems');
        const cartEmpty = document.getElementById('cartEmpty');
        const cartTotalPrice = document.getElementById('cartTotalPrice');
        const cartCheckoutBtn = document.getElementById('cartCheckoutBtn');
        
        if (!cartItemsContainer) return;
        
        // Очищаем контейнер
        cartItemsContainer.innerHTML = '';
        
        if (this.items.length === 0) {
            // Показываем сообщение о пустой корзине
            if (cartEmpty) {
                cartEmpty.classList.add('show');
            }
            if (cartCheckoutBtn) {
                cartCheckoutBtn.disabled = true;
            }
        } else {
            // Скрываем сообщение о пустой корзине
            if (cartEmpty) {
                cartEmpty.classList.remove('show');
            }
            if (cartCheckoutBtn) {
                cartCheckoutBtn.disabled = false;
            }
            
            // Отображаем товары
            this.items.forEach(item => {
                const cartItem = this.createCartItemElement(item);
                cartItemsContainer.appendChild(cartItem);
            });
        }
        
        // Обновляем общую сумму
        const total = this.getTotalPrice();
        if (cartTotalPrice) {
            cartTotalPrice.textContent = this.formatPrice(total);
        }
        
        this.updateCartCount();
    },
    
    // Создание элемента товара в корзине
    createCartItemElement(item) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.setAttribute('data-product-id', item.id);
        
        const priceStr = item.price.replace(/[^\d]/g, '').replace(/\s/g, '');
        const price = parseFloat(priceStr) || 0;
        const totalPrice = price * item.quantity;
        
        // Изображение товара
        const img = document.createElement('img');
        img.src = item.image || './IMG/logo1.jpg';
        img.alt = item.name;
        img.className = 'cart-item-image';
        img.onerror = function() { this.src = './IMG/logo1.jpg'; };
        
        // Контейнер информации
        const itemInfo = document.createElement('div');
        itemInfo.className = 'cart-item-info';
        
        // Название товара
        const title = document.createElement('h3');
        title.className = 'cart-item-title';
        title.textContent = item.name;
        
        // Цена товара
        const priceDiv = document.createElement('div');
        priceDiv.className = 'cart-item-price';
        priceDiv.textContent = this.formatPrice(price);
        
        // Контейнер действий
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'cart-item-actions';
        
        // Контейнер количества
        const quantityDiv = document.createElement('div');
        quantityDiv.className = 'cart-item-quantity';
        
        // Кнопка уменьшения
        const decreaseBtn = document.createElement('button');
        decreaseBtn.className = 'cart-quantity-btn';
        decreaseBtn.setAttribute('data-action', 'decrease');
        decreaseBtn.setAttribute('data-product-id', item.id);
        decreaseBtn.textContent = '-';
        decreaseBtn.type = 'button';
        
        // Значение количества
        const quantityValue = document.createElement('span');
        quantityValue.className = 'cart-quantity-value';
        quantityValue.textContent = item.quantity;
        
        // Кнопка увеличения
        const increaseBtn = document.createElement('button');
        increaseBtn.className = 'cart-quantity-btn';
        increaseBtn.setAttribute('data-action', 'increase');
        increaseBtn.setAttribute('data-product-id', item.id);
        increaseBtn.textContent = '+';
        increaseBtn.type = 'button';
        
        // Собираем контейнер количества
        quantityDiv.appendChild(decreaseBtn);
        quantityDiv.appendChild(quantityValue);
        quantityDiv.appendChild(increaseBtn);
        
        // Общая стоимость товара
        const totalDiv = document.createElement('div');
        totalDiv.className = 'cart-item-total';
        totalDiv.textContent = this.formatPrice(totalPrice);
        
        // Кнопка удаления
        const removeBtn = document.createElement('button');
        removeBtn.className = 'cart-item-remove';
        removeBtn.setAttribute('data-product-id', item.id);
        removeBtn.setAttribute('title', 'Удалить');
        removeBtn.type = 'button';
        const removeIcon = document.createElement('i');
        removeIcon.className = 'fas fa-trash';
        removeBtn.appendChild(removeIcon);
        
        // Собираем контейнер действий
        actionsDiv.appendChild(quantityDiv);
        actionsDiv.appendChild(totalDiv);
        actionsDiv.appendChild(removeBtn);
        
        // Собираем информацию о товаре
        itemInfo.appendChild(title);
        itemInfo.appendChild(priceDiv);
        itemInfo.appendChild(actionsDiv);
        
        // Собираем весь элемент
        cartItem.appendChild(img);
        cartItem.appendChild(itemInfo);
        
        return cartItem;
    },
    
    // Открытие модального окна корзины
    openCart() {
        const cartModal = document.getElementById('cartModal');
        if (cartModal) {
            cartModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.renderCart();
        }
    },
    
    // Закрытие модального окна корзины
    closeCart() {
        const cartModal = document.getElementById('cartModal');
        if (cartModal) {
            cartModal.classList.add('closing');
            setTimeout(() => {
                cartModal.classList.remove('active', 'closing');
                document.body.style.overflow = '';
            }, 300);
        }
    }
};

// Инициализация при загрузке страницы
$(document).ready(function() {
    console.log("Cart initialized");
    
    // Загружаем корзину из localStorage
    cart.load();
    
    // Обработчик клика на кнопки "Добавить в корзину"
    $(document).on('click', '.product__btn', function(e) {
        e.preventDefault();
        
        const $product = $(this).closest('.product');
        const productId = $product.attr('id') || 'product-' + Date.now();
        const productName = $product.find('.product__title a').text().trim();
        const productPrice = $product.find('.product-price__current').text().trim();
        
        // Получаем изображение товара
        const productImage = $product.find('.image-switch__img img').first().attr('src') || '';
        
        // Добавляем товар в корзину
        cart.addItem(productId, productName, productPrice, productImage);
        
        // Анимация кнопки
        $(this).text('Добавлено!').css({
            'background-color': '#4caf50',
            'transform': 'scale(0.95)'
        });
        
        setTimeout(() => {
            $(this).text('Добавить в корзину').css({
                'background-color': '',
                'transform': ''
            });
        }, 1000);
    });
    
    // Обработчик клика на ссылку корзины (работает для обеих версий)
    $(document).on('click', '.cart-link', function(e) {
        e.preventDefault();
        e.stopPropagation();
        cart.openCart();
        return false;
    });
    
    // Обработчик закрытия корзины по крестику
    $('#cartCloseBtn').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        cart.closeCart();
    });
    
    // Обработчик закрытия корзины по клику на overlay
    $('.cart-modal-overlay').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        cart.closeCart();
    });
    
    // Предотвращаем закрытие при клике на содержимое корзины (но не на кнопки)
    $('.cart-modal-content').on('click', function(e) {
        // Разрешаем всплытие для кнопок действий
        if ($(e.target).closest('.cart-quantity-btn, .cart-item-remove').length > 0) {
            return;
        }
        e.stopPropagation();
    });
    
    // Закрытие корзины по Escape
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') {
            cart.closeCart();
        }
    });
    
    // Обработчик изменения количества товаров
    $(document).on('click', '.cart-quantity-btn', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const action = $(this).data('action');
        const productId = $(this).data('product-id');
        
        if (action === 'increase') {
            cart.increaseQuantity(productId);
        } else if (action === 'decrease') {
            cart.decreaseQuantity(productId);
        }
        
        return false;
    });
    
    // Обработчик удаления товара (обработка клика на иконку тоже)
    $(document).on('click', '.cart-item-remove, .cart-item-remove i', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const $button = $(this).closest('.cart-item-remove');
        const productId = $button.data('product-id') || $(this).data('product-id');
        
        if (productId) {
            cart.removeItem(productId);
            cart.showNotification('Товар удален из корзины');
        }
        
        return false;
    });
    
    // Обработчик оформления заказа
    $('#cartCheckoutBtn').on('click', function(e) {
        e.preventDefault();
        if (cart.getTotalItems() > 0) {
            alert('Спасибо за заказ! Общая сумма: ' + cart.formatPrice(cart.getTotalPrice()));
            // Здесь можно добавить логику оформления заказа
        }
    });
});

