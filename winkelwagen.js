// winkelwagen.js

// Winkelwagen array
let winkelwagen = [];

// Functie om de winkelwagen bij te werken
function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Reset de inhoud

    if (winkelwagen.length === 0) {
        // Bericht weergeven als de winkelwagen leeg is
        const emptyMessage = document.createElement('p');
        emptyMessage.style.textAlign = 'center';
        emptyMessage.innerHTML = 'Uw winkelwagen is leeg. <a href="index.html">Ga naar onze producten</a> om te beginnen met winkelen!';
        cartItemsContainer.appendChild(emptyMessage);
        return;
    }

    let totaalPrijs = 0;

    // Winkelwagen items tonen
    winkelwagen.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <p><strong>${item.name}</strong></p>
            <p>Aantal: ${item.quantity}</p>
            <p>Prijs: €${(item.price * item.quantity).toFixed(2)}</p>
            <button onclick="removeFromCart(${index})">Verwijderen</button>
        `;
        cartItemsContainer.appendChild(cartItem);

        totaalPrijs += item.price * item.quantity;
    });

    // Totaalprijs weergeven
    const totaalElement = document.createElement('p');
    totaalElement.innerHTML = `<strong>Totaal: €${totaalPrijs.toFixed(2)}</strong>`;
    cartItemsContainer.appendChild(totaalElement);
}

// Item verwijderen uit winkelwagen
function removeFromCart(index) {
    winkelwagen.splice(index, 1); // Verwijder het item
    updateCart(); // Update de winkelwagen
}

// Afrekenfunctionaliteit (voor nu een placeholder)
function checkout() {
    if (winkelwagen.length === 0) {
        // Foutmelding tonen
        const cartItemsContainer = document.getElementById('cart-items');
        const errorMessage = document.createElement('div');
        errorMessage.style.textAlign = 'center';
        errorMessage.style.padding = '15px';
        errorMessage.style.backgroundColor = '#f8d7da'; // Roze achtergrond
        errorMessage.style.color = '#721c24'; // Rode tekst
        errorMessage.style.border = '1px solid #f5c6cb';
        errorMessage.style.borderRadius = '5px';
        errorMessage.style.marginTop = '20px';
        errorMessage.textContent = 'Uw winkelwagen is leeg. Voeg eerst producten toe.';
        cartItemsContainer.prepend(errorMessage);

        // Foutmelding na 3 seconden verwijderen
        setTimeout(() => {
            errorMessage.remove();
        }, 3000);
        return;
    }
    alert('Bedankt voor uw bestelling! Deze functie wordt binnenkort toegevoegd.');
}

// Simuleer een item toevoegen aan de winkelwagen voor demonstratie
function addToCartDemo() {
    const demoItem = {
        name: 'Voorbeeldproduct',
        price: 49.99,
        quantity: 1
    };
    winkelwagen.push(demoItem);
    updateCart();
}

// Voeg een voorbeelditem toe bij het laden van de pagina
window.onload = () => {
    updateCart(); // Controleer de winkelwagenstatus bij het laden van de pagina
};
