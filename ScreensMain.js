// Schakel alleen zichtbare opties in of uit op basis van geselecteerde motor
function updateSwitchOptions() {
    const motorType = document.getElementById('motor-type').value;
    const switchType = document.getElementById('switch-type');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const motorTypeSelect = document.getElementById('motor-type');

    let dimensionsCorrected = false;

    const switchOptions = {
        "somfy-afstandsbediening-rts": [
            { value: "geen", text: "Geen" },
            { value: "situo-rts-1kanaal", text: "Situo RTS 1-kanaal" },
            { value: "situo-rts-5kanaals", text: "Situo RTS 5-kanaals" },
            { value: "smoove-origin-rts-1", text: "Smoove Origin RTS 1" }
        ],
        "somfy-afstandsbediening-io": [
            { value: "geen", text: "Geen" },
            { value: "situo-io-1kanaal", text: "Situo IO 1-kanaal" },
            { value: "situo-io-5kanaals", text: "Situo IO 5-kanaals" },
            { value: "smoove-origin-io-1", text: "Smoove Origin IO 1" }
        ],
        "somfy-zonne-energie-io": [
            { value: "geen", text: "Geen" },
            { value: "situo-io-1kanaal", text: "Situo IO 1-kanaal" },
            { value: "situo-io-5kanaals", text: "Situo IO 5-kanaals" },
            { value: "smoove-origin-io-1", text: "Smoove Origin IO 1" }
        ],
        "somfy-schakelaar": [
            { value: "geen", text: "Geen" },
            { value: "inbouw-draaischakelaar", text: "Inbouw Draaischakelaar" },
            { value: "opbouw-draaischakelaar", text: "Opbouw Draaischakelaar" }
        ]
    };

    switchType.innerHTML = "";

    const allowedSwitches = switchOptions[motorType] || [];
    allowedSwitches.forEach(optionData => {
        const option = document.createElement('option');
        option.value = optionData.value;
        option.textContent = optionData.text;
        switchType.appendChild(option);
    });

    switchType.value = "geen";

    if (motorType === "somfy-zonne-energie-io") {
        const width = parseFloat(widthInput.value) || 0;
        const height = parseFloat(heightInput.value) || 0;

        // Controleer en pas breedte aan
        if (width < 80) {
            widthInput.value = 80;
            showAdjustmentMessageInline(widthInput, width, 80, "minimale toegestane waarde");
            dimensionsCorrected = true;
        } else if (width > 300) {
            const correctedWidth = 300;
            widthInput.value = correctedWidth;
            showAdjustmentMessageInline(widthInput, width, correctedWidth, "maximale toegestane waarde");
            dimensionsCorrected = true;
        }

        // Controleer en pas hoogte aan
        if (height < 20) {
            heightInput.value = 20;
            showAdjustmentMessageInline(heightInput, height, 20, "minimale toegestane waarde");
            dimensionsCorrected = true;
        } else if (height > 240) {
            const correctedHeight = 240;
            heightInput.value = correctedHeight;
            showAdjustmentMessageInline(heightInput, height, correctedHeight, "maximale toegestane waarde");
            dimensionsCorrected = true;
        }

        // Toon melding bij motorkeuze als afmetingen zijn aangepast
        if (dimensionsCorrected) {
            showMotorTypeAdjustmentMessage(motorTypeSelect, "Controleer afmetingen: sommige waarden zijn aangepast om te voldoen aan de limieten van Somfy Zonne-energie IO.");
        }
    }
}

// Functie om een melding boven het motortype-selectievak te tonen
function showMotorTypeAdjustmentMessage(referenceElement, message) {
    let messageElement = referenceElement.previousElementSibling;

    if (!messageElement || !messageElement.classList.contains('motor-type-message')) {
        messageElement = document.createElement('div');
        messageElement.className = 'motor-type-message';
        messageElement.style.color = 'red';
        messageElement.style.fontSize = '0.9em';
        messageElement.style.marginBottom = '5px';
        referenceElement.parentNode.insertBefore(messageElement, referenceElement);
    }

    messageElement.textContent = message;

    // Verwijder de melding na 5 seconden
    setTimeout(() => {
        if (messageElement) {
            messageElement.remove();
        }
    }, 5000);
}



