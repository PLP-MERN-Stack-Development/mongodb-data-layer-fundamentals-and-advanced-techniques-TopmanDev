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
     *  CRUD OPERATIONS
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

    // 2 Find all books
    const allBooks = await collection.find().toArray();
    console.log('\n1.2 All Books:');
    allBooks.forEach((book, index) => console.log(`    ${index + 1}. ${book.title} by ${book.author}`));

    // 3 Find books by a specific author (George Orwell)
    const orwellBooks = await collection.find({ author: "George Orwell" }).toArray();
    console.log('\n1.3 Books by George Orwell:');
    orwellBooks.forEach((book, index) => console.log(`    ${index + 1}. ${book.title}`));

    // 4 Update a book price (The Hobbit)
    await collection.updateOne(
      { title: "The Hobbit" },
      { $set: { price: 16.99 } }
    );
    console.log('\n1.4 ✅ Updated The Hobbit price to 16.99');

    // 5 Delete a book by title (Moby Dick)
    await collection.deleteOne({ title: "Moby Dick" });
    console.log('1.5 ✅ Deleted: Moby Dick');

    // 6 Count total books in collection
    const totalBooks = await collection.countDocuments();
    console.log(`\n1.6 Total books in collection: ${totalBooks}`);

    /******************************
     * INDEX OPERATIONS
     ******************************/

    // 1 Create an index on author for faster search
    await collection.createIndex({ author: 1 });
    console.log('\n2.1 ✅ Created index on author');

    // 2 Create a compound index on genre + price
    await collection.createIndex({ genre: 1, price: -1 });
    console.log('2.2 ✅ Created compound index on genre and price');

    // 3 Create a unique index on title
    await collection.createIndex({ title: 1 }, { unique: true });
    console.log('2.3 ✅ Created unique index on title');

    // 4 List all indexes
    const indexes = await collection.indexes();
    console.log('\n2.4 Current Indexes:');
    console.log(indexes);

    /******************************
     * AGGREGATION OPERATIONS
     ******************************/

    // 1 Count books per genre
    const booksPerGenre = await collection.aggregate([
      { $group: { _id: "$genre", total: { $sum: 1 } } }
    ]).toArray();
    console.log('\n3.1 Books per genre:');
    console.log(booksPerGenre);

    // 2 Average price per genre
    const avgPricePerGenre = await collection.aggregate([
      { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }
    ]).toArray();
    console.log('\n3.2 Average price per genre:');
    console.log(avgPricePerGenre);

    // 3 Most expensive book per author
    const mostExpensivePerAuthor = await collection.aggregate([
      { $group: { _id: "$author", maxPrice: { $max: "$price" }, book: { $first: "$title" } } }
    ]).toArray();
    console.log('\n3.3 Most expensive book per author:');
    console.log(mostExpensivePerAuthor);

    // 4 Total pages of books in stock
    const totalPagesInStock = await collection.aggregate([
      { $match: { in_stock: true } },
      { $group: { _id: null, totalPages: { $sum: "$pages" } } }
    ]).toArray();
    console.log('\n3.4 Total pages of in-stock books:');
    console.log(totalPagesInStock);

    // 5 List books grouped by genre, sorted by price descending
    const booksByGenre = await collection.aggregate([
      { $sort: { price: -1 } },
      { $group: { _id: "$genre", books: { $push: "$title" } } }
    ]).toArray();
    console.log('\n3.5 Books grouped by genre (sorted by price):');
    console.log(booksByGenre);

    // 6 Count books in stock vs out of stock
    const stockCount = await collection.aggregate([
      { $group: { _id: "$in_stock", count: { $sum: 1 } } }
    ]).toArray();
    console.log('\n3.6 In-stock vs Out-of-stock counts:');
    console.log(stockCount);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
    console.log('\nConnection closed');
  } 
}

// Run the queries
runQueries();
