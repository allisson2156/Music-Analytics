import { Router, Request, Response } from 'express';
import { syncUserScrobbles } from './controllers/syncController';
import { getTracks, getTopArtists, getListeningHours } from './controllers/statsController';

const router = Router();

// Health check endpoint 
router.get('/health', (req: Request, res: Response) => {
    res.json({
        status: "UP",
        timestamp: new Date(),
        message: 'Last.fm Analytics API is running'
    });
});

// Rota para sincronizar Scrobbles 
router.post('/users/sync', syncUserScrobbles);

// Rotas analíticas 
router.get('/tracks', getTracks);
router.get('/stats/top-artists', getTopArtists);
router.get('/stats/listening-hours', getListeningHours);

export default router; 