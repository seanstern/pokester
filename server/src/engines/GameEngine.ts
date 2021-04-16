import { ESquareValue, TBoard } from '../models/GameModel';

const isWinner = (
	v0: ESquareValue,
	v1: ESquareValue,
	v2: ESquareValue
): boolean => v0 !== ESquareValue.BLANK && v0 === v1 && v1 === v2;

type TWinnerCoords = [number, number, number];

const WINNING_COMBOS: TWinnerCoords[] = [
	// horizontal
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	// vertical
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	// diagoal,
	[0, 4, 8],
	[2, 4, 6],
];

interface IFinalResultWinner {
	status: 'WINNER';
	coords: TWinnerCoords;
}

interface IFinalResultStalemate {
	status: 'STALEMATE';
}

interface IFinalResultPending {
	status: 'PENDING';
}

type TFinalResult =
	| IFinalResultWinner
	| IFinalResultStalemate
	| IFinalResultPending;

const getFinalResult = (board: TBoard): TFinalResult => {
	for (let i = 0; i < WINNING_COMBOS.length; i++) {
		const combo = WINNING_COMBOS[i];
		const values = combo.map((pos) => board[pos]) as [
			ESquareValue,
			ESquareValue,
			ESquareValue
		];
		if (isWinner(...values)) {
			return {
				status: 'WINNER',
				coords: combo,
			} as IFinalResultWinner;
		}
	}

	if (board.find((v) => v === ESquareValue.BLANK) !== ESquareValue.BLANK) {
		return { status: 'STALEMATE' } as IFinalResultStalemate;
	}

	return { status: 'PENDING' } as IFinalResultPending;
};

export default {
	getFinalResult,
};
