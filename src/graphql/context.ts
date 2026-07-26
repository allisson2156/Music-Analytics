import { PrismaClient } from '@prisma/client';
import prisma from '../db';

export interface GraphQLContext {
    prisma: PrismaClient;
}

/**
 * Creates the context object passed to all GraphQL resolvers.
 * Injects the Prisma client for database access.
 */
export function createContext(): GraphQLContext {
    return {
        prisma,
    };
}
