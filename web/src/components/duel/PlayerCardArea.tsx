import styled from "styled-components";
import React, { createRef, useContext, useEffect, useRef } from "react";
import CardComponent from "./CardComponent";
import { CardSet, NpcDuelContext } from "../../contexts/NpcDuelContext";
import { CHOOSE_PLAYER_CARD_AND_TILE } from "../../models/GameEvent";

import CardHolderBackground from "../../images/card-holder.png";

interface IProps {
  cards: CardSet;
}

const CardsScrollContainer = styled.div`
  flex: 0;
  @media (max-width: 844px) {
    width: 472px;
    overflow-x: scroll;
  }
`;

interface CardsContainerProps {
  length: number;
}

const CardsContainer = styled.div<CardsContainerProps>`
  flex: 0;
  width: 640px;
  min-height: 158px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: url(${CardHolderBackground}) no-repeat center center;
  background-size: contain;
  align-self: flex-end;
  margin-top: 48px;

  @media (max-width: 844px) {
    width: 472px;
    margin-left: ${props => {
      if (props.length === 5) {
        return 75;
      }
      if (props.length === 4) {
        return 15;
      }
      return 0;
    }}px;
  }
`;

interface CardRotateProps {
  index: number;
  length: number;
}

function getRotation(i: number, n: number) {
  return Math.floor((i / (n - 1)) * 90) - 45;
}

function getOffset(i: number, n: number) {
  return Math.floor((45 - Math.abs(getRotation(i, n))) * 2);
}

const CardRotate = styled.div<CardRotateProps>`
  transform: rotate(${props => getRotation(props.index, props.length)}deg);
  margin-top: -${props => getOffset(props.index, props.length)}px;

  transition: all 0.5s ease-in-out;

  :hover {
    z-index: 2;
    transform: rotate(0deg);
    margin-top: -120px;
  }
`;

function PlayerCardArea({ cards }: IProps) {
  const duelContext = useContext(NpcDuelContext);
  const scrollRef = useRef<any>();
  const scrollChildRef = useRef<any>();

  useEffect(() => {
    scrollRef.current.scrollTo(scrollChildRef.current.scrollWidth - scrollRef.current.clientWidth, 0);
  }, [cards]);

  return (
    <CardsScrollContainer ref={scrollRef}>
      <CardsContainer ref={scrollChildRef} length={cards.length}>
        {cards.map((card, index) => (
          <CardRotate key={card.id} index={index} length={cards.length}>
            <CardComponent
              card={card}
              belongsToPlayer
              shimmering={duelContext?.status === CHOOSE_PLAYER_CARD_AND_TILE}
              handleClick={
                duelContext?.chosenPlayerCardIndex !== index
                  ? (() => duelContext?.choosePlayerCard(index))
                  : (() => duelContext?.choosePlayerCard(null))
              }
              overrideHovering={duelContext?.chosenPlayerCardIndex === index}
            />
          </CardRotate>
        ))}
      </CardsContainer>
    </CardsScrollContainer>
  );
}

export default PlayerCardArea;
