import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';

const PATH = '/api/games';

enum SquareValue {
    X = 'X',
    O = 'O',
    BLANK = 'BLANK',
}

interface IGame {
    board: [
        SquareValue,
        SquareValue,
        SquareValue,
        SquareValue,
        SquareValue,
        SquareValue,
        SquareValue,
        SquareValue,
        SquareValue,
    ];
    hasStarted: boolean;
    isMyTurn: boolean;
}

const useGetAll = () => (
    useQuery(
        PATH, 
        async () => {
            const { data } = await axios.get<string[]>(
                PATH,
                { validateStatus: (status) => status === 200},
            );
            return data;
        },
    ) 
);

const useGet = (gameID: string) => (
    useQuery(
        `${PATH}/${gameID}`,
        async () => {
            const { data } = await axios.get<IGame>(
                `${PATH}/${gameID}`,
                { validateStatus: (status) => status === 200},
            );
            return data;
        }
    )
);


const useCreate = () => {
    const qc = useQueryClient();

    const { mutate } = useMutation(
        async () => {
            const { data } = await axios.post<string>(
                PATH,
                null,
                { validateStatus: (status) => status === 201},
            );
            return data;
        },
        { onSuccess: () => qc.invalidateQueries(PATH, { exact: true })},
    );

    return mutate;
};

const useTakeTurn = () => {
    const qc = useQueryClient();

    const { mutate } = useMutation(
        async (vars: { gameID: string, squareIdx: number }) => {
            await axios.patch(
                `${PATH}/${vars.gameID}`,
                { squareIdx: vars.squareIdx },
                { validateStatus: (status) => status === 204 },
            );
            return;
        },
        { onSuccess: (data, vars, context) => {
            qc.invalidateQueries(`${PATH}/${vars.gameID}`, { exact: true })}
        },
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