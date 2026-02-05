A Free and User-Friendly Command-Line Interface (CLI) Application

This application offers a solution for managing inventory products within a PostgreSQL database.

Key Features:
View Products: Display all inventory items in a clear, formatted table.
Add Products: Securely insert new products with input validation.
Search: Locate products quickly by name.
Maintenance: Safely modify stock quantities or remove items.
Security: Utilizes environment variables to protect database credentials.
Tech Stack:
Runtime: Node.js
Database: PostgreSQL
Libraries: pg (Postgres Client for Node), dotenv (Environment Variable Management)
Thanks for taking a look!

Setup Instructions
Clone the Repository
Initialize the Database
Before running the application, you must create the necessary database table. Using a VS Code Extension: Install the "PostgreSQL" extension in VS Code. Connect to your database, open the schema.sql file, and click "Run."