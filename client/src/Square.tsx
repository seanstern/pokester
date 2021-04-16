import React, { FC } from 'react';
import { ESquareValue } from './queries/GamesQueries';

export { ESquareValue };
interface ISquareProps {
	value: ESquareValue;
	highlight: boolean;
	handleClick: () => void;
}

const Square: FC<ISquareProps> = (props) => {
	const { value, highlight, handleClick } = props;
	return (
		<button
			className="square"
			onClick={handleClick}
			style={highlight ? { fontWeight: 'bold' } : undefined}
		>
			{value}
		</button>
	);
};

export default Square;
