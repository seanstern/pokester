import React, { FC, useState } from 'react';
import getWinner from './getWinner';
import Square, { SquareValue } from './Square';



interface BoardProps {}

export type SquareValues = [
    [SquareValue, SquareValue, SquareValue],
    [SquareValue, SquareValue, SquareValue],
    [SquareValue, SquareValue, SquareValue],
];

const Board: FC<BoardProps> = (props) => {
    
    const [squareValues, setSquareValues] = useState<SquareValues>([
        [SquareValue.BLANK, SquareValue.BLANK, SquareValue.BLANK],
        [SquareValue.BLANK, SquareValue.BLANK, SquareValue.BLANK],
        [SquareValue.BLANK, SquareValue.BLANK, SquareValue.BLANK],
    ]);
    const [turn, setTurn] = useState(SquareValue.X);

    const winner = getWinner(squareValues);
    
    const status = (
        winner
        ? `WINNER: ${(turn === SquareValue.X ? SquareValue.O : SquareValue.X)}`
        : `TURN  : ${turn}`
    );

    return (
        <div>
            <div className="status">{status}</div>
            <div className="board-row">
                {squareValues[0].map(
                    (v, i) => (
                        <Square 
                            value={v} 
                            setValue={() => {
                                if (squareValues[0][i] !== SquareValue.BLANK) return;
                                if (winner) return;
                                setTurn((oTurn) => oTurn === SquareValue.X ? SquareValue.O : SquareValue.X);
                                setSquareValues((oSVs) => {
                                    const row = oSVs[0];
                                    return [
                                        [...row.slice(0, i), turn, ...row.slice(i + 1)],
                                        ...oSVs.slice(1),
                                    ] as SquareValues;
                                });
                            }}
                        />
                    )
                )}
            </div>
            <div className="board-row">
                {squareValues[1].map(
                    (v, i) => (
                        <Square 
                            value={v} 
                            setValue={() => {
                                if (squareValues[1][i] !== SquareValue.BLANK) return;
                                if (winner) return;
                                setTurn((oTurn) => oTurn === SquareValue.X ? SquareValue.O : SquareValue.X);
                                setSquareValues((oSVs) => {
                                    const row = oSVs[1];
                                    return [
                                        oSVs[0],
                                        [...row.slice(0, i), turn, ...row.slice(i + 1)],
                                        oSVs[2],
                                    ] as SquareValues;
                                });
                            }}
                        />
                    )
                )}
            </div>
            <div className="board-row">
                {squareValues[2].map(
                    (v, i) => (
                        <Square
                            value={v}
                            setValue={() => {
                                if (squareValues[2][i] !== SquareValue.BLANK) return;
                                if (winner) return;
                                setTurn((oTurn) => oTurn === SquareValue.X ? SquareValue.O : SquareValue.X);
                                setSquareValues((oSVs) => {
                                    const row = oSVs[2];
                                    return [
                                        ...oSVs.slice(0, 2),
                                        [...row.slice(0, i), turn, ...row.slice(i + 1)],
                                    ] as SquareValues;
                                });
                            }}
                        />
                    )
                )}
            </div>
        </div>
    );
}

export default Board;