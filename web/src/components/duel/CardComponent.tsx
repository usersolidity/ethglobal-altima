import styled, { css, keyframes } from "styled-components";
import React, { useState } from "react";
import Card from "../../models/Card";
import { CARD_HEIGHT, CARD_WIDTH } from "../../constants/CardConstants";
import SwordImage from "../../images/icons/sword.png";
import StaffImage from "../../images/icons/staff.png";
import GoldSwordImage from "../../images/icons/goldsword.png";
import GoldStaffImage from "../../images/icons/goldstaff.png";
import DualImage from "../../images/icons/dual.png";
import UltiImage from "../../images/icons/ulti.png";
import PhysicShieldImage from "../../images/icons/pshield.png";
import MagicShieldImage from "../../images/icons/mshield.png";
import GoldPhysicShieldImage from "../../images/icons/goldpshield.png";
import GoldMagicShieldImage from "../../images/icons/goldmshield.png";
import BlueCard from "../../images/cards/blue-card.jpeg";
import OrangeCard from "../../images/cards/orange-card.jpeg";

interface IProps {
  card: Card;
  belongsToPlayer?: boolean;
  handleClick?: () => void;
  overrideHovering?: boolean;
  isAttacking?: boolean;
  shimmering?: boolean;
}

const ARROW_OUTLINE_COLOR = "#111";
const OUTLINE_COLOR = "#eee";
const ARROW_COLOR = "gold";

interface ICardContainerProps {
  readonly flipped: boolean;
  readonly hovering: boolean;
  readonly clickable: boolean;
  readonly mini: boolean;
  readonly shimmering?: boolean;
}

const fadeInFromTop = keyframes`
  0% {
    opacity: 0;
    margin-top: -24px;
  }

  100% {
    opacity: 1;
    margin-top: 8px;
  }
`;

const shimmer = keyframes`
  0% {
    opacity: 1;
  }

  30% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }

  70% {
    opacity: 1;
  }

  100% {
    background: rgba(255, 255, 255, 0);
    opacity: 1;
  }
`;

const CardContainer = styled.div<ICardContainerProps>`
  display: flex;
  width: ${props => CARD_WIDTH / (props.mini ? 2 : 1)}px;
  height: ${props => CARD_HEIGHT / (props.mini ? 2 : 1)}px;
  margin: 4px;
  transition: transform 0.5s;
  animation: ${fadeInFromTop} 0.5s ease-in${props => props.shimmering && css`, ${shimmer} 1s linear infinite`};

  @media (min-width: 844px) {
    width: ${CARD_WIDTH}px;
    height: ${CARD_HEIGHT}px;
  }

  ${props => props.flipped && `
    transform: rotateY(180deg);
  `}
  ${props => props.hovering && `
    z-index: 1;
  `}
  ${props => props.clickable && `
    cursor: pointer;
  `}
`;

interface ICardOutlineProps {
  readonly belongsToPlayer: boolean;
}

const CardOutline = styled.div<ICardOutlineProps>`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 16px 0;
  border: 2px solid ${OUTLINE_COLOR};
  transition: background-image 0.5s;

  background-image: url("${props => props.belongsToPlayer ? BlueCard : OrangeCard}");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

interface ICardIdProps {
  readonly flipped: boolean;
}

const CardId = styled.div<ICardIdProps>`
  flex: 0;
  text-align: center;
  color: ${OUTLINE_COLOR};
  font-size: 10px;
  font-weight: bold;
  transition: transform 0.5s;

  ${props => props.flipped && `
    transform: rotateY(180deg);
  `}
`;

interface ICardImageProps {
  readonly flipped: boolean;
  readonly imageUrl: string;
}

const CardImage = styled.div<ICardImageProps>`
  flex: 1;
  background-image: url("${props => props.imageUrl}");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  transition: transform 0.5s;

  ${props => props.flipped && `
    transform: rotateY(180deg);
  `}
`;

interface ICardNumbersProps {
  readonly flipped: boolean;
}

const CardNumbers = styled.div<ICardNumbersProps>`
  flex: 0;
  display: flex;
  text-align: center;
  color: ${OUTLINE_COLOR};
  font-weight: bold;
  font-size: 14px;
  transition: transform 0.5s;

  ${props => props.flipped && `
    transform: rotateY(180deg);
  `}
`;

interface IArrowsContainerFlipperProps {
  readonly flipped: boolean;
}

const ArrowsContainerFlipper = styled.div<IArrowsContainerFlipperProps>`
  position: absolute;
  width: ${CARD_WIDTH}px;
  height: ${CARD_HEIGHT}px;
  transition: transform 0.5s;

  ${props => props.flipped && css`
    transform: rotateY(180deg);
  `}
