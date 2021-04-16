import { TSquareValues } from './Game';
import { ESquareValue } from './Square';

const isWinner = (v0: ESquareValue, v1: ESquareValue, v2: ESquareValue): boolean =>
	v0 !== ESquareValue.BLANK && v0 === v1 && v1 === v2;

type WinnerCoordinates = [[number, number], [number, number], [number, number]];
const getWinner = (sv: TSquareValues): WinnerCoordinates | null => {
	for (let r = 0; r < sv.length; r++) {
		if (isWinner(...sv[r])) {
			return [
				[r, 0],
				[r, 1],
				[r, 2],
			];
		}
	}

	for (let c = 0; c < sv[0].length; c++) {
		if (isWinner(sv[0][c], sv[1][c], sv[2][c])) {
			return [
				[0, c],
				[1, c],
				[2, c],
			];
		}
	}

	if (isWinner(sv[0][0], sv[1][1], sv[2][2])) {
		return [
			[0, 0],
			[1, 1],
			[2, 2],
		];
	}

	if (isWinner(sv[0][2], sv[1][1], sv[2][0])) {
		return [
			[0, 2],
			[1, 1],
			[2, 0],
		];
	}

	return null;
};

export default getWinner;
