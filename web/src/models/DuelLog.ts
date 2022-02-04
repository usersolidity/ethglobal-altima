import GameLog from "./GameLog";

export default class DuelLog {
  readonly id: number;

  readonly message: GameLog;

  readonly createdAt: number;

  constructor(id: number, message: GameLog) {
    this.id = id;
    this.message = message;
    this.createdAt = new Date().getTime();
    console.log(this.createdAt);
  }
}
