document.getElementById('purchaseForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Získání hodnot z formuláře
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const product = document.getElementById('product').value;
    const price = parseFloat(document.getElementById('price').value);
    const quantity = parseInt(document.getElementById('quantity').value);

    // Validace ceny
    if (price <= 0) {
        alert("Cena musí být větší než 0.");
        return;
    }

    // Validace e-mailu
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Prosím, zadejte platnou e-mailovou adresu.");
        return;
    }

    // Výpočet cen
    const totalPrice = (price / 1.21) * quantity;
    const vat = totalPrice * 0.21;
    const totalPriceWithVAT = totalPrice + vat;
    const priceWithoutVAT = price / 1.21;

    // Rekapitulace
    document.getElementById('summaryName').textContent = 'Jméno: ' + name;
    document.getElementById('summaryEmail').textContent = 'E-Mail: ' + email;
    document.getElementById('summaryProduct').textContent = 'Název: ' + product;
    document.getElementById('pieces').textContent = 'Množství: ' + quantity + ' Ks';
    document.getElementById('priceWithoutVAT').textContent = '1 Ks bez DPH: ' + priceWithoutVAT.toFixed(2) + ' Kč';
    document.getElementById('summaryPrice').textContent = 'Celkem bez DPH: ' + totalPrice.toFixed(2) + ' Kč';
    document.getElementById('summaryVAT').textContent = 'DPH 21%: ' + vat.toFixed(2) + ' Kč';

    // Získání aktuálního data
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Leden je 0
    const year = today.getFullYear();
    const currentDate = `${day}.${month}.${year}`;

    // Načtení kurzu z proxy serveru na Cloud Run
    fetch(`https://YOUR_CLOUD_RUN_URL/kurzy?date=${day}.${month}.${year}`)
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            const eurLine = lines.find(line => line.includes('EUR'));
            if (eurLine) {
                const eurRate = parseFloat(eurLine.split('|')[4].replace(',', '.'));

                const totalPriceInEUR = totalPriceWithVAT / eurRate;
                document.getElementById('summaryTotalEUR').textContent = totalPriceWithVAT.toFixed(2) + ' Kč  |  ' + totalPriceInEUR.toFixed(2) + ' Eur';
                document.getElementById('rateEUR').textContent = `(Kurz ČNB, ze dne ${currentDate}: ${eurRate.toFixed(2)} Kč / €1,-)`;
            } else {
                alert('Kurz EUR nebyl nalezen.');
            }
        })
        .catch(error => {
            console.error('Chyba při načítání dat z proxy serveru:', error);
            alert('Nepodařilo se načíst kurzovní lístek.');
        });

    document.getElementById('summary').style.display = 'block';
});

document.getElementById('resetButton').addEventListener('click', function () {
    // Reset rekapitulace
    document.getElementById('summaryName').textContent = '';
    document.getElementById('summaryEmail').textContent = '';
    document.getElementById('priceWithoutVAT').textContent = '';
    document.getElementById('summaryProduct').textContent = '';
    document.getElementById('pieces').textContent = '';
    document.getElementById('summaryPrice').textContent = '';
    document.getElementById('summaryVAT').textContent = '';
    document.getElementById('rateEUR').textContent = '';
    document.getElementById('summaryTotalEUR').textContent = '';
});