function showAdjustmentMessageInline(inputElement, originalValue, newValue, limitType) {
    // Stel de juiste veldnaam in
    const fieldLabel = inputElement.id === 'width' ? 'breedte' : 'hoogte';
    const message = `De ${fieldLabel} is aangepast van ${originalValue} naar ${newValue}, omdat ${newValue} de ${limitType} toegestane waarde is.`;

    // Zoek of er al een melding aanwezig is boven dit veld
    let messageElement = inputElement.previousElementSibling;
    if (!messageElement || !messageElement.classList.contains('adjustment-message')) {
        // Maak een nieuwe melding aan als deze niet bestaat
        messageElement = document.createElement('div');
        messageElement.className = 'adjustment-message';
        messageElement.style.color = 'red';
        messageElement.style.fontSize = '0.9em';
        messageElement.style.marginBottom = '5px';
        inputElement.parentNode.insertBefore(messageElement, inputElement);
    }

    // Stel de meldingstekst in
    messageElement.textContent = message;

    // Verwijder de melding na 5 seconden
    setTimeout(() => {
        if (messageElement) messageElement.remove();
    }, 5000);
}

// Gebruik deze functie binnen je validatielogica
function validateInputOnBlur(inputElement) {
    const motorType = document.getElementById('motor-type').value;
    const isHeight = inputElement.id === 'height';

    const minValue = isHeight ? 20 : motorType === 'somfy-zonne-energie-io' ? 80 : 64;
    const maxValue = isHeight ? (motorType === 'somfy-zonne-energie-io' ? 240 : 500) : (motorType === 'somfy-zonne-energie-io' ? 300 : 600);

    if (inputElement.value.trim() === "") {
        return;
    }

    const originalValue = parseFloat(inputElement.value) || 0;

    if (originalValue < minValue) {
        showAdjustmentMessageInline(inputElement, originalValue, minValue, 'minimale');
        inputElement.value = minValue;
    } else if (originalValue > maxValue) {
        showAdjustmentMessageInline(inputElement, originalValue, maxValue, 'maximale');
        inputElement.value = maxValue;
    }

    // Aanroepen van gerelateerde updates
    if (isHeight) {
        updateCasingHeight(parseFloat(inputElement.value));
        updateGuideHeight(parseFloat(inputElement.value));
    } else {
        adjustHeightIfNecessary(parseFloat(inputElement.value));
    }

    validateDimensions(
        parseFloat(document.getElementById('width').value),
        parseFloat(document.getElementById('height').value)
    );
    calculatePrice();
}


function initializeForm() {
    document.getElementById('motor-type').addEventListener('change', updateSwitchOptions);
    document.getElementById('width').addEventListener('blur', (event) => validateInputOnBlur(event.target));
    updateSwitchOptions();
}

window.addEventListener('load', initializeForm);


function handleHeightChange(inputElement) {
    const value = parseFloat(inputElement.value) || 0;

    updateCasingHeight(value);
    updateGuideHeight(value);
}

function adjustHeightIfNecessary(width) {
    const heightInput = document.getElementById('height');
    const motorType = document.getElementById('motor-type').value;
    const heightMax = motorType === 'somfy-zonne-energie-io' ? 240 : 500;

    let height = parseFloat(heightInput.value) || 0;

    if ((width > 300 && width <= 350 && height > 450) ||
        (width > 350 && width <= 400 && height > 400) ||
        (width > 400 && height > 300)) {
        heightInput.value = heightMax;
        showAdjustmentMessageInline(heightInput, height, heightMax, 'maximale toegestane waarde');
        updateCasingHeight(heightMax);
        updateGuideHeight(heightMax);
        validateDimensions(width, heightMax);
    }
}


function validateWidthAndAdjustHeight(widthInput) {
    const width = parseFloat(widthInput.value) || 0;
    validateInputOnBlur(widthInput);
    adjustHeightIfNecessary(width);
}

function updateCasingHeight(height) {
    const casingHeightInput = document.getElementById('casing-height');

    if (height <= 290) {
        casingHeightInput.value = 9.5;
    } else if (height <= 339) {
        casingHeightInput.value = 10.5;
    } else {
        casingHeightInput.value = 12.5;
    }

    const motorType = document.getElementById('motor-type').value;
    if (motorType === 'somfy-zonne-energie-io') {
        casingHeightInput.value = 12.5;
    }
}

function updateGuideHeight(height) {
    const casingHeight = parseFloat(document.getElementById('casing-height').value) || 0;
    const guideHeightInput = document.getElementById('guide-height');

    if (height && casingHeight) {
        const guideHeight = height - casingHeight;
        guideHeightInput.value = guideHeight > 0 ? guideHeight.toFixed(1) : "";
    } else {
        guideHeightInput.value = "";
    }
}

