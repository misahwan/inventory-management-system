const pool = require('./db');
const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');

const rl = readline.createInterface({ input, output });

// --- CRUD FUNCTIONS ---

const viewInventory = async () => {
    try {
        console.clear();
        console.log("--- 📦 CURRENT INVENTORY 📦 ---");
        const res = await pool.query('SELECT * FROM products ORDER BY id ASC');
        if (res.rows.length === 0) {
            console.log("\n⚠️  The inventory is empty. Add some items!");
        } else {
            console.table(res.rows);
        }
    } catch (err) {
        console.error("❌ Error:", err.message);
    }
};

const addItem = async () => {
    try {
        console.log("\n--- 🆕 ADD NEW ITEM ---");
        const name = await rl.question('Product Name: ');
        const quantity = await rl.question('Quantity: ');
        const price = await rl.question('Price: ');

        const res = await pool.query(
            'INSERT INTO products (name, quantity, price) VALUES ($1, $2, $3) RETURNING *',
            [name, quantity, price]
        );
        console.log(`\n✅ Added: ${res.rows[0].name}`);
    } catch (err) {
        console.error("❌ Error adding item:", err.message);
    }
};

const searchItem = async () => {
    try {
        const name = await rl.question('\n🔍 Enter product name to search: ');
        const res = await pool.query('SELECT * FROM products WHERE name ILIKE $1', [`%${name}%`]);
        
        if (res.rows.length === 0) {
            console.log(`⚠️  No matches for "${name}"`);
        } else {
            console.table(res.rows);
        }
    } catch (err) {
        console.error("❌ Error searching:", err.message);
    }
};

const updateItem = async () => {
    try {
        const id = await rl.question('\n📝 Enter ID of item to update: ');
        const newQty = await rl.question('New Quantity: ');
        const newPrice = await rl.question('New Price: ');

        const res = await pool.query(
            'UPDATE products SET quantity = $1, price = $2 WHERE id = $3 RETURNING *',
            [newQty, newPrice, id]
        );

        if (res.rowCount === 0) {
            console.log("⚠️  ID not found.");
        } else {
            console.log("✅ Item updated successfully!");
            console.table(res.rows);
        }
    } catch (err) {
        console.error("❌ Error updating:", err.message);
    }
};

const deleteItem = async () => {
    try {
        const id = await rl.question('\n🗑️  Enter ID of item to delete: ');
        const confirm = await rl.question(`Are you sure you want to delete ID ${id}? (yes/no): `);
        
        if (confirm.toLowerCase() === 'yes') {
            const res = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
            if (res.rowCount === 0) {
                console.log("⚠️  ID not found.");
            } else {
                console.log(`✅ Deleted: ${res.rows[0].name}`);
            }
        } else {
            console.log("Operation cancelled.");
        }
    } catch (err) {
        console.error("❌ Error deleting:", err.message);
    }
};

// --- MAIN MENU LOOP ---

const startApp = async () => {
    let running = true;
    while (running) {
        console.log("\n=========================");
        console.log(" INVENTORY MANAGER v1.0");
        console.log("=========================");
        console.log("1. View Inventory");
        console.log("2. Add Item");
        console.log("3. Search Item");
        console.log("4. Update Item");
        console.log("5. Delete Item");
        console.log("6. Exit");

        const choice = await rl.question('\n👉 Select an option (1-6): ');

        switch (choice) {
            case '1': await viewInventory(); break;
            case '2': await addItem(); break;
            case '3': await searchItem(); break;
            case '4': await updateItem(); break;
            case '5': await deleteItem(); break;
            case '6': 
                running = false;
                console.log("👋 Exiting system...");
                break;
            default: console.log("❌ Invalid option. Try again.");
        }
        
        if (running) {
            await rl.question('\nPress ENTER to continue...');
        }
    }
    rl.close();
    pool.end();
};

startApp();