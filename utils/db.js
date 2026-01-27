const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const TRANSACTIONS_FILE = path.join(DATA_DIR, 'transactions.json');
const IDEMPOTENCY_FILE = path.join(DATA_DIR, 'idempotency.json');

const readJSON = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading ${filePath}:`, err);
        return [];
    }
};

const writeJSON = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(`Error writing to ${filePath}:`, err);
    }
};

module.exports = {
    getTransactions: () => readJSON(TRANSACTIONS_FILE),
    saveTransactions: (transactions) => writeJSON(TRANSACTIONS_FILE, transactions),
    getIdempotencyKeys: () => readJSON(IDEMPOTENCY_FILE),
    saveIdempotencyKeys: (keys) => writeJSON(IDEMPOTENCY_FILE, keys)
};
