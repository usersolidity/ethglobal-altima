import { TileSet } from "../models/TileSet";
import GameEvent, { CHOOSE_ENEMY, CHOOSE_PLAYER_CARD_AND_TILE, EVENTS_PLAYING } from "../models/GameEvent";
import GameCard from "../models/GameCard";
import { ArrowChoices } from "../models/Card";
import GameLog from "../models/GameLog";
import BattleDetails from "../models/BattleDetails";
import EventType from "../models/EventType";

class NpcMove {
  npcCardIndex: number;

  tileIndex: number;

  score: number;

  constructor(npcCardIndex: number, tileIndex: number, score: number) {
    this.npcCardIndex = npcCardIndex;
    this.tileIndex = tileIndex;
    this.score = score;
  }
}

function cloneTileCards(tileSet: TileSet) {
  return tileSet.map(tile => tile !== null ? new GameCard(
    tile.belongsToPlayer,
    tile.id,
    tile.species,
    tile.arrows,
    tile.atk,
    tile.atkType,
    tile.pdef,
    tile.mdef,
    "123",
  ) : null) as TileSet;
}

const getTargetX = (arrowIndex: number): number => {
  if (arrowIndex < 3) {
    return arrowIndex - 1;
  }
  if (arrowIndex < 5) {
    return arrowIndex === 3 ? -1 : 1;
  }
  return arrowIndex - 6;
}

const getTargetY = (arrowIndex: number): number => {
  if (arrowIndex < 3) {
    return -1;
  }
  if (arrowIndex < 5) {
    return 0;
  }
  return 1;
}

const getCounterDef = (atkType: string, pdef: number, mdef: number) => {
  if (atkType === "P") {
    return { defType: "P", def: pdef };
  }
  if (atkType === "M") {
    return { defType: "M", def: mdef };
  }
  if (atkType === "X") {
    if (pdef > mdef) {
      return { defType: "P", def: pdef };
    }
    return { defType: "M", def: mdef };
  }
  return { defType: "A", def: Math.floor((pdef + mdef) / 2) };
}

function createNpcMove(
  tiles: TileSet,
  npcCardIndex: number,
  tileIndex: number,
  voidTileIds: Array<number>,
  card: GameCard
) {
  const x = tileIndex % 4;
  const y = Math.floor(tileIndex / 4);

  const getComboScore = (arrows: ArrowChoices, targetX: number, targetY: number): number => {
    return arrows.map((arrow, i): number => {
      if (!arrow) return 0;

      const offsetX = getTargetX(i);
      const offsetY = getTargetY(i);

      const comboTargetX = targetX + offsetX;
      const comboTargetY = targetY + offsetY;

      const targetTileIndex = targetY * 4 + targetX;

      if (comboTargetX < 0 || comboTargetX > 3 || comboTargetY < 0 || comboTargetY > 3) {
        return 0;
      }

      if (voidTileIds.includes(targetTileIndex)) return 0;

      const targetCard = tiles[targetTileIndex];
      if (!targetCard?.belongsToPlayer) {
        return 0;
      }
      return 1;
    }).reduce((a, b) => a + b, 0);
  }

  const enemyTargetTiles = card.arrows.map((arrow, i) => {
    if (!arrow) return 0;

    const offsetX = getTargetX(i);
    const offsetY = getTargetY(i);

    const targetX = x + offsetX;
    const targetY = y + offsetY;

    const targetTileIndex = targetY * 4 + targetX;

    if (targetX < 0 || targetX > 3 || targetY < 0 || targetY > 3) {
      return 0;
    }

    const targetCard = tiles[targetTileIndex];

    if (voidTileIds.includes(targetTileIndex)) return 0;

    if (targetCard && targetCard.belongsToPlayer) {
      const canCounter = targetCard.canCounter(offsetX, offsetY);

      if (canCounter) {
        const counterDef = getCounterDef(card.atkType, targetCard.pdef, targetCard.mdef).def;
        if (card.atk < counterDef) {
          return -card.rarityScore * 2;
        }
        if (card.atk === counterDef) {
          return Math.floor(targetCard.rarityScore / 2);
        }
        return targetCard.rarityScore + getComboScore(targetCard.arrows, targetX, targetY);
      }

      return targetCard.rarityScore;
    }

    return 0;
  });

  const wallHugScore = card.arrows.map((arrow, i): number => {
    const offsetX = getTargetX(i);
    const offsetY = getTargetY(i);

    const targetX = x + offsetX;
    const targetY = y + offsetY;

    const targetTileIndex = targetY * 4 + targetX;

    const targetCard = tiles[targetTileIndex];

    if (arrow) {
      const arrowValue = card.pdef + card.mdef - card.atk;
      if (voidTileIds.includes(targetTileIndex)) {
        return -arrowValue;
      }

      if (targetX < 0 || targetX > 3 || targetY < 0 || targetY > 3) {
        return -arrowValue;
      }

      if (targetCard) {
        if (!targetCard.belongsToPlayer) {
          return -arrowValue;
        }
        return 0;
      }
      return arrowValue;
    }

    if (voidTileIds.includes(targetTileIndex)) {
      return 2;
    }

    if (targetX < 0 || targetX > 3 || targetY < 0 || targetY > 3) {
      return 2;
    }

    if (targetCard) {
      return 2;
    }

    return -1;
  }).reduce((a, b) => a + b, 0);

  const targetScore = enemyTargetTiles.reduce((a, b) => a + b, 0);

  return new NpcMove(npcCardIndex, tileIndex, targetScore + wallHugScore);
}

