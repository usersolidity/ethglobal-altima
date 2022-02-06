import BattleDetails from "./BattleDetails";
import EventType from "./EventType";

export default class GameLog {
  readonly message: string;

  readonly eventType: EventType;

  readonly persisting: boolean;

  readonly battleDetails?: BattleDetails;

  constructor(message: string, eventType: EventType, persisting?: boolean, battleDetails?: BattleDetails) {
    this.message = message;
    this.eventType = eventType;
    this.persisting = !!persisting;
    this.battleDetails = battleDetails;
  }
}
