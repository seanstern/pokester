import React, { FC } from 'react';
import TPropsOf from './TPropsOf';
import Square from './Square';

type TSquareProps = TPropsOf<typeof Square>;

type TSquaresProps = [
	TSquareProps,
	TSquareProps,
	TSquareProps,
	TSquareProps,
	TSquareProps,
	TSquareProps,
	TSquareProps,
	TSquareProps,
	TSquareProps
];

interface IBoardProps {
	squaresProps: TSquaresProps;
}

const Board: FC<IBoardProps> = (props) => {
	const { squaresProps: sp } = props;

	return (
		<div>
			<div className="board-row">
				{sp.slice(0, 3).map((v, idx) => (
					<Square key={idx} {...v} />
				))}
			</div>
			<div className="board-row">
				{sp.slice(3, 6).map((v, idx) => (
					<Square key={idx} {...v} />
				))}
			</div>
			<div className="board-row">
				{sp.slice(6, 9).map((v, idx) => (
					<Square key={idx} {...v} />
				))}
			</div>
		</div>
	);
};

export default Board;
