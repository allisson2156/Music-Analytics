import { Request, Response } from 'express';
import prisma from '../db';
import { fetchRecentTracks } from '../services/lastfm';

export async function syncUserScrobbles(req: Request, res: Response) {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'campo "username" é obrigatório.' });
    }

    try {
        console.log(`Iniciando sincronização para o usuário: 
            ${username}...`);

        const tracks = await fetchRecentTracks(username, 200);

        const dbUser = await prisma.user.upsert({
            where: { username },
            update: {},
            create: { username },
        });

        let scrobblesProcessed = 0;

        for (const track of tracks) {
            // Skip tracks playing now (they don't have a definitive date)
            if (!track.date) continue;

            const artistName = track.artist['#text'];
            const artistMbid = track.artist.mbid;
            const trackTitle = track.name;
            const trackMbid = track.mbid;

            // Convert UNIX timestamp 
            const playedAt = new Date(parseInt(track.date.uts) * 1000);

            // Ensure the artist exists in the database
            const dbArtist = await prisma.artist.upsert({
                where: { name: artistName },
                update: {},
                create: {
                    name: artistName,
                    mbid: artistMbid || null,
                },
            });

            // Ensure the track exists in the database 
            const dbTrack = await prisma.track.upsert({
                where: {
                    // Defined in schema.prisma
                    title_artistId: {
                        title: trackTitle,
                        artistId: dbArtist.id,
                    },
                },
                update: {},
                create: {
                    title: trackTitle,
                    artistId: dbArtist.id,
                    mbid: trackMbid || null,
                },
            });

            // Save the Scrobble linked to the user 
            await prisma.scrobble.upsert({
                where: {
                    userId_playedAt: {
                        userId: dbUser.id,
                        playedAt: playedAt,
                    },
                },
                update: {},
                create: {
                    userId: dbUser.id,
                    trackId: dbTrack.id,
                    playedAt: playedAt,
                },
            });

            scrobblesProcessed++;
        }

        console.log(`Sincronização concluída. ${scrobblesProcessed} scrobbles processados`);

        return res.json({
            success: true,
            message: `Sincronização realizada com sucesso para "${username}".`,
            scrobblesProcessed,
        });
    } catch (error: any) {
        console.error('Erro durante a sincronização', error);
        return res.status(500).json({
            error: 'Erro interno ao sincronizar scrobbles.',
            details: error.message,
        });
    }
}