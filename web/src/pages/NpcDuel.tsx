import React, { useContext, useEffect } from "react";
import { NpcContext } from "../contexts/NpcContext";
import styled, { css, keyframes } from "styled-components";
import { NpcDuelContext } from "../contexts/NpcDuelContext";
import GameCard from "../models/GameCard";
import NpcCardArea from "../components/duel/NpcCardArea";
import PlayerCardArea from "../components/duel/PlayerCardArea";
import TileComponent from "../components/duel/TileComponent";
import { fetchCardsOfProfile, fetchCardsWithOffset } from "../repositories/NpcCardRepository";
import { TileSet } from "../models/TileSet";
import BattleAnimation from "../components/duel/BattleAnimation";
import AtkDefIcon from "../components/duel/AtkDefIcon";
// import { Web3Context } from "../contexts/Web3Context";
import Card from "../models/Card";
import Background from "../images/altima-background.png";
import CardHolderBackground from "../images/card-holder.png";

const AppContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: url(${Background}) no-repeat center center;
  background-size: cover;
  
  @media (max-width: 844px) {
    flex-direction: column-reverse;
    min-height: 100vh;
    height: auto;
  }
`;

const LogsSection = styled.section`
  flex: 1;
  margin: 16px;
  color: white;
`;

const BattlefieldSection = styled.section`
  flex: 3;
  flex-direction: column;
  justify-content: center;
`;

const RestartGameSection = styled.section`
  flex: 1;
`;

const DuelResultStat = styled.div`
  color: white;
`;

const DuelScene = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const DuelArena = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: 464px;
  @media (min-width: 844px) {
    width: 500px;
  }
`;

export const DuelArenaComponent = (props: { tiles: TileSet, voidTileIds: number[], overrideClick?: () => void }) => {
  return (
    <DuelArena>
      {props.tiles.map((tile, id) => (
        <TileComponent
          isVoid={props.voidTileIds.includes(id)}
          card={tile}
          key={id}
          index={id}
          overrideClick={props.overrideClick}
        />
      ))}
    </DuelArena>
  )
}

DuelArenaComponent.defaultProps = {
  overrideClick: null,
}

// TODO: decrease z-index
const DuelLogs = styled.div`
  overflow: auto;
  margin: auto;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: right;
  align-items: flex-end;
  pointer-events: none;
  color: white;
`;

const fadeAnimation = keyframes`
  0% {
    opacity: 1;
  }

  90% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`

interface IDuelLogProps {
  readonly persisting: boolean;
}

const DuelLog = styled.div<IDuelLogProps>`
  ${props => props.persisting ? `` : css`
    animation: ${fadeAnimation} 4s;
    opacity: 0;
  `}
  font-size: 24px;
  text-shadow: 6px 6px 6px #000;
  text-align: center;
  padding: 8px;
  background-color: rgba(0.2, 0.2, 0.2, 0.8);
`;

function shuffle<T>(array: Array<T>): Array<T> {
  array.sort(() => Math.random() - 0.5);
  return array;
}

export default function NpcDuel() {
  const npcContext = useContext(NpcContext);
  const duelContext = useContext(NpcDuelContext);
  // const web3Context = useContext(Web3Context);

  const initializeGame = () => {
    if (npcContext?.cards) {
      const shuffledCards = shuffle(npcContext?.cards);
      const npcCards = shuffledCards.slice(0, 5).map(card => GameCard.createFromCard(false, card));
      (async () => {
        let deck: Card[] = [];
        /*
        let deck: Card[] = (web3Context?.account && web3Context?.web3 && web3Context?.altimaContractAddress)
          ? shuffle(await fetchCardsOfProfile(
            web3Context.account,
            web3Context.web3,
            web3Context.altimaAbi,
            web3Context.altimaContractAddress,
            false
          )) : [];
        */
        if (!deck || !deck.length) {
          deck = shuffle(await fetchCardsWithOffset(20, 41));
        }
        const playerCards = deck.slice(5, 10).map(card => GameCard.createFromCard(true, card));

        duelContext?.setCards(npcCards, playerCards);
      })();
    }

    return () => {
      duelContext?.clearGame();
    }
  }

  useEffect(initializeGame, []);
  return (
    <AppContainer>
      <LogsSection>
        {duelContext?.logs.map((log, id) => (
          <div key={id}>{log.message.message}</div>
        ))}
      </LogsSection>
      <BattlefieldSection>
        {duelContext?.gameStarted() && (
          <DuelScene>
            <NpcCardArea numberOfCards={duelContext?.npcCards?.length!} />
            {duelContext?.tileCards && (
              <DuelArenaComponent tiles={duelContext?.tileCards} voidTileIds={duelContext?.voidTileIds} />
            )}
            <PlayerCardArea cards={duelContext?.playerCards!} />
            <DuelLogs>
              {duelContext?.getRecentLogs().map(log => (
                <DuelLog key={log.id} persisting={log.message.persisting}>
                  {log.message.battleDetails ? (
                    <>
                      <>
                        <AtkDefIcon
                          src={log.message.battleDetails.getAtkIcon()}
                          alt={log.message.battleDetails.atkType}
                        />
                        <span>{log.message.battleDetails.atk} atk vs </span>
                        <AtkDefIcon
                          src={log.message.battleDetails.getDefIcon()}
                          alt={log.message.battleDetails.defType}
                        />
                        <span>
                          {log.message.battleDetails.def} def.
                          {log.message.battleDetails.atk === log.message.battleDetails.def ? " Flipping coin..." : ""}
                        </span>
                      </>
                      <BattleAnimation battleDetails={log.message.battleDetails} />
                    </>
                  ) : log.message.message}
                </DuelLog>
              ))}
            </DuelLogs>
          </DuelScene>
        )}
      </BattlefieldSection>
      <RestartGameSection>
        <DuelResultStat>Winner: {localStorage.getItem("wins") || 0}</DuelResultStat>
        <DuelResultStat>Losses: {localStorage.getItem("losses") || 0}</DuelResultStat>
        <DuelResultStat>Draws: {localStorage.getItem("draws") || 0}</DuelResultStat>
        <button onClick={initializeGame}>Restart Game</button>
      </RestartGameSection>
    </AppContainer>
  );
}
