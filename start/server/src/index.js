// Creating the server
require('dotenv').config();
// Import ApolloServer class from apollo-server
const { ApolloServer } = require("apollo-server");
// Import schema from schema.js
const typeDefs = require("./schema");
// For the SQLite database
const { createStore } = require("./utils");
const resolvers = require("./resolvers");

const LaunchAPI = require("./datasources/launch");
const UserAPI = require("./datasources/user");

// Database setup
const store = createStore();

// Create a new instance of ApolloServer and passes it the 
// imported schema 
const server = new ApolloServer({ 
    typeDefs,
    resolvers,
    // Connect instances of launch and user APIs to the graph
    // ** If you use this.context in a datasource, you MUST create
    // a NEW instance of that datasource in the dataSources function,
    // rather than sharing a single instance
    dataSources: () => ({
        launchAPI: new LaunchAPI(),
        userAPI: new UserAPI({ store }),
    }),
});

// Run the server
server.listen().then(() => {
    console.log(`
        Server is running!
        Listening on port 4000
        Explore at https://studio.apollographql.com/sandbox
        `);
});