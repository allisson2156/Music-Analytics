import { Request, Response } from 'express';
import prisma from '../db';

/**
 * Rota 1: GET /tracks
 * Retorna as músicas e a quantidade de vezes que foram ouvidas usando Prisma ORM puro.
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

        // Formata a resposta para ficar mais amigável 
        const formattedTracks = tracks.map(t => ({
            id: t.id,
            title: t.title,
            artist: t.artist.name,
            playCount: t._count.scrobbles
        }));

        return res.json(formattedTracks);
    } catch (error: any) {
        console.error('Erro ao buscar músicas:', error);
        return res.status(500).json({
            error: 'Erro ao buscar músicas',
            details: error.message
        });
    }
}

/**
 * Rota 2: GET /stats/top-artists
 * Retorna o ranking de artistas mais ouvidos usando SQL Puro no SQLite.
 */
export async function getTopArtists(req: Request, res: Response) {
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    try {
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
            scrobbles: Number(item.scrobbleCount) // Corrigido para scrobbleCount (no singular)
        }));

        return res.json(formattedResult);
    } catch (error: any) {
        console.error('Erro ao buscar top artistas:', error);
        return res.status(500).json({
            error: 'Erro ao buscar estatísticas de artistas',
            details: error.message
        });
    }
}

/**
 * Rota 3: GET /stats/listening-hours
 * Retorna as horas do dia mais ouvidas ordenadas do pico de atividade para o menor usando SQL Puro.
 */
export async function getListeningHours(req: Request, res: Response) {
    try {
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
            scrobbles: Number(item.scrobbleCount) // Corrigido para scrobbleCount
        }));

        return res.json(formattedResult);
    } catch (error: any) {
        console.error('Erro ao buscar horários:', error);
        return res.status(500).json({
            error: 'Erro ao buscar estatísticas de horários',
            details: error.message
        });
    }
}