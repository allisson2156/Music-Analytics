import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import router from './routes';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import { createContext } from './graphql/context';

// Load environment variables 
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

async function startServer() {
    // 1. Create Apollo Server instance
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    // 2. Start the Apollo Server asynchronously
    await server.start();

    // 3. Configure standard middlewares (CORS is critical for Apollo Sandbox access)
    app.use(cors());
    app.use(express.json());

    // 4. Integrate Apollo Server with Express at /graphql endpoint
    app.use(
        '/graphql',
        expressMiddleware(server, {
            context: async () => createContext(),
        })
    );

    // 5. Mount the REST router (maintains backward compatibility with REST V1)
    app.use(router);

    // 6. Start the server
    app.listen(Number(PORT), '127.0.0.1', () => {
        console.log(`🚀 Server running securely at http://127.0.0.1:${PORT}`);
        console.log(`📊 GraphQL Endpoint available at http://127.0.0.1:${PORT}/graphql`);
    });
}

startServer().catch((err) => {
    console.error('Failed to start server:', err);
});
