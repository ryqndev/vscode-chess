import cn from "./Puzzle.module.scss";
import { memo, useMemo, useRef, useState } from "react";
import { Chessboard } from "../../components/Chessboard/Chessboard.js";
import { usePuzzle } from "./controllers/usePuzzle.js";
import { MoveHistory } from "../../components/MoveHistory/MoveHistory.js";
import clsx from "clsx";

export const Puzzle = memo(function Puzzle() {
	const container = useRef<HTMLDivElement>(null);
	const { game, fen, onPieceDrop, solved, next } = usePuzzle();
	const [hoveredPos, setHoveredPos] = useState<string>();

	// fen is reactive, game is not
	// eslint-disable-next-line 
	const history = useMemo(() => game.history({ verbose: true }), [fen]);

	return (
		<div className={cn.page}>
			<div className={cn.container}>
				<div className={cn.board} ref={container}>
					<Chessboard game={game} fen={hoveredPos ?? fen} onPieceDrop={onPieceDrop} container={container} />
				</div>
				<div className={clsx(cn.moves, solved && cn.solved)}>
					<MoveHistory history={history} setHoveredPos={setHoveredPos} />
					<div className={cn.actions}>
						<button onClick={next}>New Puzzle</button>
					</div>
				</div>
			</div>
		</div>
	);
});
