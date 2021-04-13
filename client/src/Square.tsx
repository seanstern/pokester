import React, { FC } from 'react';

export enum SquareValue {
    BLANK = ' ',
    X = 'X',
    O = 'O',
}

interface ISquareProps {
    value: SquareValue;
    highlight: boolean;
    handleClick: () => void;
}

const Square: FC<ISquareProps> = (props) => {
    const { value, highlight, handleClick } = props;
    return (
        <button
            className="square"
            onClick={handleClick}
            style={highlight ? {fontWeight: 'bold'} : undefined}
        >
            {value}
        </button>
    );

};

export default Square;