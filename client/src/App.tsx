import React, { FC } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
	Link,
} from 'react-router-dom';
import Game from './Game';
import GamesLists from './GamesLists';

const qc = new QueryClient({
	defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

const App: FC = () => (
	<QueryClientProvider client={qc}>
		<Router>
			<Switch>
				<Route path="/game/:gameID">
					<Game />
					<Link to="/lists/current">Home</Link>
				</Route>
				<Route path="/lists">
					<GamesLists />
				</Route>
				<Redirect to="/lists/join" />
			</Switch>
		</Router>
	</QueryClientProvider>
);

export default App;
