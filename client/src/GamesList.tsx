import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import GamesQueries from './queries/GamesQueries';

interface IGamesListProps {}

const GamesList: FC<IGamesListProps> = () => {

    const allGamesQ = GamesQueries.useGetAll();

    switch (allGamesQ.status) {
        case 'error':
            return (
                <div>
                    Could not load games.
                </div>
            );
        //intentional fallthrough
        case 'idle': 
        case 'loading':
            return (
                <div>
                    Loading games...
                </div>
            );
        // intentional fallthrough
        case 'success':
        default:
            if (allGamesQ.data.length === 0) {
                return (
                    <div>
                        No games yet!
                    </div>
                );
            }
            return (
                <ul>
                    {allGamesQ.data.map(
                        (s) => <li key={s}><Link to={`/${s}`}>Game {s}</Link></li>,
                    )}
                </ul>
            );
    }
};

export default GamesList;