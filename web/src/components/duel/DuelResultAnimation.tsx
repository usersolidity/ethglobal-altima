import styled, { keyframes } from "styled-components";
import React from "react";
import DuelResult from "../../models/DuelResult";
import PERFECT from "../../images/duel/result/perfect.png";
import VICTORY from "../../images/duel/result/victory.png";
import DRAW from "../../images/duel/result/draw.png";
import LOSE from "../../images/duel/result/lose.png";
import EPIC_FAIL from "../../images/duel/result/fail.png";

const fadeAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-24px);
  }
  20% {
    opacity: 1;
    transform: translateY(0px);
  }

  80% {
    opacity: 1;
    transform: translateY(0);
  }

  100% {
    opacity: 0;
    transform: translateY(24px);
  }
`

interface IProps {
  result: DuelResult;
}

const DuelResultSuperContainer = styled.div`
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

  animation: ${fadeAnimation} 5s;
`;

const DuelResultContainer = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: row;
  justify-content: right;
  pointer-events: none;
`;

const DuelResultImage = styled.img`
  width: 100%;
  filter: drop-shadow(0px 0px 24px rgba(255, 255, 255, 1));
`;

function getDuelResultImageSource(result: DuelResult) {
  if (result === DuelResult.PERFECT) {
    return PERFECT;
  }
  if (result === DuelResult.VICTORY) {
    return VICTORY;
  }
  if (result === DuelResult.DRAW) {
    return DRAW;
  }
  if (result === DuelResult.LOSE) {
    return LOSE;
  }
  return EPIC_FAIL;
}

export default function DuelResultAnimation(
  {
    result
  }: IProps
) {
  return (
    <DuelResultSuperContainer>
      <DuelResultContainer>
        <DuelResultImage src={getDuelResultImageSource(result)} alt={result.toString()} />
      </DuelResultContainer>
    </DuelResultSuperContainer>
  );
}
