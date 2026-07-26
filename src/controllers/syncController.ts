import { Request, Response } from 'express';
import { syncUser } from '../services/syncService';

/**
 * REST Endpoint to synchronize user scrobbles.
 * Extracts username from request body and delegates logic to syncService.
 */
export async function syncUserScrobbles(req: Request, res: Response) {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'campo "username" é obrigatório.' });
    }

    try {
        const result = await syncUser(username);
        return res.json(result);
    } catch (error: any) {
        console.error('Erro durante a sincronização', error);
        return res.status(500).json({
            error: 'Erro interno ao sincronizar scrobbles.',
            details: error.message,
        });
    }
}