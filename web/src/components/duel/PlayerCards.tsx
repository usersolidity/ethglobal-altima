import styled from "styled-components";
import React, { useEffect, useState } from "react";
import CardComponent from "./CardComponent";
import { fetchCardsOfProfile } from "../../repositories/NpcCardRepository";
import Card from "../../models/Card";

interface IProps {
  web3: any;
  altimaAbi: any;
  altimaContractAddress: string;
  account: string;
  claimCount: number;
}

const CardsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

const RefreshButton = styled.button`
  border: none;
  background: none;
  color: darkred;
  font-size: 12px;
  align-self: center;
  cursor: pointer;
  transition: all 0.25s;
  font-weight: bold;

  :hover {
    color: white;
  }
`;

function PlayerCards({ web3, altimaAbi, altimaContractAddress, account, claimCount }: IProps) {
  const [cards, setCards] = useState<Card[] | null>(null);

  const refreshPlayerCards = (force: boolean = false) => {
    (async () => {
      const profileCards = await fetchCardsOfProfile(account, web3, altimaAbi, altimaContractAddress, force);
      setCards(profileCards);
    })();
  }

  useEffect(() => refreshPlayerCards(true), [claimCount]);

  const getCards = () => {
    if (cards === null) {
      return (
        <div>Loading... Please hit the refresh button above.</div>
      );
    }
    if (cards.length === 0) {
      return (
        <div>You have no cards yet. Click the mint button above to get 5 cards FOR FREE + gas fees.</div>
      )
    }
    return cards.map(card => (
      <CardComponent card={card} key={card.id} />
    ))
  }

  return (
    <>
      <h1>
        Your card collection
        <RefreshButton type="button" onClick={() => refreshPlayerCards()}>(refresh)</RefreshButton>
      </h1>
      <CardsContainer>
        {getCards()}
      </CardsContainer>
    </>
  );
}

export default PlayerCards;