function getAtkEventType(atkType: string) {
  if (atkType === "S") {
    return EventType.SWORD_ATK;
  }
  return EventType.MAGIC_ATK;
}

function getDefEventType(defType: string) {
  if (defType === "S") {
    return EventType.SWORD_DEF;
  }
  return EventType.MAGIC_DEF;
}

const flipAllEncounters = (
  atkCard: GameCard,
  tileIndex: number,
  newTileCards: TileSet,
  voidTileIds: Array<number>,
  playerTurn: boolean,
  gameEvents: Array<GameEvent>,
): TileSet => {
  const simulatedTileCards = cloneTileCards(newTileCards);
  const enemyFlipIds: Array<number> = atkCard.arrows.map((arrow, i) => {
    if (!arrow) return null;

    const offsetX = getTargetX(i);
    const offsetY = getTargetY(i);

    const x = tileIndex % 4;
    const y = Math.floor(tileIndex / 4);

    const targetX = x + offsetX;
    const targetY = y + offsetY;

    const targetTileIndex = targetY * 4 + targetX;

    if (targetX < 0 || targetX > 3 || targetY < 0 || targetY > 3) {
      return null;
    }

    const targetCard = simulatedTileCards[targetY * 4 + targetX];

    if (voidTileIds.includes(targetTileIndex)) return null;

    if (!targetCard) {
      return null;
    }
    if (targetCard.belongsToPlayer === playerTurn) {
      return null;
    }

    return targetTileIndex
  }).filter(value => value !== null) as Array<number>;

  if (!enemyFlipIds.length) {
    return cloneTileCards(simulatedTileCards);
  }

  gameEvents.push({
    tileSet: cloneTileCards(simulatedTileCards),
    gameState: EVENTS_PLAYING,
    remarks: "357",
    logs: enemyFlipIds.length > 1 ? [
      new GameLog(
        `${atkCard.getFullName()} is combo-ing ${enemyFlipIds.length} enemies!`,
        EventType.COMBO,
      )
    ] : [],
    shimmerIds: enemyFlipIds,
  });
  enemyFlipIds.forEach(enemyFlipId => {
    simulatedTileCards[enemyFlipId]!.flip();
    gameEvents.push({
      tileSet: cloneTileCards(simulatedTileCards),
      gameState: EVENTS_PLAYING,
      logs: [
        new GameLog(
          `${atkCard.getFullName()} combo'd ${simulatedTileCards[enemyFlipId]!.getFullName()}!`,
          EventType.CARD_FLIP,
        )
      ],
      remarks: "360"
    });
  });
  return cloneTileCards(simulatedTileCards);
}