`;

interface IArrowsContainerProps {
  readonly hovering: boolean;
}

const breatheAnimation = keyframes`
  0% {
    transform: scale(1, 1)
  }

  50% {
    transform: scale(1.1, 1.1)
  }
`

const ArrowsContainer = styled.div<IArrowsContainerProps>`
  position: absolute;
  width: ${CARD_WIDTH}px;
  height: ${CARD_HEIGHT}px;
  margin: 2px;
  transition: transform 0.5s;

  ${props => props.hovering && css`
    animation: ${breatheAnimation} 1s ease-in-out infinite;
  `}
`;

const Arrow = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  border-color: #666;
`;

const UpperLeftArrowOutline = styled(Arrow)`
  top: -2px;
  left: -2px;
  border-top: 23px solid ${ARROW_OUTLINE_COLOR};
  border-right: 23px solid transparent;
`;

const UpperLeftArrow = styled(Arrow)`
  border-top: 16px solid ${ARROW_COLOR};
  border-right: 16px solid transparent;
`;

const UpperArrowOutline = styled(Arrow)`
  border-bottom: 17px solid ${ARROW_OUTLINE_COLOR};
  border-left: 16px solid transparent;
  border-right: 16px solid transparent;
  top: -3px;
  left: ${CARD_WIDTH / 2 - 18}px;
`;

const UpperArrow = styled(Arrow)`
  border-bottom: 12px solid ${ARROW_COLOR};
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  left: ${CARD_WIDTH / 2 - 14}px;
`;

const UpperRightArrowOutline = styled(Arrow)`
  border-top: 23px solid ${ARROW_OUTLINE_COLOR};
  border-left: 23px solid transparent;
  top: -2px;
  right: 2px;
`;

const UpperRightArrow = styled(Arrow)`
  border-top: 16px solid ${ARROW_COLOR};
  border-left: 16px solid transparent;
  right: 4px;
`;

const LeftArrowOutline = styled(Arrow)`
  border-right: 17px solid ${ARROW_OUTLINE_COLOR};
  border-top: 16px solid transparent;
  border-bottom: 16px solid transparent;
  top: ${CARD_HEIGHT / 2 - 16}px;
  left: -3px;
`;

const LeftArrow = styled(Arrow)`
  border-right: 12px solid ${ARROW_COLOR};
  border-top: 12px solid transparent;
  top: ${CARD_HEIGHT / 2 - 12}px;
  border-bottom: 12px solid transparent;
`;

const RightArrowOutline = styled(Arrow)`
  border-left: 17px solid ${ARROW_OUTLINE_COLOR};
  border-top: 16px solid transparent;
  border-bottom: 16px solid transparent;
  top: ${CARD_HEIGHT / 2 - 16}px;
  right: 1px;
`;

const RightArrow = styled(Arrow)`
  border-left: 12px solid ${ARROW_COLOR};
  border-top: 12px solid transparent;
  border-bottom: 12px solid transparent;
  top: ${CARD_HEIGHT / 2 - 12}px;
  right: 4px;
`;

const BottomLeftArrowOutline = styled(Arrow)`
  border-bottom: 23px solid ${ARROW_OUTLINE_COLOR};
  border-right: 23px solid transparent;
  bottom: 2px;
  left: -2px;
`;

const BottomLeftArrow = styled(Arrow)`
  border-bottom: 16px solid ${ARROW_COLOR};
  border-right: 16px solid transparent;
  bottom: 4px;
`;

const BottomArrowOutline = styled(Arrow)`
  border-top: 17px solid ${ARROW_OUTLINE_COLOR};
  border-left: 16px solid transparent;
  border-right: 16px solid transparent;
  bottom: 1px;
  left: ${CARD_WIDTH / 2 - 18}px;
`;

const BottomArrow = styled(Arrow)`
  border-top: 12px solid ${ARROW_COLOR};
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  bottom: 4px;
  left: ${CARD_WIDTH / 2 - 14}px;
`;

const BottomRightArrowOutline = styled(Arrow)`
  border-bottom: 23px solid ${ARROW_OUTLINE_COLOR};
  border-left: 23px solid transparent;
  bottom: 2px;
  right: 2px;
`;

const BottomRightArrow = styled(Arrow)`
  border-bottom: 16px solid ${ARROW_COLOR};
  border-left: 16px solid transparent;
  bottom: 4px;
  right: 4px;
`;

interface ICardStatsProps {
  readonly flipped: boolean;
  readonly hovering: boolean;
}

const CardStats = styled.div<ICardStatsProps>`
  position: absolute;
  width: ${CARD_WIDTH - 8}px;
  height: ${CARD_HEIGHT - 8}px;
  margin: 4px;
  color: transparent;
  display: flex;
  flex-direction: column;
  padding-top: 24px;
  align-items: center;
  cursor: default;
  font-size: 14px;
  transition: transform 0.5s;
  box-sizing: border-box;

  ${props => props.hovering && css`
    background-color: rgba(255, 255, 255, 0.8);
    color: black;
  `}

  ${props => props.flipped && `
    transform: rotateY(180deg);
  `}
`;

