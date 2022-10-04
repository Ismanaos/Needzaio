const express = require('express');
const { makeExecutableSchema } = require('graphql-tools')
const { server_settings } = require('./config/server');
const { graphqlHTTP } = require('express-graphql')
const {readFileSync} = require('fs');
const { join } = require('path')
const resolvers = require('./lib/resolvers')
const routes = require('./routes/index.js')

const server = express();

//server name
server.name = "API";
//server settings(cors & middleware)
server_settings(server);
//server routes
server.use('/', routes);

////////////// graphql ///////////////////

const typeDefs = readFileSync(
    join(__dirname, 'lib', 'schema.graphql'),
    'utf-8'    
)

const schema = makeExecutableSchema({typeDefs, resolvers})

server.use('/api', graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true
}))


module.exports = {server};