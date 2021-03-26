import React, { FC, useState } from 'react';

interface SquareProps {
    value: number;
}
const Square: FC<SquareProps> = (props) => {
    const [value, setValue] = useState<string>();
    return (
        <button
            className="square"
            onClick={() => setValue('X')}
        >
            {value}
        </button>
    );

};

export default Square;