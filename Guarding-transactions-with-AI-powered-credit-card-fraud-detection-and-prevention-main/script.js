document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('transactionForm');
    const resultContainer = document.getElementById('resultContainer');
    const historyList = document.getElementById('historyList');

    // Set default timestamp to now
    document.getElementById('timestamp').value = new Date().toISOString().slice(0, 16);

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const transaction = {
            cardNumber: document.getElementById('cardNumber').value,
            amount: parseFloat(document.getElementById('amount').value),
            merchant: document.getElementById('merchant').value,
            location: document.getElementById('location').value,
            timestamp: document.getElementById('timestamp').value
        };

        checkFraud(transaction);
    });

    function checkFraud(transaction) {
        fetch('http://localhost:3000/check-fraud', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transaction)
        })
        .then(response => response.json())
        .then(data => {
            displayResult(data);
            loadTransactionHistory();
        })
        .catch(error => {
            console.error('Error:', error);
            resultContainer.innerHTML = `
                <div class="alert alert-danger">
                    Error processing transaction. Please try again.
                </div>
            `;
        });
    }

    function displayResult(data) {
        let resultClass = '';
        if (data.isFraud === 'Fraud') {
            resultClass = 'fraud';
        } else if (data.isFraud === 'Suspicious') {
            resultClass = 'suspicious';
        } else {
            resultClass = 'legitimate';
        }

        resultContainer.innerHTML = `
            <div>
                <h3 class="${resultClass}">${data.isFraud}</h3>
                <p>Confidence: ${(data.confidence * 100).toFixed(2)}%</p>
                <p>Amount: $${data.amount.toFixed(2)}</p>
                <p>Merchant: ${data.merchant}</p>
                <p>Location: ${data.location}</p>
                ${data.reason ? `<p class="text-muted">Reason: ${data.reason}</p>` : ''}
            </div>
        `;
    }

    function loadTransactionHistory() {
        fetch('http://localhost:3000/transactions')
            .then(response => response.json())
            .then(transactions => {
                historyList.innerHTML = '';
                transactions.slice(0, 5).forEach(tx => {
                    let itemClass = '';
                    if (tx.isFraud === 'Fraud') {
                        itemClass = 'fraud-item';
                    } else if (tx.isFraud === 'Suspicious') {
                        itemClass = 'suspicious-item';
                    } else {
                        itemClass = 'legitimate-item';
                    }

                    const txElement = document.createElement('div');
                    txElement.className = `list-group-item ${itemClass}`;
                    txElement.innerHTML = `
                        <div class="d-flex w-100 justify-content-between">
                            <h6 class="mb-1">${tx.merchant}</h6>
                            <small>$${tx.amount.toFixed(2)}</small>
                        </div>
                        <p class="mb-1">${tx.location} • ${new Date(tx.timestamp).toLocaleString()}</p>
                        <small class="${tx.isFraud === 'Fraud' ? 'text-danger' : tx.isFraud === 'Suspicious' ? 'text-warning' : 'text-success'}">
                            ${tx.isFraud} (${(tx.confidence * 100).toFixed(1)}%)
                        </small>
                    `;
                    historyList.appendChild(txElement);
                });
            })
            .catch(error => {
                console.error('Error loading transaction history:', error);
            });
    }

    // Load initial transaction history
    loadTransactionHistory();
});