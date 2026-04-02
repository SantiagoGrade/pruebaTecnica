import { describe, it, expect } from 'vitest';
import {
  generateSpiralMatrix,
  getDiagonal,
  getInverseDiagonal,
} from '../domain/spiralMatrix';
import { buildSpiralResponse } from '../application/spiralUseCase';

describe('generateSpiralMatrix', () => {

  it('genera la matriz correcta para n=5 (ejemplo del enunciado)', () => {
    const result = generateSpiralMatrix(5);
    expect(result[0]).toEqual([1,  2,  3,  4, 5]);
    expect(result[1]).toEqual([16, 17, 18, 19, 6]);
    expect(result[2]).toEqual([15, 24, 25, 20, 7]);
    expect(result[3]).toEqual([14, 23, 22, 21, 8]);
    expect(result[4]).toEqual([13, 12, 11, 10, 9]);
  });

  it('genera la matriz correcta para n=3 (caso mínimo)', () => {
    const result = generateSpiralMatrix(3);
    expect(result[0]).toEqual([1, 2, 3]);
    expect(result[1]).toEqual([8, 9, 4]);
    expect(result[2]).toEqual([7, 6, 5]);
  });

  for (let n = 3; n <= 15; n++) {
    it(`para n=${n}: matriz ${n}×${n} con valores únicos del 1 al ${n * n}`, () => {
      const matrix = generateSpiralMatrix(n);

      expect(matrix).toHaveLength(n);
      matrix.forEach(row => expect(row).toHaveLength(n));

      const flat = matrix.flat();
      expect(flat).toHaveLength(n * n);
      for (let i = 1; i <= n * n; i++) {
        expect(flat).toContain(i);
      }
    });
  }
});

describe('getDiagonal / getInverseDiagonal', () => {

  it('diagonal principal correcta para n=5', () => {
    const matrix = generateSpiralMatrix(5);
    expect(getDiagonal(matrix)).toEqual([1, 17, 25, 21, 9]);
  });

  it('diagonal inversa correcta para n=5', () => {
    const matrix = generateSpiralMatrix(5);
    expect(getInverseDiagonal(matrix)).toEqual([5, 19, 25, 23, 13]);
  });

  for (let n = 3; n <= 15; n++) {
    it(`diagonales para n=${n} tienen longitud ${n}`, () => {
      const matrix = generateSpiralMatrix(n);
      expect(getDiagonal(matrix)).toHaveLength(n);
      expect(getInverseDiagonal(matrix)).toHaveLength(n);
    });
  }
});

describe('buildSpiralResponse (validación de rango)', () => {

  it('lanza RangeError para n=2 (fuera de rango inferior)', () => {
    expect(() => buildSpiralResponse(2)).toThrowError(RangeError);
  });

  it('lanza RangeError para n=16 (fuera de rango superior)', () => {
    expect(() => buildSpiralResponse(16)).toThrowError(RangeError);
  });

  it('retorna estructura completa con n, matrix, diagonal e inverseDiagonal', () => {
    const result = buildSpiralResponse(5);
    expect(result).toHaveProperty('n', 5);
    expect(result).toHaveProperty('matrix');
    expect(result).toHaveProperty('diagonal');
    expect(result).toHaveProperty('inverseDiagonal');
  });
});