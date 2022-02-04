import { TileSet } from "../models/TileSet";
import GameEvent from "../models/GameEvent";
import GameCard from "../models/GameCard";

export async function simulateEventResultsAfterCardPlay(
  simulatedTileCards: TileSet,
  voidTileIds: Array<number>,
  npcCards: Array<GameCard>,
  attackingTileIndex: number,
  enemyCounterIds: Array<number>
): Promise<Array<GameEvent>> {
  // TODO: Implement this
  return [];
}

export async function simulateEnemyFirstMove(
  simulatedTileCards: TileSet,
  voidTileIds: Array<number>,
  npcCards: Array<GameCard>,
): Promise<Array<GameEvent>> {
  // TODO: Implement this
  return [];
}

export async function simulateEventResultsAfterChoosingEnemyCounter(
  simulatedTileCards: TileSet,
  voidTileIds: Array<number>,
  npcCards: Array<GameCard>,
  attackingTileIndex: number,
  enemyCounterIds: Array<number>,
  chosenCounterId: number,
): Promise<Array<GameEvent>> {
  // TODO: Implement this
  return [];
}
