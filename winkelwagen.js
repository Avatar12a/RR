// Initialiseer cart uit localStorage, of maak een lege array als er nog niets is opgeslagen
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Functie om een product toe te voegen aan de cart
function addToCart(product) {
    // Controleren of product al in cart zit
    const existingProductIndex = cart.findIndex(item => {
        return (
            item.type === product.type &&
            item.width === product.width &&
            item.height === product.height &&
            item.motorType === product.motorType &&
            item.switchType === product.switchType &&
            item.installation === product.installation
        );
    });
    if (existingProductIndex > -1) {
        // Verhoog de hoeveelheid als het product al bestaat
        cart[existingProductIndex].quantity += product.quantity;
    } else {
        // Voeg nieuw product toe
        cart.push(product);
    }

    // Sla de bijgewerkte cart op in localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart(); // Update de weergave van de cart
}

// Functie om dynamisch een product toe te voegen vanuit een formulier
function addProductToCartFromForm(type) {
    const getSelectedText = (name) => {
        const elements = document.getElementsByName(name);
        if (elements.length > 0 && elements[0].tagName === 'SELECT') {
            const selectedText = elements[0].options[elements[0].selectedIndex]?.text.trim() || "Niet opgegeven";
            console.log(`Geselecteerde tekst voor ${name}: ${selectedText}`); // Debugging
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

    console.log('Product toegevoegd aan cart:', product); // Debugging
    addToCart(product);
}

// Functie om de cart te updaten en weer te geven
function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    console.log('Container gevonden:', cartItemsContainer); // Debugging

    cartItemsContainer.innerHTML = ''; // Reset de inhoud

    if (cart.length === 0) {
        console.log('Cart is leeg.'); // Debugging
        const emptyMessage = document.createElement('p');
        emptyMessage.style.textAlign = 'center';
        emptyMessage.innerHTML = 'Uw cart is leeg. <a href="index.html">Ga naar onze producten</a> om te beginnen met winkelen!';
        cartItemsContainer.appendChild(emptyMessage);
        return;
    }

    let totaalPrijs = 0;

    // Mapping van veldnamen naar labels
    const labels = {
        motorType: 'Motor',
        switchType: 'Schakelaar',
        slatColor: 'Kleur lamellen',
        casingColor: 'Kleur omkasting',
        guideColor: 'Kleur geleider en onderlat',
        casingType: 'Type omkasting',
        guideType: 'Type geleider',
        operationSide: 'Bedieningszijde',
        falseWindowsill: 'Vals vensterbank',
        installation: 'Montage',
        material: 'Materiaal',
        slatWidth: 'Breedte lamellen',
        ladder: 'Ladder',
        operationType: 'Bedieningstype',
        setup: 'Installatie',
        width: 'Breedte',
        height: 'Hoogte',
        projection: 'Uitval',
        fabricColor: 'Kleur doek',
        frameColor: 'Kleur frame',
        mountingType: 'Montagewijze',
        color: 'Kleur',
    };

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
    
    
    cart.forEach((item, index) => {
        console.log(`Item weergegeven: ${item.name}, Prijs: €${item.price}, Aantal: ${item.quantity}`); // Debugging
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.style.display = 'grid';
        cartItem.style.gridTemplateColumns = '2fr 1fr 1fr 1fr';
        cartItem.style.gap = '10px';
        cartItem.style.alignItems = 'center';
        cartItem.style.borderBottom = '1px solid #ddd';
        cartItem.style.padding = '10px 0';

        let propertiesHTML = `<strong>${item.name}</strong>`;
        Object.entries(item).forEach(([key, value]) => {
            if (value && key !== 'type' && key !== 'name' && key !== 'price' && key !== 'quantity') {
                const label = labels[key] || key; // Gebruik de mapping of fallback naar de key zelf
                const mappedValue = valueMappings[key]?.[value] || value; // Gebruik value mapping indien beschikbaar
                propertiesHTML += `<p>${label}: ${mappedValue}</p>`;
            }
        });

        cartItem.innerHTML = `
            <div>${propertiesHTML}</div>
            <div>Aantal: ${item.quantity}</div>
            <div>Prijs: €${(item.price * item.quantity).toFixed(2)}</div>
            <button onclick="removeFromCart(${index})" style="background-color: red; color: white; border: none; padding: 5px 10px; cursor: pointer;">Verwijderen</button>
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

    console.log(`Totaalprijs bijgewerkt: €${totaalPrijs.toFixed(2)}`); // Debugging
}

// Item verwijderen uit cart
function removeFromCart(index) {
    cart.splice(index, 1); // Verwijder het item
    localStorage.setItem('cart', JSON.stringify(cart)); // Werk localStorage bij
    updateCart(); // Update de cart
}

// Voeg een product toe via een formulierknop
function initializeAddToCartButtons() {
    document.getElementById('add-rolluik-btn')?.addEventListener('click', () => addProductToCartFromForm('rolluiken'));
    document.getElementById('add-jaloezie-btn')?.addEventListener('click', () => addProductToCartFromForm('jaloezieën'));
    document.getElementById('add-screen-btn')?.addEventListener('click', () => addProductToCartFromForm('screen'));
    document.getElementById('add-sunshade-btn')?.addEventListener('click', () => addProductToCartFromForm('zonnescherm'));
}

// Voeg een voorbeelditem toe bij het laden van de pagina
window.onload = () => {
    updateCart(); // Controleer de cart-status bij het laden van de pagina
    initializeAddToCartButtons();
};
