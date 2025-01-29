// Initialiseer cart uit localStorage, of maak een lege array als er nog niets is opgeslagen
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Functie om een product toe te voegen aan de cart
function addToCart(product) {
    const existingProductIndex = cart.findIndex(item => (
        item.type === product.type &&
        item.width === product.width &&
        item.height === product.height &&
        item.motorType === product.motorType &&
        item.switchType === product.switchType &&
        item.installation === product.installation
    ));

    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += product.quantity;
    } else {
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

// Functie om dynamisch een product toe te voegen vanuit een formulier
function addProductToCartFromForm(type) {
    const getSelectedText = (name) => {
        const elements = document.getElementsByName(name);
        if (elements.length > 0 && elements[0].tagName === 'SELECT') {
            const selectedText = elements[0].options[elements[0].selectedIndex]?.text.trim() || "Niet opgegeven";
            return selectedText;
        }
        return "Niet opgegeven";
    };

    const product = {
        name: document.getElementById('product-name')?.value || `${type.charAt(0).toUpperCase() + type.slice(1)}`,
        type: type,
        price: parseFloat(document.getElementById('price')?.textContent.replace('Totaalprijs: €', '')) || 0,
        quantity: 1,
        width: `${parseFloat(document.getElementById('width')?.value) || ''} cm`,
        height: `${parseFloat(document.getElementById('height')?.value) || ''} cm`,
        projection: getSelectedText('projection'),
        fabricColor: getSelectedText('fabric-color'),
        frameColor: getSelectedText('frame-color'),
        motorType: getSelectedText('motor-type'),
        switchType: getSelectedText('switch-type'),
        operationSide: getSelectedText('operation-side'),
        mountingType: getSelectedText('mounting-type'),
        installation: getSelectedText('installation'),
        material: getSelectedText('material'),
        slatWidth: getSelectedText('slat-width'),
        color: getSelectedText('color'),
        ladder: getSelectedText('ladder'),
        operationType: getSelectedText('operation-type'),
        setup: getSelectedText('setup'),
        casingColor: getSelectedText('casing-color'),
        guideColor: getSelectedText('guide-color'),
        casingType: getSelectedText('casing-type'),
        guideType: getSelectedText('guide-type'),
        falseWindowsill: getSelectedText('false-windowsill'),
    };

    addToCart(product);
}

// Functie om de hoeveelheid van een product te wijzigen
function updateQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity < 1) cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }
}

