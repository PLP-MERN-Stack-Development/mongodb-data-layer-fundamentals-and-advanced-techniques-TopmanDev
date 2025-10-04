// queries.js - Run CRUD, Aggregation, and Index queries on MongoDB
// Make sure MongoDB is running locally and you have installed the 'mongodb' Node.js driver
// Run with: node queries.js

const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; // Local MongoDB
const dbName = 'plp_bookstore';          // Database name
const collectionName = 'books';          // Collection name

async function runQueries() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    /******************************
     * CRUD OPERATIONS
     ******************************/

    // 1 Insert a new book
    await collection.insertOne({
      title: "New JS Book",
      author: "Node Author",
      genre: "Programming",
      published_year: 2025,
      price: 25.99,
      in_stock: true,
      pages: 300,
      publisher: "Tech Press"
    });
    console.log('\n1.1 ✅ Inserted: New JS Book');

    

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
    console.log('\nConnection closed');
  } 
}

// Run the queries
runQueries();
