// Valideer invoervelden en pas waarden aan indien buiten limieten
function validateInputOnBlur(inputElement) {
    const fieldId = inputElement.id;

    if (fieldId === "width") {
        validateWidth();
    }
}

// Valideer breedte afhankelijk van de uitval
function validateWidth() {
    const widthInput = document.getElementById("width");
    const projection = parseFloat(document.getElementById("projection").value) || 0;
    const minWidth = projection === 350 ? 410 : 360; // Minimum breedte afhankelijk van uitval
    const maxWidth = 600;
    let width = parseFloat(widthInput.value) || 0;

    if (width < minWidth) {
        showAdjustmentMessageInline(widthInput, width, minWidth, "minimale toegestane breedte voor de geselecteerde uitval");
        widthInput.value = minWidth;
    } else if (width > maxWidth) {
        showAdjustmentMessageInline(widthInput, width, maxWidth, "maximale toegestane breedte");
        widthInput.value = maxWidth;
    }
}

// Filter schakelaaropties op basis van het type motor
function updateSwitchOptions() {
    const motorType = document.getElementById("motor-type").value;
    const switchTypeSelect = document.getElementById("switch-type");

    const switchOptions = {
        "handbediend": ["Geen"],
        "standaard-schakelaar": ["Geen", "Inbouw draaischakelaar", "Opbouw draaischakelaar"],
        "somfy-schakelaar": ["Geen", "Inbouw draaischakelaar", "Opbouw draaischakelaar"],
        "standaard-afstandsbediening": ["Geen", "Draadloze muurschakelaar", "Afstandsbediening"],
        "somfy-afstandsbediening-rts": ["Geen", "Situo RTS 1-kanaal", "Situo RTS 5-kanaal", "Smoove RTS"],
        "somfy-afstandsbediening-io": ["Geen", "Situo IO 1-kanaal", "Situo IO 5-kanaal", "Smoove IO"]
    };

    console.log(`Motor type geselecteerd: ${motorType}`); // Debugging

    const allowedSwitches = switchOptions[motorType] || [];

    // Reset de opties in het select-element
    switchTypeSelect.innerHTML = "";

    if (allowedSwitches.length === 0) {
        console.warn(`Geen schakelaaropties gevonden voor motor type: ${motorType}`);
    }

    // Voeg de toegestane opties toe
    allowedSwitches.forEach((optionText) => {
        const optionElement = document.createElement("option");
        optionElement.value = optionText.toLowerCase().replace(/ /g, "-"); // Converteer naar lowercase en vervang spaties met streepjes
        optionElement.textContent = optionText;
        switchTypeSelect.appendChild(optionElement);
    });

    console.log(`Schakelaaropties bijgewerkt: ${allowedSwitches}`); // Debugging
}


// Zorg ervoor dat de schakelaaropties correct zijn bij het laden van de pagina
function initializeSwitchOptions() {
    updateSwitchOptions();
}

// Toon meldingen inline
function showAdjustmentMessageInline(inputElement, originalValue, newValue, limitType) {
    const fieldLabel = inputElement.id === "width" ? "Breedte" : "Waarde";
    const message = `De ${fieldLabel} is aangepast van ${originalValue} naar ${newValue}, omdat ${newValue} de ${limitType} is.`;

    let messageElement = inputElement.previousElementSibling;
    if (!messageElement || !messageElement.classList.contains("adjustment-message")) {
        messageElement = document.createElement("div");
        messageElement.className = "adjustment-message";
        messageElement.style.color = "red";
        messageElement.style.fontSize = "0.9em";
        messageElement.style.marginBottom = "5px";
        inputElement.parentNode.insertBefore(messageElement, inputElement);
    }

    messageElement.textContent = message;

    setTimeout(() => {
        if (messageElement) {
            messageElement.remove();
        }
    }, 5000);
}

// Update de prijs
function calculatePrice() {
    const width = parseFloat(document.getElementById("width").value) || 0;
    const projection = parseFloat(document.getElementById("projection").value) || 0;

    let basePrice = 0;

    if (width <= 500) {
        if (projection === 300) {
            basePrice = 1700;
        } else if (projection === 350) {
            basePrice = 2100;
        }
    } else if (width > 500 && width <= 600) {
        if (projection === 300 || projection === 350) {
            basePrice = 2350;
        }
    }

    const motorType = document.getElementById("motor-type").value;
    const installationType = document.getElementById("installation").value;
    const mountingType = document.getElementById("mounting-type").value;

    const motorPrices = {
        "handbediend": 0,
        "standaard-schakelaar": 50,
        "somfy-schakelaar": 150,
        "standaard-afstandsbediening": 100,
        "somfy-afstandsbediening-rts": 200,
        "somfy-afstandsbediening-io": 250,
    };

    const installationPrices = {
        "zonder": 0,
        "met": 300,
    };

    const mountingPrices = {
        "muurmontage": 0,
        "plafondmontage": 50,
    };

    const motorPrice = motorPrices[motorType] || 0;
    const installationPrice = installationPrices[installationType] || 0;
    const mountingPrice = mountingPrices[mountingType] || 0;

    const totalPrice = basePrice + motorPrice + installationPrice + mountingPrice;

    document.getElementById("price").textContent = `Totaalprijs: €${totalPrice.toFixed(2)}`;
    return totalPrice;
}

