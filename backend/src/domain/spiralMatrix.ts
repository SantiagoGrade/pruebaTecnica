export type Matrix = number[][];

export function generateSpiralMatrix(n: number): Matrix {
    const matrix: Matrix = Array.from({ length: n }, () => Array(n).fill(0));
    let top = 0, bottom = n - 1, left = 0, right = n - 1;
    let num = 1;

    while (top <= bottom && left <= right) {

        for (let col = left; col <= right; col++)
            matrix[top][col] = num++;
        top++;

        for (let row = top; row <= bottom; row++)
            matrix[row][right] = num++;
        right--;

        if (top <= bottom) {
            for (let col = right; col >= left; col--)
                matrix[bottom][col] = num++;
            bottom--;
        }

        if (left <= right) {
            for (let row = bottom; row >= top; row--)
                matrix[row][left] = num++;
            left++;
        }
    }

    return matrix;
}

export function getDiagonal(matrix: Matrix): number[] {
    return matrix.map((row, i) => row[i]);
}

export function getInverseDiagonal(matrix: Matrix): number[] {
    const n = matrix.length;
    return matrix.map((row, i) => row[n - 1 - i]);
}