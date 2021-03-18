// Define all database
const database = {
    local: 'mongodb://localhost/shop-academy',
}

// Check parameters to define the database to export
const _database = database.local;

module.exports = {
    'secret': 'shopSecretShop',
    'database': _database
}