function validateDimensions(width, height) {
    const motorType = document.getElementById('motor-type').value;
    const errorMessage = document.getElementById('error-message');
    errorMessage.classList.add('hidden');

    let maxHeight;
    if (width > 300 && width <= 350) {
        maxHeight = 450;
    } else if (width > 350 && width <= 400) {
        maxHeight = 400;
    } else if (width > 400) {
        maxHeight = 300;
    } else {
        // Gebruik de standaard limieten als er geen specifieke regels zijn
        maxHeight = motorType === 'somfy-zonne-energie-io' ? 240 : 500;
    }

    const minWidth = motorType === 'somfy-zonne-energie-io' ? 80 : 64;
    const maxWidth = motorType === 'somfy-zonne-energie-io' ? 300 : 600;

    // Validatie van breedte
    if (width < minWidth || width > maxWidth) {
        errorMessage.textContent = `Breedte moet tussen ${minWidth} en ${maxWidth} cm liggen.`;
        errorMessage.classList.remove('hidden');
        return false;
    }

    // Validatie van hoogte
    if (height > maxHeight) {
        const originalHeight = height;
        height = maxHeight; // Pas hoogte aan naar situatie-specifieke maximum
        document.getElementById('height').value = height; // Update veld

        showAdjustmentMessageInline(
            document.getElementById('height'),
            originalHeight,
            maxHeight,
            `maximale toegestane waarde voor een breedte van ${width}`
        );
    }

    // Als alles klopt, geef true terug
    return true;
}

function validateHeightAndWidthOnInput(inputElement) {
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');

    const motorType = document.getElementById('motor-type').value;

    let width = parseFloat(widthInput.value) || 0;
    let height = parseFloat(heightInput.value) || 0;

    // Situatie-specifieke limieten
    let maxHeight, maxWidth;
    if (width > 300 && width <= 350) {
        maxHeight = 450;
    } else if (width > 350 && width <= 400) {
        maxHeight = 400;
    } else if (width > 400) {
        maxHeight = 300;
    } else {
        maxHeight = motorType === 'somfy-zonne-energie-io' ? 240 : 500;
    }

    if (height > 450 && height <= 500) {
        maxWidth = 300;
    } else if (height > 400 && height <= 450) {
        maxWidth = 350;
    } else if (height > 300 && height <= 400) {
        maxWidth = 400;
    } else {
        maxWidth = motorType === 'somfy-zonne-energie-io' ? 300 : 600;
    }

    const minWidth = motorType === 'somfy-zonne-energie-io' ? 80 : 64;
    const minHeight = 20;

    // Controleer en corrigeer breedte
    if (inputElement.id === 'height' || inputElement.id === 'width') {
        if (width > maxWidth) {
            showAdjustmentMessageInline(widthInput, width, maxWidth, `maximale toegestane waarde voor een hoogte van ${height}`);
            width = maxWidth;
            widthInput.value = maxWidth;
        } else if (width < minWidth) {
            showAdjustmentMessageInline(widthInput, width, minWidth, 'minimale');
            width = minWidth;
            widthInput.value = minWidth;
        }
    }

    // Controleer en corrigeer hoogte
    if (inputElement.id === 'width' || inputElement.id === 'height') {
        if (height > maxHeight) {
            showAdjustmentMessageInline(heightInput, height, maxHeight, `maximale toegestane waarde voor een breedte van ${width}`);
            height = maxHeight;
            heightInput.value = maxHeight;
        } else if (height < minHeight) {
            showAdjustmentMessageInline(heightInput, height, minHeight, 'minimale');
            height = minHeight;
            heightInput.value = minHeight;
        }
    }

    // Update functies
    updateCasingHeight(height);
    updateGuideHeight(height);
    validateDimensions(width, height);
    calculatePrice();

    return true; // Geldige combinatie
}


// Initialiseer de event listeners
function initializeForm() {
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');

    // Valideer altijd beide velden na elke wijziging
    widthInput.addEventListener('input', () => validateHeightAndWidthOnInput(widthInput));
    heightInput.addEventListener('input', () => validateHeightAndWidthOnInput(heightInput));
}



function calculatePrice() {
    const width = parseFloat(document.getElementById('width').value) || 0;
    const height = parseFloat(document.getElementById('height').value) || 0;
    const area = (width / 100) * (height / 100);

    const motorType = document.getElementById('motor-type').value;
    const switchType = document.getElementById('switch-type').value;
    const falseWindowsill = document.getElementById('false-windowsill')?.value || "geen";
    const installation = document.getElementById('installation')?.value || "geen";

    const basePrice = area * 60;

    const motorPrices = {
        "somfy-afstandsbediening-rts": 150,
        "somfy-afstandsbediening-io": 200,
        "somfy-zonne-energie-io": 400,
        "somfy-schakelaar": 50
    };

    const switchPrices = {
        "geen": 0,
        "draaischakelaar": 20,
        "afstandsbediening-1kanaal": 50,
        "afstandsbediening-5kanaal": 80,
        "inbouw-draaischakelaar": 30,
        "opbouw-draaischakelaar": 40,
        "situo-rts-1kanaal": 45,
        "situo-rts-5kanaals": 65,
        "smoove-origin-rts-1": 35,
        "situo-io-1kanaal": 45,
        "situo-io-5kanaals": 65,
        "smoove-origin-io-1": 35
    };

    const falseWindowsillPrice = falseWindowsill !== "geen" ? 25 : 0;
    const installationPrice = installation === "met" ? 250 : 0;

    const totalPrice = basePrice +
        (motorPrices[motorType] || 0) +
        (switchPrices[switchType] || 0) +
        falseWindowsillPrice +
        installationPrice;

    document.getElementById('price').textContent = `Totaalprijs: €${totalPrice.toFixed(2)}`;
    return totalPrice;
}

