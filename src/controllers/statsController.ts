import { Request, Response } from 'express';
import { getTracksList, getTopArtistsList, getListeningHoursList } from '../services/statsService';

/**
 * Route 1: GET /tracks
 * Returns tracks and their play count, delegating logic to statsService.
 */
export async function getTracks(req: Request, res: Response) {
    try {
        const formattedTracks = await getTracksList();
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
 * Returns the top artist ranking, delegating logic to statsService.
 */
export async function getTopArtists(req: Request, res: Response) {
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    try {
        const formattedResult = await getTopArtistsList(limit);
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
 * Returns the most listened hours of the day, delegating logic to statsService.
 */
export async function getListeningHours(req: Request, res: Response) {
    try {
        const formattedResult = await getListeningHoursList();
        return res.json(formattedResult);
    } catch (error: any) {
        console.error('Error fetching listening hours:', error);
        return res.status(500).json({
            error: 'Error fetching listening hours statistics',
            details: error.message
        });
    }
}