import React, { FC } from 'react';
import { NavLink, Route, useRouteMatch } from 'react-router-dom';
import GamesList from './GamesList';
//import GamesQueries from './queries/GamesQueries';

interface IGamesListsProps {}

const GamesLists: FC<IGamesListsProps> = () => {
	const { path, url } = useRouteMatch();

	return (
		<>
			<NavLink to={`${url}/join`}>Join</NavLink>			
			<NavLink to={`${url}/current`}>Current</NavLink>
			<NavLink to={`${url}/past`}>History</NavLink>
			<Route path={`${path}/:filter`}>
				<GamesList />
			</Route>
	
	
		</>
	);
};

export default GamesLists;
