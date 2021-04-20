import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import GamesQueries from './queries/GamesQueries';

interface IGameCreatorProps {}

const GameCreator: FC<IGameCreatorProps> = () => {
	const create = GamesQueries.useCreate();
	const history = useHistory();

	return (
		<button
			onClick={() =>
				create(undefined, {
					onSuccess: (gameID) => history.push(`/game/${gameID}`),
				})
			}
		>
			New Game
		</button>
	);
};

export default GameCreator;
