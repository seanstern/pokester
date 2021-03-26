import React, { FC, useState } from 'react';
import Board from './Board';
import getWinner from './getWinner';
import PropsOf from './PropsOf';
import { SquareValue } from './Square';

const getNextTurn = (t: SquareValue.X | SquareValue.O) => (
    t === SquareValue.X ? SquareValue.O : SquareValue.X
);

export type SquareValues = [
    [SquareValue, SquareValue, SquareValue],
    [SquareValue, SquareValue, SquareValue],
    [SquareValue, SquareValue, SquareValue],
];

type BoardProps = PropsOf<typeof Board>;

interface GameProps {}

const Game: FC<GameProps> = (props) => {
    const [squareValues, setSquareValues] = useState<SquareValues>([
        [SquareValue.BLANK, SquareValue.BLANK, SquareValue.BLANK],
        [SquareValue.BLANK, SquareValue.BLANK, SquareValue.BLANK],
        [SquareValue.BLANK, SquareValue.BLANK, SquareValue.BLANK],
    ]);
    const [turn, setTurn] = useState<SquareValue.X | SquareValue.O>(SquareValue.X);

    const winnerCoords = getWinner(squareValues);
    const status = (winnerCoords) ? `${getNextTurn(turn)} WON!!` : `${turn}'s TURN`

    const squaresProps = squareValues.map(
        (r, rIdx) => (r.map(
            (v, vIdx) => ({
                value: v,
                highlight: !!winnerCoords?.find(([wR, wC]) => wR === rIdx && wC === vIdx),
                handleClick: () => {
                    if (squareValues[rIdx][vIdx] !== SquareValue.BLANK) return;
                    if (winnerCoords) return;
                    setTurn((oTurn) => getNextTurn(oTurn));        
                    setSquareValues((oSVs) => {
                        const nSVs = oSVs.map((oR) => (oR.map((oV) => oV)));
                        nSVs[rIdx][vIdx] = turn;
                        return nSVs as SquareValues;
                    });
                },
                
            })
        ))
    ) as BoardProps['squaresProps'];
    
    return (
        <div className="game">
            <div className="game-board">
                <Board {...{ squaresProps }}/>
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{/* TODO */}</ol>
            </div>
        </div>
    );
};

export default Game;