const enemyPlay = (
  newTileCards: TileSet,
  voidTileIds: Array<number>,
  npcCards: Array<GameCard>,
  gameEvents: Array<GameEvent>
) => {
  if (!npcCards?.length) {
    return;
  }
  let simulatedTileCards = cloneTileCards(newTileCards);
  const npcMoves: Array<NpcMove> = npcCards!.flatMap((card, cardIndex) => {
    return simulatedTileCards.map((tileCard, tileIndex) => {
      if (tileCard !== null || voidTileIds.includes(tileIndex)) {
        return null;
      }
      return createNpcMove(simulatedTileCards, cardIndex, tileIndex, voidTileIds, card);
    });
  }).filter(card => card !== null) as Array<NpcMove>;
  const sortedMoves = npcMoves.sort((a, b) => b.score - a.score);
  const bestMove = sortedMoves[0];

  const npcCard = npcCards![bestMove.npcCardIndex];
  const newNpcCards = npcCards!.filter((card, cardIndex) => cardIndex !== bestMove.npcCardIndex)
  simulatedTileCards = simulatedTileCards.map(
    (tileCard, i) =>
      i === bestMove.tileIndex ? npcCard : tileCard
  ) as TileSet;
  gameEvents.push({
    tileSet: cloneTileCards(simulatedTileCards),
    gameState: EVENTS_PLAYING,
    npcCards: newNpcCards,
    logs: [],
    remarks: "408"
  });

  const x = bestMove.tileIndex % 4;
  const y = Math.floor(bestMove.tileIndex / 4);

  const BreakException = {};

  try {
    npcCard.arrows.forEach((arrow, i) => {
      if (!arrow) return;

      const offsetX = getTargetX(i);
      const offsetY = getTargetY(i);

      const targetX = x + offsetX;
      const targetY = y + offsetY;

      if (targetX < 0 || targetX > 3 || targetY < 0 || targetY > 3) {
        return;
      }

      const tileIndex = targetY * 4 + targetX;

      const targetCard = simulatedTileCards[tileIndex];

      if (voidTileIds.includes(tileIndex)) return;

      if (!targetCard || !targetCard.belongsToPlayer) {
        return;
      }
      const canCounter = targetCard.canCounter(offsetX, offsetY);

      if (!canCounter) {
        return;
      }

      const battleResult = startBattle(simulatedTileCards, bestMove.tileIndex, tileIndex, gameEvents);

      if (battleResult < 0) {
        simulatedTileCards = flipAllEncounters(npcCard, bestMove.tileIndex, simulatedTileCards, voidTileIds, true, gameEvents);
        throw BreakException
      }
      simulatedTileCards = flipAllEncounters(targetCard, tileIndex, simulatedTileCards, voidTileIds, false, gameEvents);
    });
    simulatedTileCards = flipAllEncounters(npcCard, bestMove.tileIndex, simulatedTileCards, voidTileIds, false, gameEvents);
  } catch (err) {
    console.log(err);
  }

  gameEvents.push({
    tileSet: simulatedTileCards,
    gameState: CHOOSE_PLAYER_CARD_AND_TILE,
    logs: [],
    remarks: "480",
  });
}

const startBattle = (
  simulatedTileCards: TileSet,
  atkCardIndex: number,
  defCardIndex: number,
  gameEvents: Array<GameEvent>,
) => {
  const atkCard = simulatedTileCards[atkCardIndex]!;
  const defCard = simulatedTileCards[defCardIndex]!;

  const counterDef = getCounterDef(atkCard.atkType, defCard.pdef, defCard.mdef);
  const shouldFlipCoin = atkCard.atk === counterDef.def;
  const flipBattleLost = Math.floor(Math.random() * 256) < 128;
  gameEvents.push({
    tileSet: cloneTileCards(simulatedTileCards),
    gameState: EVENTS_PLAYING,
    logs: [
      new GameLog(`${atkCard.getFullName()} attacks ${defCard.getFullName()}!`, EventType.UNNAMED),
      new GameLog(
        `${atkCard.atk} atk vs ${counterDef.def} def.${shouldFlipCoin ? " Flipping coin..." : ""}`,
        shouldFlipCoin
          ? EventType.CARD_FLIP
          : atkCard.atk < counterDef.def
            ? getDefEventType(counterDef.defType)
            : getAtkEventType(atkCard.atkType),
        false,
        new BattleDetails(atkCard.atkType, counterDef.defType, atkCard.atk, counterDef.def, flipBattleLost),
      )
    ],
    shimmerIds: [atkCardIndex, defCardIndex],
    remarks: "383"
  });
  if (shouldFlipCoin) {
    if (flipBattleLost) {
      atkCard.flip();
      gameEvents.push({
        tileSet: simulatedTileCards,
        gameState: EVENTS_PLAYING,
        logs: [new GameLog(`${atkCard.getFullName()} loses...`, EventType.CARD_FLIP)],
        shimmerIds: [atkCardIndex],
        remarks: "376"
      });
      return -1;
    }
    defCard.flip();
    gameEvents.push({
      tileSet: simulatedTileCards,
      gameState: EVENTS_PLAYING,
      logs: [new GameLog(`${defCard.getFullName()} loses...`, EventType.CARD_FLIP)],
      shimmerIds: [defCardIndex],
      remarks: "380"
    });
    return 1;
  }
  if (atkCard.atk < counterDef.def) {
    atkCard.flip();
    gameEvents.push({
      tileSet: simulatedTileCards,
      gameState: EVENTS_PLAYING,
      logs: [new GameLog(`${atkCard.getFullName()} loses...`, EventType.CARD_FLIP)],
      shimmerIds: [atkCardIndex],
      remarks: "369"
    });
    return -1;
  }
  defCard.flip();
  gameEvents.push({
    tileSet: simulatedTileCards,
    gameState: EVENTS_PLAYING,
    logs: [new GameLog(`${defCard.getFullName()} loses...`, EventType.CARD_FLIP)],
    shimmerIds: [defCardIndex],
    remarks: "384"
  });
  return 1;
}

