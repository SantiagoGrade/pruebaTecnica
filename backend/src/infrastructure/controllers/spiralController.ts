import { Request, Response } from 'express';
import { buildSpiralResponse } from '../../application/spiralUseCase';

export function getCaracol(req: Request, res: Response): void {
    const n = parseInt(req.params.n, 10);

    if (isNaN(n)) {
        res.status(400).json({ error: 'El parámetro debe ser un número entero.' });
        return;
    }

    try {
        const result = buildSpiralResponse(n);
        res.status(200).json(result);
    } catch (error) {
        if (error instanceof RangeError) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error interno del servidor.' });
        }
    }
}
