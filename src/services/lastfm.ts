const LASTFM_API_URL = 'http://ws.audioscrobbler.com/2.0/';

export interface LastFmTrack {
    artist: {
        '#text': string; // Artist name
        mbid: string; // MusicBrainz ID
    };
    name: string; // Track name
    mbid: string;
    date?: {
        uts: string;
    };
    '@attr'?: {
        nowplaying: string; // Indicates if the track is currently playing
    };
};
// Calls the Last.fm API and returns recent scrobbles 
export async function fetchRecentTracks(username: string, limit = 200):
    Promise<LastFmTrack[]> {
    const apiKey = process.env.LASTFM_API_KEY;

    if (!apiKey) {
        throw new Error('Variavel LASTFM_API_KEY não definida no arquivo .env');
    }

    const url = `${LASTFM_API_URL}?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=${limit}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Erro ao conectar com Last.fm: 
            ${response.statusText}`);
    }

    const data = await response.json() as any; // não o ideal, apenas para projeto de estudos 

    if (data.error) {
        throw new Error(`Erro na API do LastFm: ${data.message}`);
    }
    return data.recenttracks.track;
}