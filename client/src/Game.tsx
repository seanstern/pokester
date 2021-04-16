import React, { FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import GamesQueries from './queries/GamesQueries';
import Board from './Board';
import TPropsOf from './TPropsOf';
import { ESquareValue } from './Square';

export type TSquareValues = [
	[ESquareValue, ESquareValue, ESquareValue],
	[ESquareValue, ESquareValue, ESquareValue],
	[ESquareValue, ESquareValue, ESquareValue]
];

type TBoardProps = TPropsOf<typeof Board>;

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
					<div className="game-info">Loading game {gameID} ...</div>
				</div>
			);
		case 'success':
		default:
			const {
				data: { hasStarted, isMyTurn, board, mySymbol, isOver },
			} = gameQ;
			const squaresProps = (board.map((value, squareIdx) => ({
				value,
				hightlight: false,
				handleClick: () =>
					!isOver &&
					isMyTurn &&
					value === ESquareValue.BLANK &&
					takeTurn({ gameID, squareIdx }),
			})) as unknown) as TBoardProps['squaresProps'];
			let status: string = 'Waiting for another player to join...';
			if (hasStarted) {
				if (isOver) {
					status = 'Game over!';
				} else if (isMyTurn) {
					status = `Your (${mySymbol}'s) turn!`;
				} else {
					status = `Their (${
						mySymbol === ESquareValue.X
							? ESquareValue.O
							: ESquareValue.X
					}'s) turn!`;
				}
			}
			return (
				<>
					<div className="game">
						<div className="game-board">
							<Board {...{ squaresProps }} />
						</div>
						<div className="game-info">Game {gameID}</div>
						<div className="game-info">{status}</div>
					</div>
					<div>
						<Link to="/">Back home</Link>
					</div>
				</>
			);
	}
};

export default Game;
