import React, { FC } from 'react';

interface SquareProps {
    value: number;
}
const Square: FC<SquareProps> = (props) => {
    const { value } = props;
    return (
        <button className="square">
            {value}
        </button>
    );

};

export default Square;