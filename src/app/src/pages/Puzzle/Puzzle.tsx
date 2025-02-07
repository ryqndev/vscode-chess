import cn from "./Puzzle.module.scss";
import { memo, useEffect, useState } from "react";
import { SidePanel } from "./components/SidePanel/SidePanel";
import { MainPanel } from "./components/MainPanel/MainPanel";
import { useGetNextPuzzle } from "./controllers/useGetNextPuzzle";

export const Puzzle = memo(function Puzzle() {
	const next = useGetNextPuzzle();
	const [hoveredPos, setHoveredPos] = useState<string>();

	useEffect(next, [next]);

	return (
		<div className={cn.page}>
			<div className={cn.container}>
				<MainPanel hoveredPos={hoveredPos} />
				<SidePanel setHoveredPos={setHoveredPos} />
			</div>
		</div>
	);
});
