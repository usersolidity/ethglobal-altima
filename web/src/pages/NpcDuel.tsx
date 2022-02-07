import React, { useContext, useEffect, useState } from "react";
import { NpcContext } from "../contexts/NpcContext";
import styled, { css, keyframes } from "styled-components";
import { NpcDuelContext } from "../contexts/NpcDuelContext";
import GameCard from "../models/GameCard";
import NpcCardArea from "../components/duel/NpcCardArea";
import PlayerCardArea from "../components/duel/PlayerCardArea";
import TileComponent from "../components/duel/TileComponent";
import { fetchCardsWithOffset } from "../repositories/NpcCardRepository";
import { TileSet } from "../models/TileSet";
import BattleAnimation from "../components/duel/BattleAnimation";
import AtkDefIcon from "../components/duel/AtkDefIcon";
// import { Web3Context } from "../contexts/Web3Context";
import Card from "../models/Card";
import Background from "../images/altima-background.png";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants/ContractConstants";
import DuelResultAnimation from "../components/duel/DuelResultAnimation";
import DuelResult from "../models/DuelResult";
import useSound from "use-sound"
import GameStartFX from "../audio/game-start.mp3";

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
  display: flex;
  flex-direction: column;
  color: white;
  align-self: flex-start;
  text-align: left;

  justify-content: space-between;
  height: 100vh;

  @media (max-width: 844px) {
    height: auto;
    overflow: auto;
    width: 100%;
  }
`;

const ConnectButtonContainer = styled.div`
  flex: 1;
  padding-top: 24px;
  padding-left: 24px;
  padding-bottom: 24px;
`;

const PersistentDuelLogs = styled.div`
  flex: 1;
  padding: 24px;
  background-color: rgba(13, 50, 72, 0.5);
  border: 1px solid #416983;
  overflow-y: scroll;
`;

const BattlefieldSection = styled.section`
  flex: 3;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow-y: scroll;
  height: 100vh;

  @media (max-width: 844px) {
    height: auto;
    overflow: auto;
  }
`;

const RestartGameSection = styled.section`
  flex: 1;
  align-self: flex-start;
  align-items: flex-end;
  padding-top: 24px;
  padding-right: 24px;
  padding-bottom: 24px;
  text-align: right;

  @media (max-width: 844px) {
    align-self: flex-end;
  }
`;

const DuelResultStat = styled.div`
  color: white;
`;

const DuelScene = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;

  @media (max-width: 844px) {
    height: auto;
  }
`

const DuelArena = styled.div`
  flex: 0;
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
  bottom: 0;
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

const BlueButton = styled.button`
  margin-top: 8px;
  margin-bottom: 24px;
  padding: 8px;
  border: none;
  background-color: #B1D0E0;
  color: #416983;
  font-weight: bold;
  font-size: 18px;
  cursor: pointer;
  text-transform: capitalize;

  transition: all 0.5s ease-in-out;

  :hover {
    background-color: #61dafb;
  }
`;

function shuffle<T>(array: Array<T>): Array<T> {
  array.sort(() => Math.random() - 0.5);
  return array;
}

export default function NpcDuel() {
  const npcContext = useContext(NpcContext);
  const duelContext = useContext(NpcDuelContext);
  const { authenticate, isAuthenticated, isAuthenticating, Moralis } = useMoralis();
  const web3 = useWeb3ExecuteFunction();
  const [totalSupply, setTotalSupply] = useState<number | null>(null);
  const [maxSupply, setMaxSupply] = useState<number | null>(null);
  const [web3Provider, setWeb3Provider] = useState<any>(null);
  const [gameStartSound] = useSound(GameStartFX, { volume: 0.10 })

  const initializeGame = () => {
    if (npcContext?.cards) {
      const shuffledCards = shuffle(npcContext?.cards);
      const npcCards = shuffledCards.slice(0, 5).map(card => GameCard.createFromCard(false, card));
      gameStartSound();
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
          deck = shuffle(await fetchCardsWithOffset(100, 101));
        }
        const playerCards = deck.slice(0, 5).map(card => GameCard.createFromCard(true, card));

        duelContext?.setCards(npcCards, playerCards);
      })();
    }

    return () => {
      duelContext?.clearGame();
    }
  }

  async function refreshMintSupplies() {
    if (web3Provider) {
      setTotalSupply(+(await Moralis.executeFunction({
        contractAddress: CONTRACT_ADDRESS,
        functionName: "totalSupply",
        abi: CONTRACT_ABI,
      })))
      setMaxSupply(+(await Moralis.executeFunction({
        contractAddress: CONTRACT_ADDRESS,
        functionName: "ALTIMA_MAX",
        abi: CONTRACT_ABI,
      })));
    }
  }


  useEffect(initializeGame, [npcContext?.cards]);
  useEffect(() => {
    (async () => {
      const newWeb3Provider = await Moralis.enableWeb3();
      if (newWeb3Provider) {
        const network = await newWeb3Provider.detectNetwork();
        if (network.name !== "maticmum") {
          alert("Please connect to the Polygon Mumbai network.");
          await Moralis.deactivateWeb3();
          return;
        }
        setWeb3Provider(newWeb3Provider);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await refreshMintSupplies();
    })();
  }, [web3Provider]);

  const mintNft = async () => {
    await web3.fetch({
      params: {
        contractAddress: CONTRACT_ADDRESS,
        functionName: "mint",
        abi: CONTRACT_ABI,
        msgValue: Moralis.Units.ETH(0.01),
      },
      onComplete: async () => {
        await refreshMintSupplies();
      }
    });
  }

  return (
    <AppContainer>
      <LogsSection>
        <ConnectButtonContainer>
          {isAuthenticated ? (
            <BlueButton onClick={mintNft}>Mint ({totalSupply || "..."} / {maxSupply || "..."})</BlueButton>
          ) : (
            isAuthenticating ? (
              <BlueButton disabled>Authenticating...</BlueButton>
            ) : (
              <BlueButton onClick={() => authenticate({ signingMessage: "Welcome to Altima" })}>
                Connect Wallet
              </BlueButton>
            )
          )}
        </ConnectButtonContainer>
        <PersistentDuelLogs>
          {duelContext?.logs.map((log, id) => (
            <div key={id}>{log.message.message}</div>
          ))}
        </PersistentDuelLogs>
      </LogsSection>
      <BattlefieldSection>
        {duelContext?.gameStarted() && (
          <DuelScene>
            <NpcCardArea numberOfCards={duelContext?.npcCards?.length!} />
            {duelContext?.tileCards && (
              <DuelArenaComponent tiles={duelContext?.tileCards} voidTileIds={duelContext?.voidTileIds} />
            )}
            <PlayerCardArea cards={duelContext?.playerCards!} />
          </DuelScene>
        )}
      </BattlefieldSection>
      <RestartGameSection>
        <BlueButton onClick={initializeGame}>Restart Game</BlueButton>
        <DuelResultStat>Perfect Wins: {localStorage.getItem("perfect-wins") || 0}</DuelResultStat>
        <DuelResultStat>Wins: {localStorage.getItem("wins") || 0}</DuelResultStat>
        <DuelResultStat>Draws: {localStorage.getItem("draws") || 0}</DuelResultStat>
        <DuelResultStat>Losses: {localStorage.getItem("losses") || 0}</DuelResultStat>
        <DuelResultStat>Perfect Losses: {localStorage.getItem("perfect-losses") || 0}</DuelResultStat>
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
        {duelContext?.duelResult && (
          <DuelResultAnimation result={duelContext?.duelResult} />
        )}
      </RestartGameSection>

    </AppContainer>
  );
}
