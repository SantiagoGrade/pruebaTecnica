import {
    generateSpiralMatrix,
    getDiagonal,
    getInverseDiagonal,
} from '../domain/spiralMatrix';

export interface SpiralResponse {
    n: number;
    matrix: number[][];
    diagonal: number[];
    inverseDiagonal: number[];
}

export function buildSpiralResponse(n: number): SpiralResponse {
    if (!Number.isInteger(n) || n < 3 || n > 15) {
        throw new RangeError(
            `El parámetro debe ser un entero entre 3 y 15. Recibido: ${n}`
        );
    }

    const matrix = generateSpiralMatrix(n);

    return {
        n,
        matrix,
        diagonal: getDiagonal(matrix),
        inverseDiagonal: getInverseDiagonal(matrix),
    };
}