// Initialiseer de configurator
function initializeForm() {
    const widthInput = document.getElementById("width");
    const projectionSelect = document.getElementById("projection");

    // Voeg validatie en breedtecontrole toe bij wijziging van uitval
    projectionSelect.addEventListener("change", () => {
        validateWidth();
        calculatePrice();
    });

    // Voeg validatie en berekening toe aan breedteveld
    widthInput.addEventListener("blur", (event) => validateInputOnBlur(event.target));

    // Voeg berekening toe aan alle selectievakken
    ["motor-type", "fabric-color", "frame-color", "installation", "mounting-type"].forEach((id) => {
        document.getElementById(id).addEventListener("change", calculatePrice);
    });

    // Update de schakelaaropties wanneer het motortype verandert
    document.getElementById("motor-type").addEventListener("change", updateSwitchOptions);

    // Stel standaard de juiste schakelaaropties in bij het laden van de pagina
    initializeSwitchOptions();
}

// Start de configurator bij laden van de pagina
window.addEventListener("load", initializeForm);

const cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function initializeCart() {
    console.log("Winkelwagen initialiseren...");
    updateCart();
}

document.addEventListener('DOMContentLoaded', () => {
    initializeCart();
    attachCartEventListeners();
});

function addToCart() {
    console.log("addToCart aangeroepen"); // Debugging
    const widthInput = document.getElementById('width');
    const projectionInput = document.getElementById('projection');

    if (!widthInput || !projectionInput) {
        console.error("Belangrijke invoervelden ontbreken in de HTML.");
        return;
    }

    const width = parseFloat(widthInput?.value) || 0;
    const projection = parseFloat(projectionInput?.value) || 300; // Standaard uitval is 300

    const motorTypeElement = document.getElementById('motor-type');
    const motorType = motorTypeElement ? motorTypeElement.value : '';
    const motorTypeText = motorTypeElement ? motorTypeElement.options[motorTypeElement.selectedIndex].text : '';

    const switchType = document.getElementById('switch-type')?.value || '';
    const fabricColor = document.getElementById('fabric-color')?.value || '';
    const frameColor = document.getElementById('frame-color')?.value || '';
    const installation = document.getElementById('installation')?.value || '';
    const operationSide = document.getElementById('operation-side')?.value || '';
    const mountingType = document.getElementById('mounting-type')?.value || '';

    const inputErrorMessage = document.getElementById('input-error-message');
    const successMessage = document.getElementById('success-message');

    // Reset foutmeldingen en stijlen
    inputErrorMessage?.classList.add('hidden');

    // Controleer invoer
    if (!width) {
        if (inputErrorMessage) {
            inputErrorMessage.innerText = "Voer breedte in.";
            inputErrorMessage.classList.remove('hidden');
            setTimeout(() => inputErrorMessage.classList.add('hidden'), 3000);
        }
        console.warn("Breedte is niet geldig of ontbreekt."); // Debugging
        return;
    }

    const price = calculatePrice();
    if (!price || price <= 0) {
        console.warn("Prijsberekening is mislukt of ongeldig."); // Debugging
        return;
    }

    const item = {
        name: `Zonnescherm (${motorTypeText})`,
        type: 'zonnescherm', // Specifiek type product toevoegen
        width,
        projection,
        motorType,
        installation,
        switchType,
        fabricColor,
        frameColor,
        operationSide,
        mountingType,
        price: parseFloat(price.toFixed(2)),
        quantity: 1
    };

    console.log("Te voegen item:", item); // Debugging

    const existingItemIndex = cart.findIndex(cartItem => {
        return cartItem.type === item.type && // Controleer specifiek op producttype
               cartItem.width === item.width &&
               cartItem.projection === item.projection &&
               cartItem.motorType === item.motorType &&
               cartItem.installation === item.installation;
    });

    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity++;
        console.log(`Item al in winkelwagen. Aantal verhoogd:`, cart[existingItemIndex]); // Debugging
    } else {
        cart.push(item);
        console.log("Nieuw item toegevoegd aan winkelwagen."); // Debugging
    }

    saveCartToLocalStorage();
    updateCart();

    if (successMessage) {
        successMessage.innerText = "Succesvol toegevoegd aan winkelwagen!";
        successMessage.classList.remove('hidden');
        setTimeout(() => successMessage.classList.add('hidden'), 3000);
    }
}


