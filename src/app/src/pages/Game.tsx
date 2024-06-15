import { Chessboard } from "react-chessboard";
import cn from "./Game.module.scss";

export const Game = () => {
  return (
    <div className={cn.container}>
      <div className={cn.board}>
        <Chessboard id="main" />
      </div>
    </div>
  );
};
