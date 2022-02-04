import { TileSet } from "./TileSet";
import GameCard from "./GameCard";
import GameLog from "./GameLog";
import BattleDetails from "./BattleDetails";

export const GAME_NOT_STARTED = "GAME_NOT_STARTED";
export const CHOOSE_PLAYER_CARD_AND_TILE = "CHOOSE_PLAYER_CARD_AND_TILE";
export const CHOOSE_ENEMY = "CHOOSE_ENEMY";
export const EVENTS_PLAYING = "EVENTS_PLAYING";
export const GAME_COMPLETE = "GAME_COMPLETE";

export type GameState = typeof GAME_NOT_STARTED
  | typeof CHOOSE_PLAYER_CARD_AND_TILE
  | typeof CHOOSE_ENEMY
  | typeof EVENTS_PLAYING
  | typeof GAME_COMPLETE;

export default class GameEvent {
  readonly tileSet: TileSet;

  readonly gameState: GameState;

  readonly logs: Array<GameLog>;

  readonly remarks: string;

  readonly npcCards?: Array<GameCard> | null;

  readonly enemyCounterIds?: Array<number> | null;

  readonly attackingTileId?: number | null;

  readonly shimmerIds?: Array<number> | null;

  constructor(
    tileSet: TileSet,
    gameState: GameState,
    logs: Array<GameLog>,
    remarks: string,
    npcCards: Array<GameCard> | null = null,
    enemyCounterIds: Array<number> | null = null,
    attackingTileId: number | null = null,
    shimmerIds: number[] | null = null,
  ) {
    this.tileSet = tileSet;
    this.gameState = gameState;
    this.logs = logs.map(log => new GameLog(
      log.message,
      log.persisting,
      log.battleDetails && new BattleDetails(
        log.battleDetails.atkType,
        log.battleDetails.defType,
        log.battleDetails.atk,
        log.battleDetails.def,
        log.battleDetails.flipBattleLost
      )
    ));
    this.remarks = remarks;
    this.npcCards = npcCards;
    this.enemyCounterIds = enemyCounterIds;
    this.attackingTileId = attackingTileId;
    this.shimmerIds = shimmerIds;
  }
}
