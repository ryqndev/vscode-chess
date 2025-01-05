import cn from "./Puzzle.module.scss";
import { memo } from "react";
import { Chessboard } from "../../components/Chessboard/Chessboard.js";
import { usePuzzle } from "./controllers/usePuzzle.js";

export const Puzzle = memo(function Puzzle() {
	const { game, fen, puzzle } = usePuzzle();
	// Chess.loadPgn('1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 {giuoco piano} *')
	console.log('@ryqndev', puzzle);
	// const { bestMove } = useEngine(fen);

	// const turn = game.turn();


	// function getEngineMove() {
	// 	if (game.isGameOver() || game.isDraw())
	// 		return; // exit if the game is over
	// }

	// useEffect(() => {
	// 	if (turn === 'b' && bestMove) {
	// 		makeMove(bestMove);
	// 	}
	// }, [turn, bestMove, makeMove]);



	if (!fen) return null;

	return (
		<div className={cn.container}>
			<div className={cn.board}>
				{game.turn()}
				<Chessboard game={game} fen={fen} />
			</div>
		</div>
	);
});
