import { model, Schema, Types } from 'mongoose';
import ITimeStampedDocument from './ITimestampedDocument';

enum SquareValue {
    X = 'X',
    O = 'O',
    BLANK = 'BLANK',
}

const squareValueStrings = Object.values(SquareValue) as string[];

interface IGameCreator {
    board: [
        SquareValue, SquareValue, SquareValue,
        SquareValue, SquareValue, SquareValue,
        SquareValue, SquareValue, SquareValue,
    ];
    players: [string] | [string, string];
    nextMove: 0 | 1;
}

const gameSchemaFields: Record<keyof IGameCreator, any> = {
    board: {
        type: [String],
        required: true,
        validate: function (board: string[]) {
            return (
                (board.length === 9)
                && (board.find((v) => squareValueStrings.includes(v)))
            );
        },
    },
    players: {
        type: [String],
        required: true,
        validate: function (players: string[]) {
            return (
                (players.length === 2 && players[0] !== players[1])
                || (players.length === 1)
            );
        },
    },
    nextMove: {
        type: Number,
        required: true,
        enum: [0, 1],
    },
};

const gameSchema = new Schema(
    gameSchemaFields,
    { optimisticConcurrency: true, timestamps: true },
);

interface IGameDoc extends ITimeStampedDocument {
    board: Types.Array<SquareValue>;
    players: Types.Array<string>;
    nextMove: number;
}

const GameModel = model<IGameDoc>('Game', gameSchema);

export default GameModel;

export { IGameCreator, IGameDoc, SquareValue, squareValueStrings };