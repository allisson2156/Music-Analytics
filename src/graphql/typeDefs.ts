import { gql } from 'graphql-tag';

export const typeDefs = gql`
  # ISO Date scalar representation (as String in GraphQL)
  
  type User {
    id: ID!
    username: String!
    displayName: String
    registeredAt: String
    createdAt: String!
    scrobbles: [Scrobble!]!
  }

  type Artist {
    id: ID!
    name: String!
    mbid: String
    tracks: [Track!]!
  }

  type Track {
    id: ID!
    title: String!
    mbid: String
    artistId: Int!
    artist: Artist!
    scrobbles: [Scrobble!]!
    playCount: Int
  }

  type Scrobble {
    id: ID!
    playedAt: String!
    userId: Int!
    user: User!
    trackId: Int!
    track: Track!
  }

  type ArtistStats {
    id: ID!
    name: String!
    scrobbles: Int!
  }

  type ListeningHourStats {
    hour: String!
    scrobbles: Int!
  }

  type SyncResponse {
    success: Boolean!
    message: String!
    scrobblesProcessed: Int!
  }

  type Query {
    # Health check for GraphQL endpoint
    health: String!

    # Analytical Queries
    tracks: [Track!]!
    topArtists(limit: Int): [ArtistStats!]!
    listeningHours: [ListeningHourStats!]!

    # User Query
    me(username: String!): User
  }

  type Mutation {
    # Data Sync Mutation
    syncUserScrobbles(username: String!): SyncResponse!
  }
`;
