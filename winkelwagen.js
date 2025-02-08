// Initialiseer cart uit localStorage, of maak een lege array als er nog niets is opgeslagen
let cart;
try {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
} catch (e) {
    console.error("Fout bij het parsen van cart uit localStorage:", e);
    cart = [];
}

// Mappings voor vertalingen van eigenschapnamen
const propertyMappings = {
    motorType: 'Type motor',
    switchType: 'Type schakelaar',
    slatColor: {
        'jaloezieën': 'Kleur lamellen',
        'rolluiken': 'Kleur lamellen',
        'screen': 'Kleur doek', // Aangepast voor screens
        'zonnescherm': 'Kleur lamellen',
    },
    casingColor: 'Kleur kast',
    guideColor: 'Kleur geleider',
    casingType: 'Type kast',
    guideType: 'Type geleider',
    falseWindowsill: 'Valse vensterbank',
    mountingType: 'Type montage',
    installation: 'Installatie',
    operationSide: 'Bedieningszijde',
    projection: 'Uitval',
    frameColor: 'Kleur frame',
    fabricColor: 'Kleur doek',
    material: 'Materiaal',
    color: 'Kleur',
    ladder: 'Ladder',
    operationType: 'Type bediening',
    setup: 'Opstelling',
    installationMethod: 'Installatiemethode',
    slatWidth: 'Breedte lamellen',
    slatColor: 'Kleur lamellen',
    casingHeight: 'Hoogte kast',
    guideHeight: 'Hoogte geleider',
    width: 'Breedte', // Toegevoegd voor breedte
    height: 'Hoogte', // Toegevoegd voor hoogte
};

// Mappings voor vertalingen van waarden
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
        'antraciet': 'Antraciet 5%',
        'zwart': 'Zwart 5%',
        'creme-wit': 'Creme wit 5%',
    },
    screenSlatColor: {
        'donkergrijs': 'Donkergrijs 5%',
        'lichtgrijs': 'Lichtgrijs 5%',
        'antraciet': 'Antraciet 5%',
        'zwart': 'Zwart 5%',
        'creme-wit': 'Creme wit 5%',
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
    },
    installation: {
        'zonder': 'Zonder montage',
        'met': 'Met montage',
        'zelf': 'Zonder Montage',
        'montage': 'Met montage',
    },
    operationSide: {
        'links': 'Links',
        'rechts': 'Rechts',
        'linksboven': 'Links boven',
        'linksonder': 'Links onder',
        'rechtsboven': 'Rechts boven',
        'rechtsonder': 'Rechts onder',
        'links-door-geleider': 'Links door de Geleider',
        'rechts-door-geleider': 'Rechts door de Geleider'
    },
    projection: {
        '300': '300 cm',
        '350': '350 cm'
    },
    frameColor: {
        'wit': 'Wit (RAL 9010)',
        'antraciet': 'Antraciet (RAL 7016)',
        'zilver': 'Zilver (RAL 9006)',
    },
    fabricColor: {
        'zwart': 'Zwart',
        'antraciet': 'Antraciet',
        'beige': 'Beige',
        'donkerrood': 'Donkerrood',
        'donkerblauw': 'Donkerblauw',
        'donkergroen': 'Donkergroen',
    },
    material: {
        'hout': 'Hout',
        'aluminium': 'Aluminium',
    },
    color: {
        'wit': 'Wit',
        'zwart': 'Zwart',
        'antraciet': 'Antraciet',
        'houtlook': 'Houtlook',
        'grijs': 'Grijs',
    },
    ladder: {
        'ladderband25': 'Ladderband 2,5 cm',
        'ladderband38': 'Ladderband 3,8 cm',
        'ladderkoord': 'Ladderkoord',
    },
    operationType: {
        'handbediend': 'Handbediend',
        'elektrisch': 'Elektrisch',
    },
    setup: {
        'zelf': 'Zelf monteren',
        'montage': 'Met montage',
    },
    installationMethod: {
        'wand': 'Wandmontage',
        'plafond': 'Plafondmontage',
    }
};

