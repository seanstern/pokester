import React, { FC } from 'react';
import Square from './Square';
interface BoardProps {}
const Board: FC<BoardProps> = (props) => {
    const status = 'next player: X';
    return (
        <div>
            <div className="status">{status}</div>
            <div className="board-row">
                <Square value={0} />
                <Square value={1} />
                <Square value={2} />
            </div>
            <div className="board-row">
                <Square value={3} />
                <Square value={4} />
                <Square value={5} />
            </div>
            <div className="board-row">
                <Square value={6} />
                <Square value={7} />
                <Square value={8} />
            </div>
        </div>
    );
}

export default Board;