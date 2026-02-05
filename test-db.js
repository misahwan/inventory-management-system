const pool = require('./db');

async function runTest() {
    console.log("🧪 STARTING DATABASE TEST SCRIPT...");

    let testId;

    try {
        // 1. TEST CONNECTION & CREATE
        console.log("\n[Test 1] Creating a dummy item...");
        const insertRes = await pool.query(
            "INSERT INTO products (name, quantity, price) VALUES ($1, $2, $3) RETURNING *",
            ['TEST_ITEM_999', 10, 9.99]
        );
        
        if (insertRes.rows.length > 0) {
            testId = insertRes.rows[0].id;
            console.log("✅ PASS: Item created with ID:", testId);
        } else {
            throw new Error("Failed to insert item.");
        }

        // 2. TEST READ
        console.log("\n[Test 2] Verifying item exists in DB...");
        const readRes = await pool.query("SELECT * FROM products WHERE id = $1", [testId]);
        
        if (readRes.rows.length > 0 && readRes.rows[0].name === 'TEST_ITEM_999') {
            console.log("✅ PASS: Item found in database.");
        } else {
            throw new Error("Item not found after creation.");
        }

        // 3. TEST UPDATE
        console.log("\n[Test 3] Updating item quantity...");
        const updateRes = await pool.query(
            "UPDATE products SET quantity = 50 WHERE id = $1 RETURNING *", 
            [testId]
        );

        if (updateRes.rows[0].quantity === 50) {
            console.log("✅ PASS: Quantity updated to 50.");
        } else {
            throw new Error("Update failed.");
        }

        // 4. TEST DELETE (Clean up)
        console.log("\n[Test 4] Deleting the test item...");
        const deleteRes = await pool.query("DELETE FROM products WHERE id = $1", [testId]);

        if (deleteRes.rowCount === 1) {
            console.log("✅ PASS: Item deleted successfully.");
        } else {
            throw new Error("Delete failed.");
        }

        console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY!");

    } catch (err) {
        console.error("\n❌ TEST FAILED:", err.message);
    } finally {
        // Close connection so the script ends
        pool.end();
    }
}

runTest();