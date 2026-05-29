import { Request, Response } from 'express';
import prisma from '../db';

/**
 * Route 1: GET /tracks
 * Returns tracks and their play count using pure Prisma ORM.
 */
export async function getTracks(req: Request, res: Response) {
    try {
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

        // Format the response to be more user-friendly 
        const formattedTracks = tracks.map(t => ({
            id: t.id,
            title: t.title,
            artist: t.artist.name,
            playCount: t._count.scrobbles
        }));

        return res.json(formattedTracks);
    } catch (error: any) {
        console.error('Error fetching tracks:', error);
        return res.status(500).json({
            error: 'Error fetching tracks',
            details: error.message
        });
    }
}

/**
 * Route 2: GET /stats/top-artists
 * Returns the top artist ranking using raw SQL in SQLite.
 */
export async function getTopArtists(req: Request, res: Response) {
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    try {
        // Execute the classic query with JOINs to count scrobbles per artist
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

        const formattedResult = topArtists.map(item => ({
            id: item.id,
            name: item.name,
            scrobbles: Number(item.scrobbleCount) 
        }));

        return res.json(formattedResult);
    } catch (error: any) {
        console.error('Error fetching top artists:', error);
        return res.status(500).json({
            error: 'Error fetching artist statistics',
            details: error.message
        });
    }
}

/**
 * Route 3: GET /stats/listening-hours
 * Returns the most listened hours of the day ordered from peak activity to lowest using raw SQL.
 */
export async function getListeningHours(req: Request, res: Response) {
    try {
        // Extract the hour ('%H') directly from the ISO date format stored in SQLite
        const hours = await prisma.$queryRawUnsafe<any[]>(`
            SELECT 
                strftime('%H', playedAt) as hour,
                COUNT(*) as scrobbleCount 
            FROM Scrobble
            GROUP BY hour
            ORDER BY scrobbleCount DESC
        `);

        const formattedResult = hours.map(item => ({
            hour: `${item.hour}:00`,
            scrobbles: Number(item.scrobbleCount) // Corrected to scrobbleCount
        }));

        return res.json(formattedResult);
    } catch (error: any) {
        console.error('Error fetching listening hours:', error);
        return res.status(500).json({
            error: 'Error fetching listening hours statistics',
            details: error.message
        });
    }
}