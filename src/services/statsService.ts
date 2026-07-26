import prisma from '../db';

export interface TrackStats {
    id: number;
    title: string;
    artist: string;
    playCount: number;
}

export interface ArtistStats {
    id: number;
    name: string;
    scrobbles: number;
}

export interface ListeningHourStats {
    hour: string;
    scrobbles: number;
}

/**
 * Fetches the list of tracks with their corresponding play counts using Prisma ORM.
 */
export async function getTracksList(): Promise<TrackStats[]> {
    const tracks = await prisma.track.findMany({
        include: {
            artist: {
                select: { name: true }
            },
            _count: {
                select: { scrobbles: true }
            }
        }
    });

    return tracks.map(t => ({
        id: t.id,
        title: t.title,
        artist: t.artist.name,
        playCount: t._count.scrobbles
    }));
}

/**
 * Fetches the ranking of top artists using raw SQL for optimal grouping performance in SQLite.
 */
export async function getTopArtistsList(limit: number = 10): Promise<ArtistStats[]> {
    const topArtists = await prisma.$queryRawUnsafe<any[]>(`
        SELECT 
            a.id, 
            a.name, 
            COUNT(s.id) as scrobbleCount
        FROM Artist a
        INNER JOIN Track t ON t.artistId = a.id
        INNER JOIN Scrobble s ON s.trackId = t.id
        GROUP BY a.id, a.name
        ORDER BY scrobbleCount DESC
        LIMIT ?
    `, limit);

    return topArtists.map(item => ({
        id: item.id,
        name: item.name,
        scrobbles: Number(item.scrobbleCount)
    }));
}

/**
 * Fetches listening activity grouped by hour of the day using raw SQLite date functions.
 */
export async function getListeningHoursList(): Promise<ListeningHourStats[]> {
    const hours = await prisma.$queryRawUnsafe<any[]>(`
        SELECT 
            strftime('%H', playedAt) as hour,
            COUNT(*) as scrobbleCount 
        FROM Scrobble
        GROUP BY hour
        ORDER BY scrobbleCount DESC
    `);

    return hours.map(item => ({
        hour: `${item.hour}:00`,
        scrobbles: Number(item.scrobbleCount)
    }));
}
