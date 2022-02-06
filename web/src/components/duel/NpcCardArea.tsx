import styled from "styled-components";
import React from "react";
import { HiddenCardComponent } from "./CardComponent";

import CardHolderBackground from "../../images/card-holder.png";

interface IProps {
  numberOfCards: number;
}

const CardHolderFlip = styled.div`
  flex: 0;
  transform: scaleY(-1);
  margin-bottom: 48px;
`;

const CardsContainer = styled.div`
  flex: 0;
  width: 640px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: url(${CardHolderBackground}) no-repeat center center;
  background-size: contain;
  align-self: flex-end;

  @media (max-width: 844px) {
    width: 472px;
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
  }
`;

function NpcCardArea({ numberOfCards }: IProps) {
  return (
    <CardHolderFlip>
      <CardsContainer>
        {Array(numberOfCards).fill(null).map((_, i) => (
          <CardRotate key={i} index={i} length={numberOfCards}>
            <HiddenCardComponent />
          </CardRotate>
        ))}
      </CardsContainer>
    </CardHolderFlip>
  );
}

export default NpcCardArea;
