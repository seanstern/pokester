import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';

const PATH = '/api/games';

export enum ESquareValue {
	X = 'X',
	O = 'O',
	BLANK = ' ',
}

interface IGame {
	board: [
		ESquareValue,
		ESquareValue,
		ESquareValue,
		ESquareValue,
		ESquareValue,
		ESquareValue,
		ESquareValue,
		ESquareValue,
		ESquareValue
	];
	hasStarted: boolean;
	isMyTurn: boolean;
	mySymbol: ESquareValue.X | ESquareValue.O;
	isOver: boolean;
}

const useGetAll = () =>
	useQuery(PATH, async () => {
		const { data } = await axios.get<string[]>(PATH, {
			validateStatus: (status) => status === 200,
		});
		return data;
	});

const useGet = (gameID: string) =>
	useQuery(
		`${PATH}/${gameID}`,
		async () => {
			const { data } = await axios.get<IGame>(`${PATH}/${gameID}`, {
				validateStatus: (status) => status === 200,
			});
			return data;
		},
		{ refetchInterval: 1000, refetchIntervalInBackground: true }
	);

const useCreate = () => {
	const qc = useQueryClient();

	const { mutate } = useMutation(
		async () => {
			const { data } = await axios.post<string>(PATH, null, {
				validateStatus: (status) => status === 201,
			});
			return data;
		},
		{ onSuccess: () => qc.invalidateQueries(PATH, { exact: true }) }
	);

	return mutate;
};

const useTakeTurn = () => {
	const qc = useQueryClient();

	interface ITakeTurnParam {
		gameID: string;
		squareIdx: number;
	}
	interface ITakeTurnContext {
		prevGameState: IGame;
		newGameState: IGame;
	}

	const { mutate } = useMutation<void, any, ITakeTurnParam, ITakeTurnContext>(
		async ({ gameID, squareIdx }) => {
			await axios.patch(
				`${PATH}/${gameID}`,
				{ squareIdx },
				{ validateStatus: (status) => status === 204 }
			);
			return;
		},
		{
			onMutate: async ({ gameID, squareIdx }) => {
				const qk = `${PATH}/${gameID}`;

				await qc.cancelQueries(qk, { exact: true });

				const prevGameState = qc.getQueryData<IGame>(qk);
				if (!prevGameState) {
					throw new Error(
						'cannot take turn without previous game state'
					);
				}

				const newGameState: IGame = {
					board: [...prevGameState.board],
					hasStarted: prevGameState.hasStarted,
					isMyTurn: prevGameState.isMyTurn,
					mySymbol: prevGameState.mySymbol,
					isOver: prevGameState.isOver,
				};
				if (newGameState.board[squareIdx] === ESquareValue.BLANK) {
					newGameState.board[squareIdx] = newGameState.mySymbol;
					newGameState.isMyTurn = false;
				}

				qc.setQueryData(qk, newGameState);

				return { prevGameState, newGameState };
			},
			onError: (err, { gameID }, context) => {
				if (context) {
					qc.setQueryData(`${PATH}/${gameID}`, context.prevGameState);
				}
			},
			onSettled: (data, err, { gameID }) => {
				qc.invalidateQueries(`${PATH}/${gameID}`, { exact: true });
			},
		}
	);

	return mutate;
};

const GameQueries = {
	useCreate,
	useGet,
	useGetAll,
	useTakeTurn,
};

export default GameQueries;
