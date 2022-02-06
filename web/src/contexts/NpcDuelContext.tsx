import React, { createContext, PropsWithChildren, useEffect, useReducer, useState } from "react";
import GameCard from "../models/GameCard";
import DuelLog from "../models/DuelLog";
import GameEvent, {
  CHOOSE_ENEMY,
  CHOOSE_PLAYER_CARD_AND_TILE,
  EVENTS_PLAYING,
  GAME_COMPLETE,
  GAME_NOT_STARTED,
  GameState
} from "../models/GameEvent";
import { TileSet } from "../models/TileSet";
import {
  simulateEnemyFirstMove,
  simulateEventResultsAfterCardPlay,
  simulateEventResultsAfterChoosingEnemyCounter
} from "../repositories/NpcDuelEventRepository";
import GameLog from "../models/GameLog";
import DuelResult from "../models/DuelResult";

export type CardSet = Array<GameCard>;

type NpcDuelContextValue = {
  voidTileIds: Array<number>;
  npcCards: CardSet | null;
  playerCards: CardSet | null;
  tileCards: TileSet;
  setCards: (_npcSet: CardSet, _playerSet: CardSet) => void,
  gameStarted: () => boolean,
  clearGame: () => void,
  playCardOnTile: (_: number) => void;
  choosePlayerCard: (_: number | null) => void;
  chosenPlayerCardIndex: number | null;
  attackingTileCard: number | null;
  shimmerIds: number[] | null,
  enemyCounters: number[] | null,
  chooseEnemyCounter: (_: number) => void;
  status: GameState;
  logs: Array<DuelLog>;
  getRecentLogs: () => Array<DuelLog>;
  duelResult: DuelResult | null;
}

export const NpcDuelContext = createContext<NpcDuelContextValue | null>(null);

interface IProps {

}

function cloneTileCards(tileSet: TileSet) {
  return tileSet.map(tile => tile !== null ? GameCard.createFromCard(
    tile.belongsToPlayer,
    tile,
  ) : null) as TileSet;
}

const ADD_LOG = 'ADD_LOG';
const ADD_LOGS = 'ADD_LOGS';
const CLEAR_LOGS = 'CLEAR_LOGS';

type LogAction = {
  type: typeof ADD_LOG;
  message: string;
} | {
  type: typeof ADD_LOGS,
  messages: Array<GameLog>,
} | {
  type: typeof CLEAR_LOGS,
};

function logsReducer(state: Array<DuelLog>, action: LogAction) {
  switch (action.type) {
    case ADD_LOG:
      return [...state, new DuelLog(state.length, new GameLog(action.message, true))];
    case ADD_LOGS:
      return [...state, ...action.messages.map((message, i) => new DuelLog(state.length + i, message))];
    case CLEAR_LOGS:
      return [];
    default:
      return [...state]
  }
}

const ADD_EVENT = 'ADD_EVENT';
const ADD_EVENTS = 'ADD_EVENTS';
const POP_EVENT = 'POP_EVENT';
const CLEAR_EVENTS = 'CLEAR_EVENTS';

type EventAction = {
  type: typeof ADD_EVENT;
  tileSet: TileSet,
  gameState: GameState,
  logs: Array<GameLog>,
  persisting: boolean,
  remarks: string,
} | {
  type: typeof ADD_EVENTS;
  gameEvents: Array<GameEvent>,
} | {
  type: typeof POP_EVENT;
} | {
  type: typeof CLEAR_EVENTS;
};

function delayedEventsReducer(state: Array<GameEvent>, action: EventAction) {
  switch (action.type) {
    case ADD_EVENT:
      return [
        ...state,
        new GameEvent(cloneTileCards(action.tileSet), action.gameState, action.logs, action.remarks)
      ];
    case ADD_EVENTS:
      return [
        ...state,
        ...action.gameEvents.map(gameEvent => new GameEvent(
          cloneTileCards(gameEvent.tileSet),
          gameEvent.gameState,
          gameEvent.logs,
          gameEvent.remarks,
          gameEvent.npcCards,
          gameEvent.enemyCounterIds,
          gameEvent.attackingTileId,
          gameEvent.shimmerIds,
        )),
      ];
    case POP_EVENT:
      return state.slice(1);
    case CLEAR_EVENTS:
      return [];
    default:
      return [...state]
  }
}

