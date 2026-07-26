import prisma from '../db';
import { fetchRecentTracks } from './lastfm';

export interface SyncResult {
    success: boolean;
    message: string;
    scrobblesProcessed: number;
}

/**
 * Synchronizes recent scrobbles from Last.fm for a specific user.
 * Normalizes and stores/updates users, artists, tracks, and scrobbles in SQLite.
 */
export async function syncUser(username: string): Promise<SyncResult> {
    console.log(`[SyncService] Iniciando sincronização para: ${username}...`);

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

    console.log(`[SyncService] Sincronização concluída. ${scrobblesProcessed} scrobbles processados.`);

    return {
        success: true,
        message: `Sincronização realizada com sucesso para "${username}".`,
        scrobblesProcessed,
    };
}