// Functie om de cart te updaten en overzichtelijk weer te geven
function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.style.textAlign = 'center';
        emptyMessage.innerHTML = 'Uw cart is leeg. <a href="index.html">Ga naar onze producten</a> om te beginnen met winkelen!';
        cartItemsContainer.appendChild(emptyMessage);
        return;
    }

    const valueMappings = {
        motorType: {
            'standaard-schakelaar': 'Standaard schakelaar',
            'somfy-afstandsbediening-rts': 'Somfy afstandsbediening RTS',
            'somfy-afstandsbediening-io': 'Somfy afstandsbediening IO',
            'somfy-zonne-energie-io': 'Somfy Zonne-energie IO',
            'somfy-ilmo': 'Somfy Ilmo',
            'somfy-draadloos-rts': 'Somfy draadloos RTS',
            'somfy-draadloos-io': 'Somfy draadloos IO',
            'somfy-solar-rts': 'Somfy zonne-energie RTS',
            'somfy-solar-io': 'Somfy zonne-energie IO',
            'huismerk': 'Standaardmotor',
            'huismerk-afstandbediening': 'Standaardmotor afstandbediening',
            'huismerk-zonne-energie': 'Standaardmotor zonne-energie',
            'bandbediening': 'Bandbediening',
            'somfy-schakelaar': 'Somfy Schakelaar',
        },
        switchType: {
            'opbouw-draaischakelaar': 'Opbouw draaischakelaar',
            'inbouw-draaischakelaar': 'Inbouw draaischakelaar',
            'huismerk-afstandbediening-1kanaal': 'Standaard afstandsbediening 1-kanaal',
            'huismerk-afstandbediening-5kanaals': 'Standaard afstandsbediening 5-kanaals',
            'draadloze-muurschakelaar-1kanaal': 'Draadloze muurschakelaar 1-kanaal',
            'situo-1-pure-io': 'Situo 1 Pure IO',
            'situo-5-pure-io': 'Situo 5 Pure IO',
            'situo-rts-1kanaal': 'Situo RTS 1-kanaal',
            'situo-rts-5kanaals': 'Situo RTS 5-kanaals',
            'smoove-origin-1-io': 'Smoove Origin 1 IO',
            'smoove-origin-rts-1': 'Smoove Origin RTS 1',
            'geen': 'Geen',
        },
        slatColor: {
            'wit': 'Wit (RAL 9010)',
            'ultra-wit': 'Ultra wit (RAL 9016)',
            'creme-wit': 'Crème wit (RAL 9001)',
            'antraciet': 'Antraciet (RAL 7016)',
            'grijs': 'Grijs (RAL 7038)',
            'quartz': 'Quartz (RAL 7039)',
            'zilver': 'Zilver (RAL 9006)',
            'bruin': 'Bruin (RAL 8014)',
            'donkerbruin': 'Donkerbruin (RAL 8019)',
            'zwart': 'Zwart',
            'houtlook': 'Houtlook',
            'donkergrijs': 'Donkergrijs 5%',
            'lichtgrijs': 'Lichtgrijs 5%',
            'antraciet-5': 'Antraciet 5%',
            'zwart-5': 'Zwart 5%',
            'creme-wit-5': 'Creme wit 5%',
        },
        casingColor: {
            'wit': 'Wit (RAL 9010)',
            'ultra-wit': 'Ultra wit (RAL 9016)',
            'creme-wit': 'Crème wit (RAL 9001)',
            'antraciet': 'Antraciet (RAL 7016)',
            'grijs': 'Grijs (RAL 7038)',
            'quartz': 'Quartz (RAL 7039)',
            'zilver': 'Zilver (RAL 9006)',
            'bruin': 'Bruin (RAL 8014)',
            'donkerbruin': 'Donkerbruin (RAL 8019)',
            'zwart-grijs': 'Zwart grijs (RAL 7021)',
            'zwart': 'Zwart (RAL 9005)',
        },
        guideColor: {
            'wit': 'Wit (RAL 9010)',
            'ultra-wit': 'Ultra wit (RAL 9016)',
            'creme-wit': 'Crème wit (RAL 9001)',
            'antraciet': 'Antraciet (RAL 7016)',
            'grijs': 'Grijs (RAL 7038)',
            'quartz': 'Quartz (RAL 7039)',
            'zilver': 'Zilver (RAL 9006)',
            'bruin': 'Bruin (RAL 8014)',
            'donkerbruin': 'Donkerbruin (RAL 8019)',
            'zwart-grijs': 'Zwart grijs (RAL 7021)',
            'zwart': 'Zwart (RAL 9005)',
        },
        casingType: {
            'vierkant-afgeschuind': 'Vierkant afgeschuind',
            'half-rond': 'Half rond',
            'rond': 'Rond',
            'vierkant': 'Vierkant',
        },
        guideType: {
            'vlakke-geleiders': 'Vlakke geleiders: B 5,3 cm (standaard)',
            'hoekgeleiders-6cm': 'Hoekgeleiders: B 5,3 cm x D 6 cm (standaard)',
            'hoekgeleiders-12cm': 'Hoekgeleiders: B 5,3 cm x D 12 cm',
            'afstand-geleiders-1.2cm': 'Afstand geleiders: 1,2 cm (5,3 cm)',
            'afstand-geleiders-2cm': 'Afstand geleiders: 2,0 cm (5,3 cm)',
            'vlakke-en-hoek-6cm': '1x vlakke geleider: B 5,3 cm, 1x hoekgeleider: B 5,3 cm x D 6 cm',
            'hoek-6cm-en-hoek-12cm': '1x hoekgeleider: B 5,3 cm x D 6 cm, 1x hoekgeleider: B 5,3 cm x D 12 cm',
            'vlakke-geleiders-4.5cm': 'Vlakke geleiders: B 4,5 cm',
            'vlakke-geleider': 'Vlakke geleider B 3,75cm x D 2,9cm',
            'hoekgeleider': 'Hoekgeleider B 3,75cm x D 5,85cm',
        },
        falseWindowsill: {
            'geen': 'Geen',
            '20x30': '20x30 mm',
            '20x70': '20x70 mm',
        },
        mountingType: {
            'muurmontage': 'Muurmontage',
            'plafondmontage': 'Plafondmontage',
            'wand': 'Wandmontage',
            'zonder': 'Zonder montage',
            'met': 'Met montage',
        },
        setup: {
            'zelf': 'Zelf monteren',
            'montage': 'Met montage',
        },
        operationSide: {
            'links': 'Links',
            'rechts': 'Rechts',
            'linksboven': 'Links boven',
            'linksonder': 'Links onder',
            'rechtsboven': 'Rechts boven',
            'rechtsonder': 'Rechts onder',
        },
    };
  
    let totaalPrijs = 0;

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.style.display = 'grid';
        cartItem.style.gridTemplateColumns = '3fr 2fr';
        cartItem.style.gap = '20px';
        cartItem.style.borderBottom = '1px solid #ddd';
        cartItem.style.padding = '20px 0';

        let propertiesHTML = `<div>`;
        propertiesHTML += `<strong style="font-size: 1.2em; display: block;">${item.name}</strong>`;
        propertiesHTML += `<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">`;

        const mapValue = (key, value) => valueMappings[key]?.[value] || value;

        // Rijtje 1: Breedte, Kastkleur, Geleiderkleur, Lamellenkleur
        if (item.width) propertiesHTML += `<div style="font-size: 0.9em;"><strong>Breedte:</strong> ${item.width}</div>`;
        if (item.casingColor) propertiesHTML += `<div style="font-size: 0.9em;"><strong>Kastkleur:</strong> ${mapValue('casingColor', item.casingColor)}</div>`;
        if (item.guideColor) propertiesHTML += `<div style="font-size: 0.9em;"><strong>Geleiderkleur:</strong> ${mapValue('guideColor', item.guideColor)}</div>`;
        if (item.slatColor) propertiesHTML += `<div style="font-size: 0.9em;"><strong>Lamellenkleur:</strong> ${mapValue('slatColor', item.slatColor)}</div>`;

        // Rijtje 2: Hoogte, Type kast, Type motor, Type schakelaar
        if (item.height) propertiesHTML += `<div style="font-size: 0.9em;"><strong>Hoogte:</strong> ${item.height}</div>`;
        if (item.casingType) propertiesHTML += `<div style="font-size: 0.9em;"><strong>Type kast:</strong> ${item.casingType}</div>`;
        if (item.motorType) propertiesHTML += `<div style="font-size: 0.9em;"><strong>Type motor:</strong> ${mapValue('motorType', item.motorType)}</div>`;
        if (item.switchType) propertiesHTML += `<div style="font-size: 0.9em;"><strong>Type schakelaar:</strong> ${mapValue('switchType', item.switchType)}</div>`;

        // Rijtje 3: Bedieningszijde, Vals vensterbank, Installatie
        if (item.operationSide) propertiesHTML += `<div style="font-size: 0.9em;"><strong>Bedieningszijde:</strong> ${item.operationSide}</div>`;
        if (item.falseWindowsill) propertiesHTML += `<div style="font-size: 0.9em;"><strong>Vals vensterbank:</strong> ${item.falseWindowsill}</div>`;
        if (item.installation) propertiesHTML += `<div style="font-size: 0.9em;"><strong>Installatie:</strong> ${item.installation}</div>`;

        propertiesHTML += `</div></div>`;

        cartItem.innerHTML = `
            <div>${propertiesHTML}</div>
            <div style="display: flex; flex-direction: column; gap: 10px; align-items: flex-end; justify-content: center;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span><strong>Aantal:</strong></span>
                    <div style="display: flex; align-items: center; border: 1px solid #ccc; border-radius: 5px; padding: 2px 4px; background: #f8f8f8;">
                        <button onclick="updateQuantity(${index}, -1)" style="background: #ddd; border: none; font-size: 12px; cursor: pointer; padding: 4px 6px;">&minus;</button>
                        <strong style="min-width: 20px; text-align: center; font-size: 14px; padding: 0 8px;">${item.quantity}</strong>
                        <button onclick="updateQuantity(${index}, 1)" style="background: #ddd; border: none; font-size: 12px; cursor: pointer; padding: 4px 6px;">&plus;</button>
                    </div>
                    <div style="margin-left: 10px; font-size: 0.9em;"><strong>Prijs:</strong> €${(item.price * item.quantity).toFixed(2)}</div>
                    <button onclick="removeFromCart(${index})" style="background: none; border: none; cursor: pointer; font-size: 14px; color: red; margin-left: 10px;">&#10005;</button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);

        totaalPrijs += item.price * item.quantity;
    });

    const totaalElement = document.createElement('div');
    totaalElement.style.marginTop = '20px';
    totaalElement.style.fontWeight = 'bold';
    totaalElement.style.textAlign = 'right';
    totaalElement.innerHTML = `Totaal: €${totaalPrijs.toFixed(2)}`;
    cartItemsContainer.appendChild(totaalElement);
}

// Item verwijderen uit cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

// Voeg een product toe via een formulierknop
function initializeAddToCartButtons() {
    document.getElementById('add-rolluik-btn')?.addEventListener('click', () => addProductToCartFromForm('rolluiken'));
    document.getElementById('add-jaloezie-btn')?.addEventListener('click', () => addProductToCartFromForm('jaloezieën'));
    document.getElementById('add-screen-btn')?.addEventListener('click', () => addProductToCartFromForm('screen'));
    document.getElementById('add-sunshade-btn')?.addEventListener('click', () => addProductToCartFromForm('zonnescherm'));
}

window.onload = () => {
    updateCart();
    initializeAddToCartButtons();
};
