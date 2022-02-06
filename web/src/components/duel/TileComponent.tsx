import styled, { css, keyframes } from "styled-components";
import React, { useContext } from "react";
import CardComponent from "./CardComponent";
import GameCard from "../../models/GameCard";
import { CARD_HEIGHT, CARD_WIDTH } from "../../constants/CardConstants";
import { NpcDuelContext } from "../../contexts/NpcDuelContext";
import VoidCard from "../../images/cards/void-card.jpeg"

interface IProps {
  card?: GameCard | null;
  isVoid: boolean;
  index: number;
  overrideClick?: () => void;
}

interface ITileContainerProps {
  clickable: boolean;
  isVoid: boolean;
}

const voidAnimation = keyframes`
  0% {
    transform: scale(1.5, 1.5);
    opacity: 0;
  }
  100% {
    transform: scale(1, 1);
    opacity: 1;
  }
`;

const TileContainer = styled.div<ITileContainerProps>`
  display: flex;
  width: ${CARD_WIDTH + 12}px;
  height: ${CARD_HEIGHT + 12}px;
  border: 2px solid #eee;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);

  ${props => props.clickable && `
    cursor: pointer;
    background-color: #777;
  `}
  ${props => props.isVoid && css`
    background-image: repeating-radial-gradient(circle,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0) 10px,
    grey 10px,
    darkgrey 20px), url("${VoidCard}");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    animation: ${voidAnimation} 0.5s ease;
  `}
`;

function TileComponent({ isVoid, card, index, overrideClick }: IProps) {
  const duelContext = useContext(NpcDuelContext);
  const handleClick = overrideClick || (() => duelContext?.chooseEnemyCounter(index));
  return (
    <TileContainer
      onClick={() => !isVoid && !card && duelContext?.playCardOnTile(index)}
      clickable={!isVoid && !card && duelContext?.chosenPlayerCardIndex !== null}
      isVoid={isVoid}
    >
      {!isVoid && card && (
        <CardComponent
          card={card}
          belongsToPlayer={card.belongsToPlayer}
          isAttacking={duelContext?.attackingTileCard === index}
          shimmering={duelContext?.enemyCounters?.includes(index) || duelContext?.shimmerIds?.includes(index)}
          handleClick={handleClick}
        />
      )}
    </TileContainer>
  );
}

TileComponent.defaultProps = {
  card: null,
  overrideClick: null,
}

export default TileComponent;