export default function NpcDuelContextProvider(props: PropsWithChildren<IProps>) {
  const [npcCards, setNpcCards] = useState<CardSet | null>(null);
  const [playerCards, setPlayerCards] = useState<CardSet | null>(null);
  const [chosenPlayerCardIndex, setChosenPlayerCardIndex] = useState<number | null>(null);
  const [tileCards, setTileCards] = useState<TileSet>(Array(16).fill(null) as TileSet);
  const [voidTileIds, setVoidTileIds] = useState<Array<number>>([]);
  const [enemyCounters, setEnemyCounters] = useState<Array<number>>([]);
  const [shimmerIds, setShimmerIds] = useState<Array<number>>([]);
  const [attackingTileCard, setAttackingTileCard] = useState<number | null>(null);
  const [status, setStatus] = useState<GameState>(GAME_NOT_STARTED);
  const [duelResult, setDuelResult] = useState<DuelResult | null>(null);
  const [enemyGoesFirst, setEnemyGoesFirst] = useState<boolean>(false);
  const [logs, logsDispatch] = useReducer(logsReducer, []);
  const [delayedEvents, delayedEventsDispatch] = useReducer(delayedEventsReducer, []);

  console.log("STATUS", status);

  useEffect(() => {
    const interval = setTimeout(() => {
      console.log(delayedEvents, status);

      if (status === GAME_NOT_STARTED || status === GAME_COMPLETE || status === CHOOSE_ENEMY) return;

      if (delayedEvents.length === 0) {
        if (!playerCards?.length && !npcCards?.length) {
          setStatus(GAME_COMPLETE);
          const playerScore = tileCards.map(
            (card): number => card?.belongsToPlayer ? 1 : 0
          ).reduce((a, b) => a + b, 0);

          const opponentScore = 10 - playerScore;
          let playerPerfectWins = Number(localStorage.getItem('perfect-wins')) || 0;
          let playerWins = Number(localStorage.getItem('wins')) || 0;
          let playerPerfectLosses = Number(localStorage.getItem('perfect-losses')) || 0;
          let playerLosses = Number(localStorage.getItem('losses')) || 0;
          let playerDraws = Number(localStorage.getItem('draws')) || 0;

          if (playerScore === 10) {
            logsDispatch({ type: ADD_LOG, message: "GAME COMPLETE! PERFECT!" });
            localStorage.setItem("perfect-wins", String(++playerPerfectWins));
            setDuelResult(DuelResult.PERFECT);
          } else if (playerScore === 5) {
            logsDispatch({ type: ADD_LOG, message: "GAME COMPLETE! DRAW!" });
            localStorage.setItem("draws", String(++playerDraws));
            setDuelResult(DuelResult.DRAW);
          } else if (playerScore === 0) {
            logsDispatch({ type: ADD_LOG, message: "GAME COMPLETE! YOU PERFECTLY LOST!!" });
            localStorage.setItem("perfect-losses", String(++playerPerfectLosses));
            setDuelResult(DuelResult.EPIC_FAIL);
          } else if (playerScore < 5) {
            logsDispatch({ type: ADD_LOG, message: `GAME COMPLETE! YOU LOSE! ${playerScore} - ${opponentScore}` });
            localStorage.setItem("losses", String(++playerLosses));
            setDuelResult(DuelResult.LOSE);
          } else {
            logsDispatch({ type: ADD_LOG, message: `GAME COMPLETE! YOU WIN! ${playerScore} - ${opponentScore}` });
            localStorage.setItem("wins", String(++playerWins));
            setDuelResult(DuelResult.VICTORY);
          }
        }
        return;
      }

      if (status !== EVENTS_PLAYING) return;

      const delayedEvent = delayedEvents[0]

      logsDispatch({ type: ADD_LOGS, messages: delayedEvent.logs });
      setTileCards(delayedEvent.tileSet);
      setStatus(delayedEvent.gameState);

      // TODO: Set timeout for fade out
      if (delayedEvent.npcCards) {
        setNpcCards(delayedEvent.npcCards);
      }

      setEnemyCounters(delayedEvent.enemyCounterIds || []);

      setAttackingTileCard(delayedEvent.attackingTileId || null);

      setShimmerIds(delayedEvent.shimmerIds || []);

      delayedEventsDispatch({ type: POP_EVENT });
    }, 1000);

    return () => {
      clearTimeout(interval);
    }
  }, [delayedEvents]);

  const gameStarted = () => {
    return status !== GAME_NOT_STARTED;
  }

  const getRecentLogs = () => {
    const fiveSecondAgo = new Date().getTime() - 4000;
    return logs.filter(log => log.createdAt > fiveSecondAgo);
  }

  const choosePlayerCard = (index: number | null) => {
    if (status !== CHOOSE_PLAYER_CARD_AND_TILE) return;
    setChosenPlayerCardIndex(index);
    setStatus(CHOOSE_PLAYER_CARD_AND_TILE);
  }

  const playCardOnTile = async (tileIndex: number) => {
    if (status !== CHOOSE_PLAYER_CARD_AND_TILE) return;
    if (chosenPlayerCardIndex === null) return;

    const playerCard = playerCards![chosenPlayerCardIndex]
    setPlayerCards(playerCards!.filter((card, i) => i !== chosenPlayerCardIndex));
    const simulatedTileCards = cloneTileCards(tileCards).map(
      (tileCard, i) => i === tileIndex ? playerCard : tileCard
    ) as TileSet
    setTileCards(cloneTileCards(simulatedTileCards));
    setChosenPlayerCardIndex(null);

    setStatus(EVENTS_PLAYING);

    // TODO: try catch
    const eventResults = await simulateEventResultsAfterCardPlay(
      simulatedTileCards,
      voidTileIds,
      npcCards!,
      tileIndex,
    );
    delayedEventsDispatch({ type: ADD_EVENTS, gameEvents: eventResults })

    setStatus(EVENTS_PLAYING);
  }

  const chooseEnemyCounter = async (enemyCounterId: number) => {
    if (status !== CHOOSE_ENEMY) return;
    if (!enemyCounters.includes(enemyCounterId)) return;

    setStatus(EVENTS_PLAYING);

    // TODO: try catch
    const eventResults = await simulateEventResultsAfterChoosingEnemyCounter(
      tileCards,
      voidTileIds,
      npcCards!,
      attackingTileCard!,
      enemyCounters,
      enemyCounterId,
    );
    delayedEventsDispatch({ type: ADD_EVENTS, gameEvents: eventResults })

    setStatus(EVENTS_PLAYING);
  }

  const setCards = (npcSet: CardSet, playerSet: CardSet) => {
    setNpcCards(npcSet);
    setPlayerCards(playerSet);
    setTileCards(Array(16).fill(null) as TileSet);
    setDuelResult(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setVoidTileIds(Array(Math.floor(Math.random() * 5)).fill(null).map(_ => Math.floor(Math.random() * 16)));
    delayedEventsDispatch({ type: CLEAR_EVENTS });
    logsDispatch({ type: CLEAR_LOGS });
    logsDispatch({ type: ADD_LOG, message: "Game Start" });
    const playerFirst = Math.floor(Math.random() * 256) < 128;
    if (playerFirst) {
      logsDispatch({ type: ADD_LOG, message: "👈 You go first. Choose a card." });
      setStatus(CHOOSE_PLAYER_CARD_AND_TILE);
    } else {
      logsDispatch({ type: ADD_LOG, message: "Opponent goes first." });
      setStatus(EVENTS_PLAYING);
      setEnemyGoesFirst(true);
    }
  }

  useEffect(() => {
    (async () => {
      if (!enemyGoesFirst) return;
      // TODO: try catch
      const eventResults = await simulateEnemyFirstMove(
        tileCards,
        voidTileIds,
        npcCards!,
      );
      delayedEventsDispatch({ type: ADD_EVENTS, gameEvents: eventResults })
      setEnemyGoesFirst(false);
    })();
  }, [enemyGoesFirst]);

  const clearGame = () => {
    setNpcCards(null);
    // setPlayerCards(null);
    setTileCards(Array(16).fill(null) as TileSet);
    setVoidTileIds([]);
  }

  return (
    <NpcDuelContext.Provider
      value={{
        npcCards,
        playerCards,
        tileCards,
        setCards,
        voidTileIds,
        status,
        gameStarted,
        clearGame,
        playCardOnTile,
        choosePlayerCard,
        chosenPlayerCardIndex,
        attackingTileCard,
        shimmerIds,
        enemyCounters,
        chooseEnemyCounter,
        logs,
        getRecentLogs,
        duelResult,
      }}
    >
      {props.children}
    </NpcDuelContext.Provider>
  )
}
