import React, { FC } from 'react';
import PropsOf from './PropsOf';
import Square from './Square';


type SquareProps = PropsOf<typeof Square>;


type SquaresProps = [
    [SquareProps, SquareProps, SquareProps],
    [SquareProps, SquareProps, SquareProps],
    [SquareProps, SquareProps, SquareProps],
];

interface BoardProps {
    squaresProps: SquaresProps;
}

const Board: FC<BoardProps> = (props) => {

    const { squaresProps: sp } = props;

    return (
        <div>
            <div className="board-row">
                {sp[0].map((v) => ( <Square {...v} />))}
            </div>
            <div className="board-row">
                {sp[1].map((v) => ( <Square {...v} />))}
            </div>
            <div className="board-row">
                {sp[2].map((v) => ( <Square {...v} />))} 
            </div>
        </div>
    );
}

export default Board;