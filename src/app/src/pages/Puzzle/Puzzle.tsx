import cn from "./Puzzle.module.scss";
import { memo, useRef } from "react";
import { Chessboard } from "../../components/Chessboard/Chessboard.js";
import { usePuzzle } from "./controllers/usePuzzle.js";

export const Puzzle = memo(function Puzzle() {
	const container = useRef<HTMLDivElement>(null);
	const { game, fen, puzzle, onPieceDrop } = usePuzzle();
	// const { bestMove } = useEngine(fen);

	// const turn = game.turn();
	console.log('@ryqndev', puzzle);

	return (
		<div className={cn.container}>
			<div className={cn.board} ref={container}>
				<Chessboard game={game} fen={fen} onPieceDrop={onPieceDrop} container={container} />
			</div>
			<div className={cn.moves}>
				"sdfds"
			</div>
		</div>
	);
});
