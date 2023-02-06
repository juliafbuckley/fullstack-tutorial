// Creating the server
require('dotenv').config();
// Import ApolloServer class from apollo-server
const { ApolloServer } = require("apollo-server");
// Import schema from schema.js
const typeDefs = require("./schema");

// Create a new instance of ApolloServer and passes it the 
// imported schema 
const server = new ApolloServer({ typeDefs });

// Run the server
server.listen().then(() => {
    console.log(`
        Server is running!
        Listening on port 4000
        Explore at https://studio.apollographql.com/sandbox
        `);
});