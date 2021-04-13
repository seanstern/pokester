import React, { FC } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import Game from './Game';
import GameCreator from './GameCreator';
import GamesList from './GamesList';
// import logo from './logo.svg';
// import './App.css';

const qc = new QueryClient();

const App: FC = () => (
    <QueryClientProvider client={qc}>
        <Router>
            <Switch>
                <Route path='/:gameID'>
                    <Game />
                </Route>
                <Route path='/'>
                    <GameCreator />
                    <GamesList />
                </Route>
            </Switch>
        </Router>
    </QueryClientProvider>
);

export default App;
