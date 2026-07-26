import { GraphQLContext } from './context';
import { getTracksList, getTopArtistsList, getListeningHoursList } from '../services/statsService';
import { syncUser } from '../services/syncService';

export const resolvers = {
  Query: {
    health: () => 'UP',
    
    tracks: async () => {
      return getTracksList();
    },
    
    topArtists: async (_parent: any, { limit }: { limit?: number }) => {
      return getTopArtistsList(limit ?? 10);
    },
    
    listeningHours: async () => {
      return getListeningHoursList();
    },
    
    me: async (_parent: any, { username }: { username: string }, ctx: GraphQLContext) => {
      return ctx.prisma.user.findUnique({
        where: { username },
      });
    },
  },
  
  Mutation: {
    syncUserScrobbles: async (_parent: any, { username }: { username: string }) => {
      return syncUser(username);
    },
  },

  // Relationship Resolvers - Solving N+1 problem using Prisma Fluent API Batching
  User: {
    scrobbles: async (parent: any, _args: any, ctx: GraphQLContext) => {
      return ctx.prisma.user.findUnique({ where: { id: parent.id } }).scrobbles();
    },
  },

  Artist: {
    tracks: async (parent: any, _args: any, ctx: GraphQLContext) => {
      return ctx.prisma.artist.findUnique({ where: { id: parent.id } }).tracks();
    },
  },

  Track: {
    artist: async (parent: any, _args: any, ctx: GraphQLContext) => {
      // Prisma bundles these calls in a single "IN" query if executed in the same tick
      return ctx.prisma.track.findUnique({ where: { id: parent.id } }).artist();
    },
    scrobbles: async (parent: any, _args: any, ctx: GraphQLContext) => {
      return ctx.prisma.track.findUnique({ where: { id: parent.id } }).scrobbles();
    },
  },

  Scrobble: {
    user: async (parent: any, _args: any, ctx: GraphQLContext) => {
      return ctx.prisma.scrobble.findUnique({ where: { id: parent.id } }).user();
    },
    track: async (parent: any, _args: any, ctx: GraphQLContext) => {
      // Resolves track relationship lazily with database batching
      return ctx.prisma.scrobble.findUnique({ where: { id: parent.id } }).track();
    },
  },
};