function calculatePrice() {
    const widthInput = document.getElementById("width");
    const projectionInput = document.getElementById("projection");

    if (!widthInput || !projectionInput) {
        console.error("Belangrijke invoervelden ontbreken voor prijsberekening.");
        return 0;
    }

    const width = parseFloat(widthInput.value) || 0;
    const projection = parseFloat(projectionInput.value) || 0;

    let basePrice = 0;

    if (width <= 500) {
        if (projection === 300) {
            basePrice = 1700;
        } else if (projection === 350) {
            basePrice = 2100;
        }
    } else if (width > 500 && width <= 600) {
        if (projection === 300 || projection === 350) {
            basePrice = 2350;
        }
    }

    const motorTypeElement = document.getElementById("motor-type");
    const motorType = motorTypeElement ? motorTypeElement.value : '';

    const installationType = document.getElementById("installation")?.value || '';
    const mountingType = document.getElementById("mounting-type")?.value || '';

    const motorPrices = {
        "handbediend": 0,
        "standaard-schakelaar": 50,
        "somfy-schakelaar": 150,
        "standaard-afstandsbediening": 100,
        "somfy-afstandsbediening-rts": 200,
        "somfy-afstandsbediening-io": 250,
    };

    const installationPrices = {
        "zonder": 0,
        "met": 300,
    };

    const mountingPrices = {
        "muurmontage": 0,
        "plafondmontage": 50,
    };

    const motorPrice = motorPrices[motorType] || 0;
    const installationPrice = installationPrices[installationType] || 0;
    const mountingPrice = mountingPrices[mountingType] || 0;

    const totalPrice = basePrice + motorPrice + installationPrice + mountingPrice;

    console.log("Berekening van totaalprijs:", { basePrice, motorPrice, installationPrice, mountingPrice, totalPrice }); // Debugging

    document.getElementById("price").textContent = `Totaalprijs: €${totalPrice.toFixed(2)}`;
    return totalPrice;
}


function validateWidth(skipAdjustment = false) {
    const widthInput = document.getElementById('width');
    const projectionInput = document.getElementById('projection');
    const projection = parseFloat(projectionInput?.value) || 300; // Default uitval
    const minWidth = projection === 350 ? 410 : 360;
    const maxWidth = 600;
    let width = parseFloat(widthInput?.value) || 0;

    if (!skipAdjustment) {
        if (width < minWidth) {
            showAdjustmentMessageInline(widthInput, width, minWidth, "minimale toegestane breedte voor de geselecteerde uitval");
            widthInput.value = minWidth;
        } else if (width > maxWidth) {
            showAdjustmentMessageInline(widthInput, width, maxWidth, "maximale toegestane breedte");
            widthInput.value = maxWidth;
        }
    }
}

function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    cartItemsContainer.innerHTML = '';

    let total = 0;
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        let specs = '';
        if (item.type === 'zonnescherm') {
            specs = `Breedte: ${item.width} cm, Uitval: ${item.projection} cm`;
        } else if (item.type === 'rolluik') {
            specs = `Breedte: ${item.width} cm, Hoogte: ${item.height} cm,`;
        } else if (item.type === 'jaloezie') {
            specs = `Breedte: ${item.width} cm, Hoogte: ${item.height} cm, Kleur: ${item.color}, Materiaal: ${item.material}`;
        } else if (item.type === 'screen') {
            specs = `Breedte: ${item.width} cm, Hoogte: ${item.height} cm,`;
        }

        cartItem.innerHTML = `
            <div class="cart-item-details">
                <span class="cart-item-title">${item.name}</span>
                <span class="cart-item-specs">${specs}</span>
                <span class="cart-item-price">Prijs: €${(item.price * item.quantity).toFixed(2)}</span>
                <div class="quantity-controls">
                    <button onclick="decrementItem(${index})">-</button>
                    <input class="cart-quantity" type="text" value="${item.quantity}" readonly>
                    <button onclick="incrementItem(${index})">+</button>
                </div>
            </div>
            <button class="remove-item delete-btn" onclick="removeItem(${index})">&#10005;</button>
        `;
        cartItemsContainer.appendChild(cartItem);
        total += item.price * item.quantity;
    });

    totalPriceElement.innerText = `Totaal: €${total.toFixed(2)}`;
    saveCartToLocalStorage();
    updateMiniCartButton();
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
