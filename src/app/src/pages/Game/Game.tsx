import { Chessboard } from "react-chessboard";
import { Chess, PieceSymbol, Square } from "chess.js";
import cn from "./Game.module.scss";
import { memo, useCallback, useEffect, useState } from "react";
import { PromotionPieceOption } from "react-chessboard/dist/chessboard/types";
import { Move } from "./types.js";
import { useEngine } from "../../controllers/useEngine.js";

// import { ThemeColor } from "vscode";

const game = new Chess();

export const Game = memo(function Game() {
	const [fen, setFen] = useState<string>();
	const { bestMove } = useEngine(fen);

	const turn = game.turn();

	const makeMove = useCallback((move: Move, callback?: () => void) => {
		try {
			game.move(move);
		} catch (e) {
			return false;
		}
		setFen(game.fen());

		callback?.();
	}, []);

	// function getEngineMove() {
	// 	if (game.isGameOver() || game.isDraw())
	// 		return; // exit if the game is over
	// }

	useEffect(() => {
		if (turn === 'b' && bestMove) {
			makeMove(bestMove);
		}
	}, [turn, bestMove, makeMove]);

	function onDrop(sourceSquare: Square, targetSquare: Square) {
		makeMove({ from: sourceSquare, to: targetSquare });
		return true;
	}
	function onPromotionPieceSelect(
		piece?: PromotionPieceOption,
		promoteFromSquare?: Square,
		promoteToSquare?: Square
	) {
		if (!piece || !promoteFromSquare || !promoteToSquare) return false;

		makeMove(
			{
				from: promoteFromSquare,
				to: promoteToSquare,
				promotion: piece.substring(1).toLowerCase() as PieceSymbol,
			});

		return true;
	}


	// const wb_color = new ThemeColor('activityBar.background');

	console.log('@ryqnedv color', (window as any));
	return (
		<div className={cn.container}>
			<div className={cn.board}>
				{/* {JSON.stringify(wb_color)} */}
				turn: {turn}
				<br />
				<Chessboard
					customDarkSquareStyle={{ backgroundColor: window.getComputedStyle(document.body).getPropertyValue('--vscode-badge-background') }}
					id="main"
					position={fen}
					onPieceDrop={onDrop}
					onPromotionPieceSelect={onPromotionPieceSelect}
				/>
			</div>
		</div>
	);
});
