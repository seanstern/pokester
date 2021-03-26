import React, { FC } from 'react';

export enum SquareValue {
    BLANK = '',
    X = 'X',
    O = 'O',
}

interface SquareProps {
    value: SquareValue;
    setValue: () => void;
}

const Square: FC<SquareProps> = (props) => {
    const { value, setValue } = props;
    return (
        <button
            className="square"
            onClick={setValue}
        >
            {value}
        </button>
    );

};

export default Square;