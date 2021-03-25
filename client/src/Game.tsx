import React, { FC } from 'react';
import Board from './Board';

interface GameProps {}
const Game: FC<GameProps> = (props) => (
    <div className="game">
        <div className="game-board">
            <Board />
        </div>
        <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
        </div>
    </div>
);

export default Game;