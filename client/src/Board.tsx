import React, { FC } from 'react';
import PropsOf from './PropsOf';
import Square from './Square';


type SquareProps = PropsOf<typeof Square>;


type SquaresProps = [
    SquareProps, SquareProps, SquareProps,
    SquareProps, SquareProps, SquareProps,
    SquareProps, SquareProps, SquareProps,
];

interface IBoardProps {
    squaresProps: SquaresProps;
}

const Board: FC<IBoardProps> = (props) => {

    const { squaresProps: sp } = props;

    return (
        <div>
            <div className="board-row">
                {sp.slice(0, 3).map((v, idx) => ( <Square key={idx} {...v} />))}
            </div>
            <div className="board-row">
                {sp.slice(3, 6).map((v, idx) => ( <Square key={idx} {...v} />))}
            </div>
            <div className="board-row">
                {sp.slice(6, 9).map((v, idx) => ( <Square key={idx} {...v} />))} 
            </div>
        </div>
    );
}

export default Board;