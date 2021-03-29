import React, { FC, useReducer, useState } from 'react';
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


type GameState = {
    history: SquareValues[];
    turn: SquareValue.X | SquareValue.O;
};
type GameAction = (
    { 
        type: 'make_move',
        payload: [number, number],
    } |
    { type: 'undo' }
);

const reducer = (state: GameState, action: GameAction) => {
    const { history, turn } = state;
    switch (action.type) {
        case 'undo':
            if (history.length <= 1) return state;
            return {
                history: history.slice(0, history.length - 1),
                turn: getNextTurn(turn),
            } as GameState;
        case 'make_move':
            const recentHist = history[history.length - 1];
            const { payload: [rIdx, cIdx] } = action;
            if (recentHist[rIdx][cIdx] !== SquareValue.BLANK) return state;
            if (getWinner(recentHist)) return state;
            const newTurn = getNextTurn(turn);        
            const nextHist = recentHist.map((curR) => curR.map((curV) => curV)) as SquareValues;
            nextHist[rIdx][cIdx] = turn;
            const newHistory = [...history, nextHist];
            return {
                history: newHistory,
                turn: newTurn,
            } as GameState;
        default:
            return state;
    }
};

const initState = {
    history: [[
        [SquareValue.BLANK, SquareValue.BLANK, SquareValue.BLANK],
        [SquareValue.BLANK, SquareValue.BLANK, SquareValue.BLANK],
        [SquareValue.BLANK, SquareValue.BLANK, SquareValue.BLANK],
    ]],
    turn: SquareValue.X,
} as GameState;

const Game: FC<GameProps> = (props) => {


    const [{ history, turn}, dispatch] = useReducer(reducer, initState);


    const curState = history[history.length - 1];
    const winnerCoords = getWinner(curState);
    const status = (winnerCoords) ? `${getNextTurn(turn)} WON!!` : `${turn}'s TURN`

    const squaresProps = curState.map(
        (r, rIdx) => (r.map(
            (v, vIdx) => ({
                value: v,
                highlight: !!winnerCoords?.find(([wR, wC]) => wR === rIdx && wC === vIdx),
                handleClick: () => dispatch({ type: 'make_move', payload: [rIdx, vIdx]}),
            }),
        ))
    ) as BoardProps['squaresProps'];
    
    return (
        <div className="game">
            <div className="game-board">
                <Board {...{ squaresProps }}/>
            </div>
            <div className="game-info">
                <div>{status}</div>
                <button 
                    onClick={() => dispatch({type: 'undo'})}
                >
                    Undo
                </button>
            </div>
        </div>
    );
};

export default Game;