interface AtkDefIconProps {
  golden: boolean;
}

const AtkDefIcon = styled.img<AtkDefIconProps>`
  width: 17px;
  height: 17px;
  margin: 0 1px 0 3px;
`;

interface AtkDefValueContainerProps {
  readonly golden: boolean;
}

const AtkDefValueContainer = styled.span<AtkDefValueContainerProps>`
  ${props => props.golden ? css`color: gold;
    text-shadow: 0 0 8px black` : ``}
`;

function AtkDefValue(props: { value: number }) {
  return (
    <AtkDefValueContainer golden={props.value > 9}>
      {props.value > 9 ? props.value - 7 : props.value}
    </AtkDefValueContainer>
  );
}

export function HiddenCardComponent() {
  return (
    <CardContainer flipped={false} hovering={false} clickable={false} mini>
      <CardOutline belongsToPlayer={false} />
    </CardContainer>
  );
}

const getAtkTypeImg = (atkType: string) => {
  switch (atkType) {
    case "P":
      return SwordImage;
    case "M":
      return StaffImage;
    case "A":
      return DualImage;
    default:
      return UltiImage;
  }
}

const getGoldAtkTypeImg = (atkType: string) => {
  switch (atkType) {
    case "P":
      return GoldSwordImage;
    case "M":
      return GoldStaffImage;
    case "A":
      return DualImage;
    default:
      return UltiImage;
  }
}

export default function CardComponent(
  {
    card,
    belongsToPlayer,
    handleClick,
    overrideHovering,
    isAttacking,
    shimmering,
  }: IProps
) {
  const [hovering, setHovering] = useState(false);
  const trueHovering = hovering || !!overrideHovering;
  const atkTypeImage = (card.atk > 9) ? getGoldAtkTypeImg(card.atkType) : getAtkTypeImg(card.atkType);
  const pShieldImage = (card.pdef > 9 ) ? GoldPhysicShieldImage : PhysicShieldImage
  const mShieldImage = (card.mdef > 9 ) ? GoldMagicShieldImage : MagicShieldImage

  return (
    <CardContainer
      flipped={belongsToPlayer!}
      hovering={trueHovering}
      shimmering={shimmering}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={() => handleClick && handleClick()}
      clickable={!!handleClick}
      mini={false}
    >
      <CardOutline belongsToPlayer={belongsToPlayer!}>
        <CardNumbers flipped={belongsToPlayer!}>
          <AtkDefIcon src={atkTypeImage} alt={card.atkType} golden={card.atk > 9} />
          <AtkDefValue value={card.atk} />
          <AtkDefIcon src={pShieldImage} alt="P Def" golden={card.pdef > 9} />
          <AtkDefValue value={card.pdef} />
          <AtkDefIcon src={mShieldImage} alt="M Def" golden={card.mdef > 9} />
          <AtkDefValue value={card.mdef} />
        </CardNumbers>
        <CardImage flipped={belongsToPlayer!} imageUrl={card.getSpeciesImageUrl()} />
        <CardId flipped={belongsToPlayer!}>
          #{card.id}
        </CardId>
      </CardOutline>
      <CardStats flipped={belongsToPlayer!} hovering={trueHovering}>
        <div>{card.species}</div>
      </CardStats>
      <ArrowsContainerFlipper flipped={belongsToPlayer!}>
        <ArrowsContainer hovering={trueHovering || !!isAttacking}>
          {card.arrows[0] && <UpperLeftArrowOutline />}
          {card.arrows[0] && <UpperLeftArrow />}
          {card.arrows[1] && <UpperArrowOutline />}
          {card.arrows[1] && <UpperArrow />}
          {card.arrows[2] && <UpperRightArrowOutline />}
          {card.arrows[2] && <UpperRightArrow />}
          {card.arrows[3] && <LeftArrowOutline />}
          {card.arrows[3] && <LeftArrow />}
          {card.arrows[4] && <RightArrowOutline />}
          {card.arrows[4] && <RightArrow />}
          {card.arrows[5] && <BottomLeftArrowOutline />}
          {card.arrows[5] && <BottomLeftArrow />}
          {card.arrows[6] && <BottomArrowOutline />}
          {card.arrows[6] && <BottomArrow />}
          {card.arrows[7] && <BottomRightArrowOutline />}
          {card.arrows[7] && <BottomRightArrow />}
        </ArrowsContainer>
      </ArrowsContainerFlipper>
    </CardContainer>
  );
}

CardComponent.defaultProps = {
  belongsToPlayer: true,
  handleClick: undefined,
  overrideHovering: false,
  isAttacking: false,
  shimmering: false,
}
