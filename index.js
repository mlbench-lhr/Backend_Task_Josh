const express = require('express');
const bodyParser = require('body-parser');
const paymentRoutes = require('./routes/payment.routes');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}
// Ensure data files exist
const transactionsPath = path.join(dataDir, 'transactions.json');
if (!fs.existsSync(transactionsPath)) {
    fs.writeFileSync(transactionsPath, '[]');
}
const idempotencyPath = path.join(dataDir, 'idempotency.json');
if (!fs.existsSync(idempotencyPath)) {
    fs.writeFileSync(idempotencyPath, '{}');
}

// Routes
app.use('/api/payments', paymentRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
