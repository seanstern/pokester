import { model, Schema, Types } from 'mongoose';
import ITimeStampedDocument from './ITimestampedDocument';

enum ESquareValue {
	X = 'X',
	O = 'O',
	BLANK = ' ',
}

const squareValueStrings = Object.values(ESquareValue) as string[];

interface IGameCreator {
	board: [
		ESquareValue,
		ESquareValue,
		ESquareValue,
		ESquareValue,
		ESquareValue,
		ESquareValue,
		ESquareValue,
		ESquareValue,
		ESquareValue
	];
	players: [string] | [string, string];
	nextTurn: 0 | 1;
}

const gameSchemaFields: Record<keyof IGameCreator, any> = {
	board: {
		type: [String],
		required: true,
		validate: function (board: string[]) {
			return (
				board.length === 9 &&
				board.find((v) => squareValueStrings.includes(v))
			);
		},
	},
	players: {
		type: [String],
		required: true,
		validate: function (players: string[]) {
			return (
				(players.length === 2 && players[0] !== players[1]) ||
				players.length === 1
			);
		},
	},
	nextTurn: {
		type: Number,
		required: true,
		enum: [0, 1],
	},
};

const gameSchema = new Schema(gameSchemaFields, {
	optimisticConcurrency: true,
	timestamps: true,
});

interface IGameDoc extends ITimeStampedDocument {
	board: Types.Array<ESquareValue>;
	players: Types.Array<string>;
	nextTurn: number;
}

const GameModel = model<IGameDoc>('Game', gameSchema);

export default GameModel;

export { IGameCreator, IGameDoc, ESquareValue as SquareValue, squareValueStrings };
