import Card, { ArrowChoices } from "../models/Card";
import metadata from "../nft/metadata.json";

interface ICardMap {
  [id: number]: Card;
}

const CARDS: ICardMap = {};

function hexadecimalToNumber(hexadecimal: string) {
  switch (hexadecimal) {
    case "A":
      return 10;
    case "B":
      return 11;
    case "C":
      return 12;
    case "D":
      return 13;
    case "E":
      return 14;
    case "F":
      return 15;
    default:
      return parseInt(hexadecimal, 10);
  }
}

const convertAgilityArrows = (agilityArrows: string): ArrowChoices => {
  return agilityArrows.split("").map(arrow => arrow === "1") as ArrowChoices;
}

const convertAtkType = (atkType: string): string => {
  switch (atkType) {
    case "S":
      return "P";
    case "W":
      return "M";
    case "D":
      return "A";
    default:
      return "L";
  }
}

function mapMetadataToCard(metadata: any): Card {
  return new Card(
    metadata.edition,
    metadata.attributes.find((attribute: any) => attribute.trait_type === "Animal").value,
    convertAgilityArrows(metadata.attributes.find((attribute: any) => attribute.trait_type === "Agility Arrows").value),
    hexadecimalToNumber(metadata.attributes.find((attribute: any) => attribute.trait_type === "Attack").value),
    convertAtkType(metadata.attributes.find((attribute: any) => attribute.trait_type === "Attack Type").value[0]),
    hexadecimalToNumber(metadata.attributes.find((attribute: any) => attribute.trait_type === "Physical Defense").value),
    hexadecimalToNumber(metadata.attributes.find((attribute: any) => attribute.trait_type === "Magic Defense").value),
    "123",
  );
}

export async function fetchCard(id: number): Promise<Card> {
  if (CARDS[id]) {
    return CARDS[id];
  }
  const metadata = await (await fetch(`/metadata/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })).json()

  const card = mapMetadataToCard(metadata);
  CARDS[id] = card;
  return card;
}

interface IProfileCardsMap {
  [id: string]: Array<Card>;
}

const PROFILE_CARDS: IProfileCardsMap = {};

export async function fetchCardsOfProfile(
  id: string,
  web3: any,
  altimaAbi: any,
  altimaContractAddress: string,
  force: boolean,
): Promise<Array<Card>> {
  if (!force && PROFILE_CARDS[id]) {
    PROFILE_CARDS[id] = [...PROFILE_CARDS[id]];
    return PROFILE_CARDS[id];
  }
  PROFILE_CARDS[id] = [];
  const altimaContract = new web3.eth.Contract(altimaAbi!, altimaContractAddress);
  const balance = parseInt(await altimaContract.methods.balanceOf(id).call(), 10);
  for await (const index of Array.from(Array(balance).keys())) {
    const cardId = await altimaContract.methods.tokenOfOwnerByIndex(id, index).call();
    const card = await fetchCard(cardId);
    PROFILE_CARDS[id].push(card);
  }
  return PROFILE_CARDS[id];
}

export async function fetchCardsWithOffset(count: number, offset: number): Promise<Array<Card>> {
  return metadata.map(mapMetadataToCard).slice(offset, count + offset)
}