// Functie om een product toe te voegen aan de cart
function addToCart(product) {
    if (!product || !product.type || !product.width || !product.height) {
        console.error("Ongeldig product object:", product);
        return;
    }

    const existingProductIndex = cart.findIndex(item => (
        item.type === product.type &&
        item.width === product.width &&
        item.height === product.height &&
        (product.motorType ? item.motorType === product.motorType : true) &&
        (product.switchType ? item.switchType === product.switchType : true) &&
        (product.installation ? item.installation === product.installation : true)
    ));

    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += product.quantity;
    } else {
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

// Functie om een product toe te voegen vanuit een formulier
function addProductToCartFromForm(type) {
    const getValue = (name) => {
        const element = document.querySelector(`[name="${name}"]`);
        if (!element) return "Niet opgegeven";
        if (element.tagName === 'SELECT') {
            return element.options[element.selectedIndex]?.value || "Niet opgegeven";
        }
        return element.value || "Niet opgegeven";
    };

    const getMappedText = (name) => {
        const value = getValue(name);
        const mapping = valueMappings[name] || {};
        return mapping[value] || value;
    };

    const product = {
        name: document.getElementById('product-name')?.value || `${type.charAt(0).toUpperCase() + type.slice(1)}`,
        type: type,
        price: parseFloat(document.getElementById('price')?.textContent.replace('Totaalprijs: €', '')) || 0,
        quantity: 1,
        width: `${document.getElementById('width')?.value || ''} cm`,
        height: `${document.getElementById('height')?.value || ''} cm`,
    };

    // Product-specifieke eigenschappen
    switch (type) {
        case 'jaloezieën':
            product.material = getMappedText('material');
            product.slatWidth = getMappedText('slat-width');
            product.color = getMappedText('slatColor');
            product.ladder = getMappedText('ladder');
            product.operationType = getMappedText('operation-type');
            product.operationSide = getMappedText('operation-side');
            product.installationMethod = getMappedText('installationMethod');
            product.setup = getMappedText('setup');
            break;

        case 'rolluiken':
            product.casingHeight = `${document.getElementById('casing-height')?.value || ''} cm`;
            product.guideHeight = `${document.getElementById('guide-height')?.value || ''} cm`;
            product.slatColor = getMappedText('slat-color');
            product.casingColor = getMappedText('casing-color');
            product.guideColor = getMappedText('guide-color');
            product.motorType = getMappedText('motor-type');
            product.switchType = getMappedText('switch-type');
            product.operationSide = getMappedText('operation-side');
            product.casingType = getMappedText('casing-type');
            product.guideType = getMappedText('guide-type');
            product.falseWindowsill = getMappedText('false-windowsill');
            product.installation = getMappedText('installation');
            break;

        case 'screen':
            product.casingHeight = `${document.getElementById('casing-height')?.value || ''} cm`;
            product.guideHeight = `${document.getElementById('guide-height')?.value || ''} cm`;
            product.slatColor = getMappedText('screenSlatColor'); // Gebruik de nieuwe mapping voor screens
            product.casingColor = getMappedText('casing-color');
            product.guideColor = getMappedText('guide-color');
            product.motorType = getMappedText('motor-type');
            product.switchType = getMappedText('switch-type');
            product.operationSide = getMappedText('operation-side');
            product.casingType = getMappedText('casing-type');
            product.guideType = getMappedText('guide-type');
            product.falseWindowsill = getMappedText('false-windowsill');
            product.installation = getMappedText('installation');
            break;

        case 'zonnescherm':
            product.projection = getMappedText('projection');
            product.fabricColor = getMappedText('fabric-color');
            product.frameColor = getMappedText('frame-color');
            product.motorType = getMappedText('motor-type');
            product.switchType = getMappedText('switch-type');
            product.operationSide = getMappedText('operation-side');
            product.mountingType = getMappedText('mounting-type');
            product.installation = getMappedText('installation');
            break;
    }

    console.log("Product toegevoegd aan winkelwagen:", product); // Debugging
    addToCart(product);
}

// Functie om de winkelwagen weer te geven
function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';
    let totaalPrijs = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <p class="empty-cart-message">
                Uw cart is leeg. <a href="index.html">Ga naar onze producten</a>
            </p>
        `;
        return;
    }

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        // Productnaam als titel boven de eigenschappen
        const productName = `<div class="product-name"><strong>${item.name}</strong></div>`;

        // Eigenschappen dynamisch genereren
        let propertiesHTML = `<div class="cart-item-properties">`;

        Object.entries(item).forEach(([key, value]) => {
            if (['name', 'price', 'quantity', 'type'].includes(key)) return;

            // Vertaal de eigenschapnaam en waarde indien nodig
            const translatedKey = typeof propertyMappings[key] === 'object' 
                ? propertyMappings[key][item.type] || key 
                : propertyMappings[key] || key;
            let translatedValue = valueMappings[key]?.[value] || value;

            // Voeg "cm" toe aan "hoogte" en "breedte", behalve bij "breedte lamellen"
            if ((key === 'width' || key === 'height') && !key.includes('slatWidth')) {
                translatedValue += ' cm';
            }

            propertiesHTML += `
                <div>
                    <strong>${translatedKey}:</strong> 
                    ${translatedValue}
                </div>
            `;
        });

        propertiesHTML += `</div>`;

        // Voeg de productnaam en eigenschappen samen
        cartItem.innerHTML = `
            ${productName}
            ${propertiesHTML}
            <div class="cart-item-actions">
                <div>
                    <span><strong>Aantal:</strong></span>
                    <div>
                        <button onclick="updateQuantity(${index}, -1)">−</button>
                        <strong>${item.quantity}</strong>
                        <button onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                    <div><strong>Prijs:</strong> €${(item.price * item.quantity).toFixed(2)}</div>
                    <button class="remove-btn" onclick="removeFromCart(${index})">×</button>
                </div>
            </div>
        `;

        cartItemsContainer.appendChild(cartItem);
        totaalPrijs += item.price * item.quantity;
    });

    // Totaalprijs toevoegen
    const totalElement = document.createElement('div');
    totalElement.className = 'total-price';
    totalElement.innerHTML = `Totaal: €${totaalPrijs.toFixed(2)}`;
    cartItemsContainer.appendChild(totalElement);
}

// Functie om een product te verwijderen
function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }
}

// Functie om de hoeveelheid van een product bij te werken
function updateQuantity(index, change) {
    if (index >= 0 && index < cart.length) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }
}

// Initialiseer knoppen
function initializeAddToCartButtons() {
    document.getElementById('add-rolluik-btn')?.addEventListener('click', () => addProductToCartFromForm('rolluiken'));
    document.getElementById('add-jaloezie-btn')?.addEventListener('click', () => addProductToCartFromForm('jaloezieën'));
    document.getElementById('add-screen-btn')?.addEventListener('click', () => addProductToCartFromForm('screen'));
    document.getElementById('add-sunshade-btn')?.addEventListener('click', () => addProductToCartFromForm('zonnescherm'));
}


// Start de winkelwagen
window.onload = () => {
    updateCart();
    initializeAddToCartButtons();
};
