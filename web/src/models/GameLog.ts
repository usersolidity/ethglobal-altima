import BattleDetails from "./BattleDetails";

export default class GameLog {
  readonly message: string;

  readonly persisting: boolean;

  readonly battleDetails?: BattleDetails;

  constructor(message: string, persisting?: boolean, battleDetails?: BattleDetails) {
    this.message = message;
    this.persisting = !!persisting;
    this.battleDetails = battleDetails;
  }
}
