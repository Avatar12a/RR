document.addEventListener("DOMContentLoaded", () => {
    const priceContainer = document.getElementById("price");
    const errorMessageContainer = document.getElementById("error-message");

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCart(); // Zorg ervoor dat de winkelwageninhoud direct zichtbaar is

    // Formule voor elektrische jaloezieën
    function calculateElectricPrice(height, width) {
        return Math.max(0, (
            76.16 -
            3.66 * height +
            54.09 * width +
            0.60 * Math.pow(height, 2) +
            69.49 * height * width +
            7.82 * Math.pow(width, 2)
        ).toFixed(2));
    }

    // Formule voor handbediende jaloezieën
    function calculateManualPrice(height, width) {
        return Math.max(0, (
            50.89 -
            11.24 * height +
            36.25 * width +
            0.41 * Math.pow(height, 2) +
            64.32 * height * width +
            5.34 * Math.pow(width, 2) -
            0.30 * Math.pow(height, 3) +
            1.28 * Math.pow(height, 2) * width +
            0.91 * height * Math.pow(width, 2) -
            0.23 * Math.pow(width, 3)
        ).toFixed(2));
    }

    // Maximale hoogtes per breedte
    function getMaxHeight(width) {
        if (width <= 1.9) return 3.0;
        if (width <= 2.0) return 2.9;
        if (width <= 2.1) return 2.8;
        if (width <= 2.2) return 2.7;
        if (width <= 2.3) return 2.6;
        if (width <= 2.4) return 2.5;
        if (width <= 2.5) return 2.4;
        if (width <= 2.6) return 2.3;
        if (width <= 2.7) return 2.2;
        if (width <= 2.8) return 2.0;
        return 0; // Onmogelijk
    }

    function validateHeight() {
        const heightInput = document.getElementById("height");
        const widthInput = document.getElementById("width");
        let height = parseFloat(heightInput.value) / 100;
        const width = parseFloat(widthInput.value) / 100;

        // Reset foutmelding
        errorMessageContainer.textContent = "";
        errorMessageContainer.classList.add("hidden");

        // Controleer of er een geldige hoogte is ingevoerd
        if (isNaN(height) || height <= 0) {
            calculatePrice();
            return; // Doe niets als het invoerveld leeg is of een ongeldige waarde heeft
        }

        // Controleer limieten voor hoogte
        if (!isNaN(width) && width > 0) {
            const maxHeight = getMaxHeight(width);
            if (height > maxHeight) {
                heightInput.value = (maxHeight * 100).toFixed(0);
                errorMessageContainer.textContent = `Hoogte is automatisch teruggezet naar ${(maxHeight * 100).toFixed(0)} cm omdat dit de maximale hoogte is voor deze breedte.`;
                errorMessageContainer.classList.remove("hidden");
                setTimeout(() => errorMessageContainer.classList.add("hidden"), 5000);
            } else if (height < 0.4) {
                height = 0.4;
                heightInput.value = (height * 100).toFixed(0);
                errorMessageContainer.textContent = `Hoogte is automatisch teruggezet naar 40 cm omdat dit de minimale hoogte is.`;
                errorMessageContainer.classList.remove("hidden");
                setTimeout(() => errorMessageContainer.classList.add("hidden"), 5000);
            }
        }
        calculatePrice();
    }

    function validateWidth() {
        const widthInput = document.getElementById("width");
        const heightInput = document.getElementById("height");
        const min = parseFloat(widthInput.min);
        const max = parseFloat(widthInput.max);
        let width = parseFloat(widthInput.value);

        // Reset foutmelding
        errorMessageContainer.textContent = "";
        errorMessageContainer.classList.add("hidden");

        // Controleer of er een geldige breedte is ingevoerd
        if (isNaN(width) || width <= 0) {
            calculatePrice();
            return; // Doe niets als het invoerveld leeg is of een ongeldige waarde heeft
        }

        // Controleer breedte en stel deze in op de limieten indien nodig
        if (width < min) {
            widthInput.value = min;
            errorMessageContainer.textContent = `Breedte is automatisch teruggezet naar ${min} cm omdat dit de minimale breedte is.`;
            errorMessageContainer.classList.remove("hidden");
            setTimeout(() => errorMessageContainer.classList.add("hidden"), 5000);
        } else if (width > max) {
            widthInput.value = max;
            errorMessageContainer.textContent = `Breedte is automatisch teruggezet naar ${max} cm omdat dit de maximale breedte is.`;
            errorMessageContainer.classList.remove("hidden");
            setTimeout(() => errorMessageContainer.classList.add("hidden"), 5000);
        }

        // Controleer hoogte na aanpassing van de breedte
        const adjustedWidth = parseFloat(widthInput.value) / 100;
        const maxHeight = getMaxHeight(adjustedWidth);
        let height = parseFloat(heightInput.value) / 100;
        if (height > maxHeight) {
            heightInput.value = (maxHeight * 100).toFixed(0);
            errorMessageContainer.textContent += ` Hoogte is aangepast naar ${(maxHeight * 100).toFixed(0)} cm omdat dit de maximale hoogte is voor deze breedte.`;
            errorMessageContainer.classList.remove("hidden");
            setTimeout(() => errorMessageContainer.classList.add("hidden"), 5000);
        } else if (height < 0.4) {
            height = 0.4;
            heightInput.value = (height * 100).toFixed(0);
            errorMessageContainer.textContent += ` Hoogte is aangepast naar 40 cm omdat dit de minimale hoogte is.`;
            errorMessageContainer.classList.remove("hidden");
            setTimeout(() => errorMessageContainer.classList.add("hidden"), 5000);
        }
        calculatePrice();
    }

    function calculatePrice() {
        const widthInput = document.getElementById("width");
        const width = parseFloat(widthInput.value) / 100; // Breedte in meters
        const heightInput = document.getElementById("height");
        let height = parseFloat(heightInput.value) / 100; // Hoogte in meters
        const operationType = document.getElementById("operation-type").value;
        const installationType = document.getElementById("setup").value; // Installatiekeuze
        const installationMethod = document.getElementById("installation").value; // Montagewijze

        // Controleer op geldige invoer
        if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
            priceContainer.textContent = "Totaalprijs: €0.00";
            return;
        }

        let basePrice;

        if (operationType === "elektrisch") {
            basePrice = calculateElectricPrice(height, width);
        } else {
            basePrice = calculateManualPrice(height, width);
        }

        let totalPrice = Math.max(0, parseFloat(basePrice));

        // Toeslag voor installatie
        if (installationType === "montage") {
            totalPrice = Math.max(0, totalPrice + 50); // €50 voor installatie
        }

        priceContainer.textContent = `Totaalprijs: €${totalPrice.toFixed(2)}`;
        return totalPrice; // Return price for use in addToCart
    }

    function saveCartToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function initializeCart() {
        console.log("Winkelwagen wordt geïnitialiseerd...");
        updateCart(); // Toon direct de winkelwagen
    }

    function addToCart() {
        console.log("addToCart aangeroepen"); // Debugging
        const widthInput = document.getElementById('width');
        const heightInput = document.getElementById('height');
        const width = parseFloat(widthInput?.value) || 0;
        const height = parseFloat(heightInput?.value) || 0;
        const color = document.getElementById('color')?.value || '';
        const operationType = document.getElementById('operation-type')?.value || '';
        const installation = document.getElementById('setup')?.value || '';
        const installationMethod = document.getElementById('installation')?.value || '';
        const material = document.getElementById('material')?.value || '';
        const slatWidth = document.getElementById('slat-width')?.value || '';
        const ladder = document.getElementById('ladder')?.value || '';
    
        const inputErrorMessage = document.getElementById('input-error-message');
        const successMessage = document.getElementById('success-message');
    
        // Reset foutmeldingen en stijlen
        inputErrorMessage?.classList.add('hidden');
    
        // Controleer invoer
        if (!width || !height) {
            if (inputErrorMessage) {
                inputErrorMessage.innerText = "Voer zowel breedte als hoogte in.";
                inputErrorMessage.classList.remove('hidden');
                setTimeout(() => inputErrorMessage.classList.add('hidden'), 3000);
            }
            return;
        }
    
        // Bereken prijs
        const price = calculatePrice();
        if (!price) return;
    
        const item = {
            name: "Jaloezieën",
            width,
            height,
            color,
            operationType,
            installation,
            installationMethod,
            material,
            slatWidth,
            ladder,
            price: parseFloat(price),
            quantity: 1
        };
    
        console.log("Product item:", item); // Debugging
    
        const existingItemIndex = cart.findIndex(cartItem => {
            return cartItem.width === item.width &&
                cartItem.height === item.height &&
                cartItem.color === item.color &&
                cartItem.operationType === item.operationType &&
                cartItem.installation === item.installation &&
                cartItem.installationMethod === item.installationMethod &&
                cartItem.material === item.material &&
                cartItem.slatWidth === item.slatWidth &&
                cartItem.ladder === item.ladder;
        });
    
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity++;
        } else {
            cart.push(item);
        }
    
        console.log("Cart array na toevoegen:", cart); // Debugging
        saveCartToLocalStorage();
        updateCart();
    
        // Toon succesmelding
        if (successMessage) {
            successMessage.innerText = "Succesvol toegevoegd aan winkelwagen!";
            successMessage.classList.remove('hidden');
            setTimeout(() => successMessage.classList.add('hidden'), 3000);
        }
    }
    
    // Winkelwagen updaten
    function updateCart() {
        console.log("updateCart aangeroepen"); // Debugging
        const cartItems = document.getElementById('cart-items');
        const totalPriceElement = document.getElementById('total-price');
    
        if (!cartItems) {
            console.error("Element 'cart-items' niet gevonden in de DOM.");
            return;
        }
        if (!totalPriceElement) {
            console.error("Element 'total-price' niet gevonden in de DOM.");
            return;
        }
    
        cartItems.innerHTML = ''; // Reset inhoud
        let total = 0;
    
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-details">
                    <span class="cart-item-title">${item.name}</span>
                    <span class="cart-item-specs">Breedte: ${item.width} cm, Hoogte: ${item.height} cm, Kleur: ${item.color}</span>
                    <span class="cart-item-price">Prijs: €${(item.price * item.quantity).toFixed(2)}</span>
                    <div class="quantity-controls">
                        <button class="decrement-btn" data-index="${index}">-</button>
                        <input class="cart-quantity" type="text" value="${item.quantity}" readonly>
                        <button class="increment-btn" data-index="${index}">+</button>
                    </div>
                </div>
                <button class="remove-item delete-btn" data-index="${index}">&#10005;</button>
            `;
            cartItems.appendChild(cartItem);
            total += item.price * item.quantity;
        });
    
        totalPriceElement.innerText = `Totaal: €${total.toFixed(2)}`;
        console.log("Winkelwagen succesvol bijgewerkt.");
        attachCartEventListeners();
        updateMiniCartButton();
    }
    
    function attachCartEventListeners() {
        document.querySelectorAll(".increment-btn").forEach(button => {
            button.addEventListener("click", () => {
                const index = parseInt(button.dataset.index, 10);
                incrementItem(index);
            });
        });
    
        document.querySelectorAll(".decrement-btn").forEach(button => {
            button.addEventListener("click", () => {
                const index = parseInt(button.dataset.index, 10);
                decrementItem(index);
            });
        });
    
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", () => {
                const index = parseInt(button.dataset.index, 10);
                removeItem(index);
            });
        });
    }
    
    function updateMiniCartButton() {
        const cartButton = document.getElementById('cart-button');
    
        if (!cartButton) {
            console.warn("Cart button niet gevonden!");
            return;
        }
    
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
        cartButton.innerHTML = `🛒 ${totalItems} producten - €${totalPrice.toFixed(2)}`;
        console.log("Mini-winkelwagen bijgewerkt:", { totalItems, totalPrice });
    }
    
    function incrementItem(index) {
        if (cart[index]) {
            cart[index].quantity++;
            saveCartToLocalStorage();
            updateCart();
        }
    }
    
    function decrementItem(index) {
        if (cart[index]) {
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            } else {
                cart.splice(index, 1);
            }
            saveCartToLocalStorage();
            updateCart();
        }
    }
    
    function removeItem(index) {
        if (cart[index]) {
            cart.splice(index, 1);
            saveCartToLocalStorage();
            updateCart();
        }
    }
    
    
    function displayLocalStorageContent() {
        const localStorageContent = document.getElementById('local-storage-content');
        if (localStorageContent) {
            localStorageContent.innerText = JSON.stringify(cart, null, 2);
        } else {
            console.log("localStorage inhoud (geen element gevonden):", cart);
        }
    }
    
    document.querySelectorAll("#configurator input, #configurator select").forEach((input) => {
        input.addEventListener("input", calculatePrice);
        input.addEventListener("change", calculatePrice);

    });
    
    document.getElementById("width")?.addEventListener("blur", validateWidth);
    document.getElementById("height")?.addEventListener("blur", validateHeight);
    document.getElementById("add-to-cart-button")?.addEventListener("click", addToCart);
    
    calculatePrice(); 
    
    console.log("Cart bij laden:", cart);

});