export async function simulateEnemyFirstMove(newTileCards: TileSet, voidTileIds: Array<number>, oldNpcCards: Array<GameCard>) {
  const gameEvents: Array<GameEvent> = [];
  let simulatedTileCards = cloneTileCards(newTileCards);
  const npcCards = oldNpcCards.map(card => new GameCard(
    card.belongsToPlayer,
    card.id,
    card.species,
    card.arrows,
    card.atk,
    card.atkType,
    card.pdef,
    card.mdef,
    "123",
  ));

  enemyPlay(simulatedTileCards, voidTileIds, npcCards, gameEvents);

  return gameEvents;
}

export async function simulateEventResultsAfterCardPlay(
  newTileCards: TileSet,
  voidTileIds: Array<number>,
  oldNpcCards: Array<GameCard>,
  attackingTileIndex: number
) {
  const gameEvents: Array<GameEvent> = [];
  let simulatedTileCards = cloneTileCards(newTileCards);
  const npcCards = oldNpcCards.map(card => new GameCard(
    card.belongsToPlayer,
    card.id,
    card.species,
    card.arrows,
    card.atk,
    card.atkType,
    card.pdef,
    card.mdef,
    "123",
  ));

  const atkCard = simulatedTileCards[attackingTileIndex]!

  const enemyCounterIds: Array<number> = atkCard.arrows.map((arrow, i) => {
    if (!arrow) return null;

    const offsetX = getTargetX(i);
    const offsetY = getTargetY(i);

    const x = attackingTileIndex % 4;
    const y = Math.floor(attackingTileIndex / 4);

    const targetX = x + offsetX;
    const targetY = y + offsetY;

    const targetTileIndex = targetY * 4 + targetX;

    if (targetX < 0 || targetX > 3 || targetY < 0 || targetY > 3) {
      return null;
    }

    if (voidTileIds.includes(targetTileIndex)) return null;

    const targetCard = simulatedTileCards[targetTileIndex];

    if (!targetCard || targetCard.belongsToPlayer) {
      return null;
    }

    if (!targetCard.canCounter(offsetX, offsetY)) {
      return null;
    }
    return targetTileIndex
  }).filter(value => value !== null) as Array<number>;

  if (enemyCounterIds.length > 1) {
    gameEvents.push({
      tileSet: simulatedTileCards,
      gameState: CHOOSE_ENEMY,
      logs: [
        new GameLog(
          `${atkCard.getFullName()} is surrounded! ` +
          `Countered by ${enemyCounterIds.length} enemies. Choose enemy target.`,
          EventType.CHOOSE_ENEMY,
          true
        )
      ],
      remarks: "475",
      enemyCounterIds,
      attackingTileId: attackingTileIndex,
    });

    return gameEvents;
  }

  if (enemyCounterIds.length === 1) {
    const defCard = simulatedTileCards[enemyCounterIds[0]]!;

    const battleResult = startBattle(simulatedTileCards, attackingTileIndex, enemyCounterIds[0], gameEvents);

    if (battleResult < 0) {
      simulatedTileCards = cloneTileCards(simulatedTileCards);
      simulatedTileCards = flipAllEncounters(atkCard, attackingTileIndex, simulatedTileCards, voidTileIds, false, gameEvents);
    } else {
      simulatedTileCards = cloneTileCards(simulatedTileCards);
      simulatedTileCards = flipAllEncounters(defCard, enemyCounterIds[0], simulatedTileCards, voidTileIds, true, gameEvents);
      simulatedTileCards = cloneTileCards(simulatedTileCards);
      // TODO: Add defenceless message
      simulatedTileCards = flipAllEncounters(atkCard, attackingTileIndex, simulatedTileCards, voidTileIds, true, gameEvents);
    }
  } else {
    simulatedTileCards = cloneTileCards(simulatedTileCards);
    // TODO: Add defenceless message
    simulatedTileCards = flipAllEncounters(atkCard, attackingTileIndex, simulatedTileCards, voidTileIds, true, gameEvents);
  }
  enemyPlay(simulatedTileCards, voidTileIds, npcCards, gameEvents);
  return gameEvents;
}

