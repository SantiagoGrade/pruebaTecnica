import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SpiralResponse {
    n: number;
    matrix: number[][];
    diagonal: number[];
    inverseDiagonal: number[];
}

@Injectable({ providedIn: 'root' })
export class SpiralMatrixService {

    private readonly apiUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient) { }

    /** Fullstack: consume el endpoint del backend */
    generateFromApi(n: number): Observable<SpiralResponse> {
        return this.http.get<SpiralResponse>(`${this.apiUrl}/caracol/${n}`);
    }

    /** Genera la matriz localmente — usada en los tests unitarios */
    generateLocal(n: number): SpiralResponse {
        if (n < 3 || n > 15) {
            throw new RangeError(`n debe estar entre 3 y 15. Recibido: ${n}`);
        }
        const matrix = this.buildSpiralMatrix(n);
        return {
            n,
            matrix,
            diagonal: matrix.map((row, i) => row[i]),
            inverseDiagonal: matrix.map((row, i) => row[n - 1 - i]),
        };
    }

    private buildSpiralMatrix(n: number): number[][] {
        const matrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
        let top = 0, bottom = n - 1, left = 0, right = n - 1;
        let num = 1;

        while (top <= bottom && left <= right) {
            for (let col = left; col <= right; col++) matrix[top][col] = num++;
            top++;
            for (let row = top; row <= bottom; row++) matrix[row][right] = num++;
            right--;
            if (top <= bottom) {
                for (let col = right; col >= left; col--) matrix[bottom][col] = num++;
                bottom--;
            }
            if (left <= right) {
                for (let row = bottom; row >= top; row--) matrix[row][left] = num++;
                left++;
            }
        }
        return matrix;
    }
}