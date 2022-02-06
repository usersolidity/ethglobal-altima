import styled, { css, keyframes } from "styled-components";
import React from "react";
import BattleDetails from "../../models/BattleDetails";
import AtkDefIcon from "./AtkDefIcon";

const fadeAnimation = keyframes`
  0% {
    opacity: 1;
  }

  75% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`

const comeInFromLeft = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-24px);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
`

const comeInFromRight = keyframes`
  0% {
    opacity: 0;
    transform: translateX(24px);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
`

const defeatToLeft = keyframes`
  0% {
    opacity: 1;
    transform: translateX(0);
  }

  100% {
    opacity: 0;
    transform: translateX(-24px) rotate(-180deg);
  }
`

const defeatToRight = keyframes`
  0% {
    opacity: 1;
    transform: translateX(0);
  }

  100% {
    opacity: 0;
    transform: translateX(24px) rotate(180deg);
  }
`

interface IProps {
  battleDetails: BattleDetails;
}

const BattleAnimationSuperContainer = styled.div`
  overflow: auto;
  margin: auto;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 3;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  opacity: 0;

  animation: ${fadeAnimation} 1s;
`;

const BattleAnimationContainer = styled.div`
  padding: 16px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: row;
  justify-content: right;
  pointer-events: none;
`;

interface BattleIconAndValueProps {
  left?: boolean;
  defeated?: boolean;
}

const BattleIconAndValue = styled.div<BattleIconAndValueProps>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  ${props => props.left && css`margin-right: 16px;`}

  animation: ${props => props.left ? comeInFromLeft : comeInFromRight} .25s ${props => props.defeated && css`, ${props.left ? defeatToLeft : defeatToRight} .75s .25s`};
`;

BattleIconAndValue.defaultProps = {
  left: false,
  defeated: false,
}

export default function BattleAnimation(
  {
    battleDetails
  }: IProps
) {
  return (
    <BattleAnimationSuperContainer>
      <BattleAnimationContainer>
        <BattleIconAndValue left defeated={battleDetails.atk < battleDetails.def}>
          <AtkDefIcon src={battleDetails.getAtkIcon()} alt={battleDetails.atkType} size="large" />
          {battleDetails.atk}
        </BattleIconAndValue>
        <BattleIconAndValue defeated={battleDetails.atk > battleDetails.def}>
          <AtkDefIcon src={battleDetails.getDefIcon()} alt={battleDetails.defType} size="large" />
          {battleDetails.def}
        </BattleIconAndValue>
      </BattleAnimationContainer>
    </BattleAnimationSuperContainer>
  );
}