export async function simulateEventResultsAfterChoosingEnemyCounter(
  newTileCards: TileSet,
  voidTileIds: Array<number>,
  oldNpcCards: Array<GameCard>,
  attackingTileIndex: number,
  enemyCounterIds: Array<number>,
  enemyCounterId: number,
) {
  const gameEvents: Array<GameEvent> = [];
  let simulatedTileCards = cloneTileCards(newTileCards);
  const npcCards = oldNpcCards.map(card => new GameCard(
    card.belongsToPlayer,
    card.id,
    card.species,
    card.arrows,
    card.atk,
    card.atkType,
    card.pdef,
    card.mdef,
    "123",
  ));

  const atkCard = simulatedTileCards[attackingTileIndex]!;
  const defCard = simulatedTileCards[enemyCounterId]!;

  const battleResult = startBattle(simulatedTileCards, attackingTileIndex, enemyCounterId, gameEvents);

  if (battleResult < 0) {
    simulatedTileCards = flipAllEncounters(atkCard, attackingTileIndex, simulatedTileCards, voidTileIds, false, gameEvents);
    gameEvents.push({
      tileSet: simulatedTileCards,
      gameState: EVENTS_PLAYING,
      logs: [],
      remarks: "555",
      enemyCounterIds: [],
      attackingTileId: null,
    });
    enemyPlay(simulatedTileCards, voidTileIds, npcCards, gameEvents);
    return gameEvents;
  }

  simulatedTileCards = flipAllEncounters(defCard, enemyCounterId, simulatedTileCards, voidTileIds, true, gameEvents);
  const enemyCounterIds2 = enemyCounterIds.filter(id => {
    const card: GameCard = simulatedTileCards[id] as GameCard;
    return !card.belongsToPlayer;
  });
  if (enemyCounterIds2.length > 1) {
    gameEvents.push({
      tileSet: simulatedTileCards,
      gameState: CHOOSE_ENEMY,
      logs: [new GameLog(`Choose another enemy target.`, EventType.CHOOSE_ENEMY)],
      remarks: "480",
      enemyCounterIds: enemyCounterIds2,
    });
    return gameEvents;
  }
  if (enemyCounterIds2.length === 1) {
    const defCard2 = simulatedTileCards[enemyCounterIds2[0]]!;
    const battleResult2 = startBattle(simulatedTileCards, attackingTileIndex, enemyCounterIds2[0], gameEvents);

    if (battleResult2 < 0) {
      simulatedTileCards = flipAllEncounters(atkCard, attackingTileIndex, simulatedTileCards, voidTileIds, false, gameEvents);
    } else {
      simulatedTileCards = flipAllEncounters(defCard2, enemyCounterIds2[0], simulatedTileCards, voidTileIds, true, gameEvents);
      simulatedTileCards = flipAllEncounters(atkCard, attackingTileIndex, simulatedTileCards, voidTileIds, true, gameEvents);
    }
  } else {
    simulatedTileCards = flipAllEncounters(atkCard, attackingTileIndex, simulatedTileCards, voidTileIds, true, gameEvents);
  }
  gameEvents.push({
    tileSet: simulatedTileCards,
    gameState: EVENTS_PLAYING,
    logs: [],
    remarks: "598",
    enemyCounterIds: [],
    attackingTileId: null,
  });
  enemyPlay(simulatedTileCards, voidTileIds, npcCards, gameEvents);

  return gameEvents;
}
