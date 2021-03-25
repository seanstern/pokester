import React, { FC } from 'react';
import Square from './Square';
interface BoardProps {}
const Board: FC<BoardProps> = (props) => {
    const status = 'next player: X';
    return (
        <div>
            <div className="status">{status}</div>
            <div className="board-row">
                <Square />
                <Square />
                <Square />
            </div>
            <div className="board-row">
                <Square />
                <Square />
                <Square />
            </div>
            <div className="board-row">
                <Square />
                <Square />
                <Square />
            </div>
        </div>
    );
}

export default Board;