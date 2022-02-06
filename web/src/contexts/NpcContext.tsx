import React, { createContext, PropsWithChildren, useEffect, useState } from "react";
import Card from "../models/Card";
import { fetchCardsWithOffset } from "../repositories/NpcCardRepository";

type NpcContextValue = {
  cards: Array<Card> | null,
}

export const NpcContext = createContext<NpcContextValue | null>(null);

interface IProps {

}

export default function NpcContextProvider(props: PropsWithChildren<IProps>) {
  const [cards, setCards] = useState<Array<Card> | null>(null);

  useEffect(() => {
    (async () => {
      setCards(await fetchCardsWithOffset(
        100, 1,
      ));
    })();
  }, []);

  return (
    <NpcContext.Provider
      value={{
        cards,
      }}
    >
      {props.children}
    </NpcContext.Provider>
  )
}
