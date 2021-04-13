import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import GamesQueries from './queries/GamesQueries';
import Board from './Board';
import PropsOf from './PropsOf';
import { SquareValue } from './Square';

export type SquareValues = [
    [SquareValue, SquareValue, SquareValue],
    [SquareValue, SquareValue, SquareValue],
    [SquareValue, SquareValue, SquareValue],
];

type BoardProps = PropsOf<typeof Board>;

interface IGameProps {}

const Game: FC<IGameProps> = () => {
    
    const { gameID } = useParams<{ gameID: string }>();

    const gameQ = GamesQueries.useGet(gameID);
    const takeTurn = GamesQueries.useTakeTurn();

    switch (gameQ.status) {
        case 'error':
            return (
                <div className="game">
                    <div className="game-info">
                        Could not load game {gameID}.
                    </div>
                </div>
            );
        case 'idle':
        case 'loading':
            return (
                <div className="game">
                    <div className="game-info">
                        Loading game {gameID} ...
                    </div>
                </div>
            );
        case 'success':
        default:
            const { data: { hasStarted, isMyTurn, board } } = gameQ;
            const squaresProps = board.map(
                (value, squareIdx ) => ({
                    value,
                    hightlight: false,
                    handleClick: () => isMyTurn && takeTurn({ gameID, squareIdx }),
                })
            ) as unknown as BoardProps['squaresProps'];
            return (
                <div className="game">
                    <div className="game-board">
                        <Board {...{ squaresProps }}/>
                    </div>
                    <div className="game-info">
                        Game {gameID}
                    </div>
                    <div className="game-info">
                        {!hasStarted ? 'Waiting for another player to join...' : 'Game in progress.'}
                    </div>
                </div>
            );
    }
};

export default Game;