function initializeForm() {
    document.getElementById('motor-type').addEventListener('change', updateSwitchOptions);
    document.getElementById('width').addEventListener('blur', (event) => validateInputOnBlur(event.target));
    
    const heightField = document.getElementById('height');
    heightField.addEventListener('input', (event) => handleHeightChange(event.target));
    heightField.addEventListener('blur', (event) => validateInputOnBlur(event.target));

    updateSwitchOptions();
}

window.addEventListener('load', initializeForm);

const cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Initialiseer winkelwagen bij het laden van de pagina
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
    const heightInput = document.getElementById('height');
    const width = parseFloat(widthInput?.value) || 0;
    const height = parseFloat(heightInput?.value) || 0;
    const motorType = document.getElementById('motor-type')?.value || '';
    const switchType = document.getElementById('switch-type')?.value || '';
    const falseWindowsill = document.getElementById('false-windowsill')?.value || '';
    const installation = document.getElementById('installation')?.value || '';
    const operationSide = document.getElementById('operation-side')?.value || '';
    const casingColor = document.getElementById('casing-color')?.value || '';
    const guideColor = document.getElementById('guide-color')?.value || '';
    const slatColor = document.getElementById('slat-color')?.value || '';
    const casingType = document.getElementById('casing-type')?.value || '';
    const guideType = document.getElementById('guide-type')?.value || '';

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

    const formattedMotorType = motorType
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const item = {
        name: `Screen (${formattedMotorType})`,
        width,
        height,
        motorType,
        switchType,
        falseWindowsill,
        installation,
        operationSide,
        casingColor,
        guideColor,
        slatColor,
        casingType,
        guideType,
        price: price.toFixed(2),
        quantity: 1
    };

    console.log("Product item:", item); // Debugging

    const existingItemIndex = cart.findIndex(cartItem => {
        return cartItem.width === item.width &&
            cartItem.height === item.height &&
            cartItem.motorType === item.motorType &&
            cartItem.switchType === item.switchType &&
            cartItem.falseWindowsill === item.falseWindowsill &&
            cartItem.installation === item.installation &&
            cartItem.operationSide === item.operationSide &&
            cartItem.casingColor === item.casingColor &&
            cartItem.guideColor === item.guideColor &&
            cartItem.slatColor === item.slatColor &&
            cartItem.casingType === item.casingType &&
            cartItem.guideType === item.guideType;
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
    if (!cartItems) {
        console.error("Winkelwagencontainer niet gevonden!");
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
                <span class="cart-item-specs">Breedte: ${item.width} cm, Hoogte: ${item.height} cm</span>
                <span class="cart-item-price">Prijs: €${(item.price * item.quantity).toFixed(2)}</span>
                <div class="quantity-controls">
                    <button onclick="decrementItem(${index})">-</button>
                    <input class="cart-quantity" type="text" value="${item.quantity}" readonly>
                    <button onclick="incrementItem(${index})">+</button>
                </div>
            </div>
            <button class="remove-item delete-btn" onclick="removeItem(${index})">&#10005;</button>
        `;
        cartItems.appendChild(cartItem);
        total += item.price * item.quantity;
    });

    console.log("Totaal na updateCart:", total); // Debugging
    const totalPriceElement = document.getElementById('total-price');
    if (totalPriceElement) {
        totalPriceElement.innerText = `Totaal: €${total.toFixed(2)}`;
    }

    saveCartToLocalStorage();
    updateMiniCartButton();
}

function updateMiniCartButton() {
    const cartButton = document.getElementById('cart-button');

    // Controleer of de knop aanwezig is
    if (!cartButton) {
        console.warn("Cart button niet gevonden!");
        return;
    }

    // Bereken het totale aantal items en prijs
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Update de inhoud van de knop
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
            cart.splice(index, 1); // Verwijder item als hoeveelheid 0 wordt
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

document.querySelectorAll("#configurator input, #configurator select").forEach((input) => {
    input.addEventListener("input", calculatePrice);
    input.addEventListener("change", calculatePrice);
});

document.getElementById("width")?.addEventListener("blur", validateWidth);
document.getElementById("height")?.addEventListener("blur", validateHeight);
document.getElementById("add-to-cart-button")?.addEventListener("click", addToCart);

calculatePrice();
