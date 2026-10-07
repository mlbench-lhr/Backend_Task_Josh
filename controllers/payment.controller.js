const { v4: uuidv4 } = require('uuid');
const db = require('../utils/db');

const createIntent = (req, res) => {
    const { propertyId, userId, amount, currency } = req.body;
    const idempotencyKey = req.headers['idempotency-key'];

    // 1. Validation Logic
    if (!propertyId || !userId || !amount || !currency) {
        return res.status(400).json({ error: 'Missing required fields: propertyId, userId, amount, currency' });
    }

    if (amount <= 0) {
        return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    // 2. Idempotency Check
    if (idempotencyKey) {
        const idempotencyKeys = db.getIdempotencyKeys();
        if (idempotencyKeys[idempotencyKey]) {
            console.log('Idempotency hit:', idempotencyKey);
            return res.status(200).json(idempotencyKeys[idempotencyKey]);
        }
    }

    // 3. Duplicate Payment Check
    const transactions = db.getTransactions();
    const existingTransaction = transactions.find(t =>
        t.userId === userId &&
        t.propertyId === propertyId &&
        (t.status === 'PENDING' || t.status === 'COMPLETED')
    );

    if (existingTransaction) {
        return res.status(409).json({
            error: 'Duplicate payment',
            message: 'User has already initiated or completed payment for this property.',
            transactionId: existingTransaction.id
        });
    }

    // 4. Create Intent (Mock Payment Provider)
    // In a real scenario, we would call Stripe/PayPal here.
    const paymentIntentId = 'pi_' + uuidv4().replace(/-/g, '').substring(0, 24);
    const clientSecret = paymentIntentId + '_secret_' + uuidv4().replace(/-/g, '').substring(0, 10);

    const newTransaction = {
        id: uuidv4(),
        propertyId,
        userId,
        amount,
        currency,
        status: 'PENDING',
        paymentIntentId,
        createdAt: new Date().toISOString()
    };

    // 5. Store Transaction & Idempotency Key
    transactions.push(newTransaction);
    db.saveTransactions(transactions);

    const response = {
        clientSecret,
        paymentIntentId,
        status: 'PENDING'
    };

    if (idempotencyKey) {
        const idempotencyKeys = db.getIdempotencyKeys();
        idempotencyKeys[idempotencyKey] = response;
        db.saveIdempotencyKeys(idempotencyKeys);
    }

    return res.status(201).json(response);
};

module.exports = {
    createIntent
};
