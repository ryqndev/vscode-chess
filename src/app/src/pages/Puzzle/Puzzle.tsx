import cn from "./Puzzle.module.scss";
import { memo, useEffect, useRef, useState } from "react";
import { Chessboard } from "../../components/Chessboard/Chessboard";
import { usePuzzle } from "./controllers/usePuzzle";
import { usePuzzleStore } from "./controllers/puzzle-store";
import { useShallow } from "zustand/shallow";
import { SidePanel } from "./components/SidePanel/SidePanel";

export const Puzzle = memo(function Puzzle() {
	const container = useRef<HTMLDivElement>(null);
	const { fen } = usePuzzleStore(useShallow(({ fen }) => ({ fen })));
	const { game, onPieceDrop, next, onPromotionPieceSelect } = usePuzzle();
	const [hoveredPos, setHoveredPos] = useState<string>();

	useEffect(() => {
		next();
	}, [next]);

	return (
		<div className={cn.page}>
			<div className={cn.container}>
				<div className={cn.board} ref={container}>
					<Chessboard
						game={game}
						// invisibleMode={1}
						fen={hoveredPos ?? fen}
						onPieceDrop={onPieceDrop}
						container={container}
						arePremovesAllowed={true}
						onPromotionPieceSelect={onPromotionPieceSelect}

					/>
				</div>
				<SidePanel setHoveredPos={setHoveredPos} />
			</div>
		</div>
	);
});
