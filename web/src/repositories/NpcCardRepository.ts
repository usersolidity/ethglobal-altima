import Card, { ArrowChoices } from "../models/Card";

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
  const response = {
    "set": [{
      "attributes": [{
        "trait_type": "Neck Accessory",
        "value": "Yellow Necktie"
      }, {
        "trait_type": "Animal",
        "value": "Tiger"
      }, {
        "trait_type": "Eye Accessory",
        "value": "Red Skull Eyepatch"
      }, {
        "trait_type": "Top Accessory",
        "value": "Mustard Police Cap"
      }, {
        "trait_type": "Side Accessory",
        "value": "Red Popcorn"
      }, {
        "trait_type": "Attack",
        "value": "6"
      }, {
        "trait_type": "Attack Type",
        "value": "Sword"
      }, {
        "trait_type": "Physical Defense",
        "value": "C"
      }, {
        "trait_type": "Magic Defense",
        "value": "5"
      }, {
        "trait_type": "Agility Arrows",
        "value": "00111000"
      }],
      "compiler": "HashLips Art Engine",
      "date": 1634900763846,
      "description": "This is the description of your NFT project, remember to replace this",
      "display_image": "ipfs://baseDisplayUri/1.png",
      "dna": "e858034cc036290a86aaf9b7afb8b85fc1a86349",
      "edition": 1,
      "image": "ipfs://baseUri/1.png",
      "name": "#1"
    }, {
      "attributes": [{
        "trait_type": "Neck Accessory",
        "value": "Red Floater"
      }, {
        "trait_type": "Animal",
        "value": "Mouse"
      }, {
        "trait_type": "Eye Accessory",
        "value": "Pink Monocle"
      }, {
        "trait_type": "Top Accessory",
        "value": "Blue Nurse Cap"
      }, {
        "trait_type": "Side Accessory",
        "value": "Cup of Blue Tea"
      }, {
        "trait_type": "Attack",
        "value": "8"
      }, {
        "trait_type": "Attack Type",
        "value": "Wand"
      }, {
        "trait_type": "Physical Defense",
        "value": "9"
      }, {
        "trait_type": "Magic Defense",
        "value": "6"
      }, {
        "trait_type": "Agility Arrows",
        "value": "01111001"
      }],
      "compiler": "HashLips Art Engine",
      "date": 1634900763971,
      "description": "This is the description of your NFT project, remember to replace this",
      "display_image": "ipfs://baseDisplayUri/2.png",
      "dna": "82e30da10a222de7faf5d46b63f89540a9893d84",
      "edition": 2,
      "image": "ipfs://baseUri/2.png",
      "name": "#2"
    }, {
      "attributes": [{
        "trait_type": "Neck Accessory",
        "value": "Cyan Dog Tag"
      }, {
        "trait_type": "Animal",
        "value": "Corgi"
      }, {
        "trait_type": "Eye Accessory",
        "value": "Green Skull Eyepatch"
      }, {
        "trait_type": "Top Accessory",
        "value": "Red Bowler Hat"
      }, {
        "trait_type": "Side Accessory",
        "value": "Soul Staff"
      }, {
        "trait_type": "Attack",
        "value": "5"
      }, {
        "trait_type": "Attack Type",
        "value": "Sword"
      }, {
        "trait_type": "Physical Defense",
        "value": "7"
      }, {
        "trait_type": "Magic Defense",
        "value": "9"
      }, {
        "trait_type": "Agility Arrows",
        "value": "10001010"
      }],
      "compiler": "HashLips Art Engine",
      "date": 1634900764105,
      "description": "This is the description of your NFT project, remember to replace this",
      "display_image": "ipfs://baseDisplayUri/3.png",
      "dna": "f014a4ca54cbcd5b426b75bb4b034017cc78b4e7",
      "edition": 3,
      "image": "ipfs://baseUri/3.png",
      "name": "#3"
    }, {
      "attributes": [{
        "trait_type": "Neck Accessory",
        "value": "Blue Leather Gorget"
      }, {
        "trait_type": "Animal",
        "value": "Rabbit"
      }, {
        "trait_type": "Eye Accessory",
        "value": "Blue Skull Eyepatch"
      }, {
        "trait_type": "Top Accessory",
        "value": "Orange Party Hat"
      }, {
        "trait_type": "Attack",
        "value": "7"
      }, {
        "trait_type": "Attack Type",
        "value": "Wand"
      }, {
        "trait_type": "Physical Defense",
        "value": "C"
      }, {
        "trait_type": "Magic Defense",
        "value": "6"
      }, {
        "trait_type": "Agility Arrows",
        "value": "00101111"
      }],
      "compiler": "HashLips Art Engine",
      "date": 1634900764246,
      "description": "This is the description of your NFT project, remember to replace this",
      "display_image": "ipfs://baseDisplayUri/4.png",
      "dna": "91ac80dd76a87b228d99729663b695c5e29e8bfd",
      "edition": 4,
      "image": "ipfs://baseUri/4.png",
      "name": "#4"
    }, {
      "attributes": [{
        "trait_type": "Neck Accessory",
        "value": "Cyan Dog Tag"
      }, {
        "trait_type": "Animal",
        "value": "Rabbit"
      }, {
        "trait_type": "Eye Accessory",
        "value": "Pink Smart Glasses"
      }, {
        "trait_type": "Top Accessory",
        "value": "Red Flat Cap"
      }, {
        "trait_type": "Side Accessory",
        "value": "Green Purple Racket and Cyan Tennis Ball"
      }, {
        "trait_type": "Attack",
        "value": "7"
      }, {
        "trait_type": "Attack Type",
        "value": "Sword"
      }, {
        "trait_type": "Physical Defense",
        "value": "7"
      }, {
        "trait_type": "Magic Defense",
        "value": "2"
      }, {
        "trait_type": "Agility Arrows",
        "value": "11110111"
      }],
      "compiler": "HashLips Art Engine",
      "date": 1634900764390,
      "description": "This is the description of your NFT project, remember to replace this",
      "display_image": "ipfs://baseDisplayUri/5.png",
      "dna": "2658faf94134a9155bad370bb8f1b8d1723deec4",
      "edition": 5,
      "image": "ipfs://baseUri/5.png",
      "name": "#5"
    }, {
      "attributes": [{
        "trait_type": "Neck Accessory",
        "value": "YelloW Fur Collar"
      }, {
        "trait_type": "Animal",
        "value": "Horse"
      }, {
        "trait_type": "Eye Accessory",
        "value": "Violet Monocle"
      }, {
        "trait_type": "Side Accessory",
        "value": "Purple Green Racket and Orange Tennis Ball"
      }, {
        "trait_type": "Attack",
        "value": "9"
      }, {
        "trait_type": "Attack Type",
        "value": "Wand"
      }, {
        "trait_type": "Physical Defense",
        "value": "A"
      }, {
        "trait_type": "Magic Defense",
        "value": "9"
      }, {
        "trait_type": "Agility Arrows",
        "value": "01110001"
      }],
      "compiler": "HashLips Art Engine",
      "date": 1634900764523,
      "description": "This is the description of your NFT project, remember to replace this",
      "display_image": "ipfs://baseDisplayUri/6.png",
      "dna": "e9df9e4d3fdb5f65f162a8bc25eaab99da816899",
      "edition": 6,
      "image": "ipfs://baseUri/6.png",
      "name": "#6"
    }, {
      "attributes": [{
        "trait_type": "Neck Accessory",
        "value": "Blue Ruff Collar"
      }, {
        "trait_type": "Animal",
        "value": "Eagle"
      }, {
        "trait_type": "Eye Accessory",
        "value": "Red Aviator Goggles"
      }, {
        "trait_type": "Top Accessory",
        "value": "Blue Police Cap"
      }, {
        "trait_type": "Side Accessory",
        "value": "Cup of Yellow Tea"
      }, {
        "trait_type": "Attack",
        "value": "6"
      }, {
        "trait_type": "Attack Type",
        "value": "Sword"
      }, {
        "trait_type": "Physical Defense",
        "value": "6"
      }, {
        "trait_type": "Magic Defense",
        "value": "B"
      }, {
        "trait_type": "Agility Arrows",
        "value": "10010111"
      }],
      "compiler": "HashLips Art Engine",
      "date": 1634900764646,
      "description": "This is the description of your NFT project, remember to replace this",
      "display_image": "ipfs://baseDisplayUri/7.png",
      "dna": "e28852751d623542e166ee95bdd1daacfbe4cde0",
      "edition": 7,
      "image": "ipfs://baseUri/7.png",
      "name": "#7"
    }, {
      "attributes": [{
        "trait_type": "Neck Accessory",
        "value": "Pink Fur Collar"
      }, {
        "trait_type": "Animal",
        "value": "Rabbit"
      }, {
        "trait_type": "Eye Accessory",
        "value": "Blue and Red Cateye Glasses"
      }, {
        "trait_type": "Top Accessory",
        "value": "Maroon Pirate Hat"
      }, {
        "trait_type": "Side Accessory",
        "value": "Red Ribbon"
      }, {
        "trait_type": "Attack",
        "value": "6"
      }, {
        "trait_type": "Attack Type",
        "value": "Sword"
      }, {
        "trait_type": "Physical Defense",
        "value": "5"
      }, {
        "trait_type": "Magic Defense",
        "value": "4"
      }, {
        "trait_type": "Agility Arrows",
        "value": "00001111"
      }],
      "compiler": "HashLips Art Engine",
      "date": 1634900764787,
      "description": "This is the description of your NFT project, remember to replace this",
      "display_image": "ipfs://baseDisplayUri/8.png",
      "dna": "fa6b5f80df985b74cdc0e0fa489f7d8c6f24bb52",
      "edition": 8,
      "image": "ipfs://baseUri/8.png",
      "name": "#8"
    }, {
      "attributes": [{
        "trait_type": "Neck Accessory",
        "value": "Blue Bandana"
      }, {
        "trait_type": "Animal",
        "value": "Dragon"
      }, {
        "trait_type": "Eye Accessory",
        "value": "Blue and Red Cateye Glasses"
      }, {
        "trait_type": "Top Accessory",
        "value": "Mustard Police Cap"
      }, {
        "trait_type": "Attack",
        "value": "9"
      }, {
        "trait_type": "Attack Type",
        "value": "Ultimate"
      }, {
        "trait_type": "Physical Defense",
        "value": "6"
      }, {
        "trait_type": "Magic Defense",
        "value": "7"
      }, {
        "trait_type": "Agility Arrows",
        "value": "01100011"
      }],
      "compiler": "HashLips Art Engine",
      "date": 1634900764894,
      "description": "This is the description of your NFT project, remember to replace this",
      "display_image": "ipfs://baseDisplayUri/9.png",
      "dna": "07f7ecf0658b03068b114f808eef7b6c89efa559",
      "edition": 9,
      "image": "ipfs://baseUri/9.png",
      "name": "#9"
    }, {
      "attributes": [{
        "trait_type": "Neck Accessory",
        "value": "Red Headphones"
      }, {
        "trait_type": "Animal",
        "value": "Monkey"
      }, {
        "trait_type": "Eye Accessory",
        "value": "Blue and Red Cateye Glasses"
      }, {
        "trait_type": "Top Accessory",
        "value": "Green Fez Hat"
      }, {
        "trait_type": "Side Accessory",
        "value": "Cup of Yellow Tea"
      }, {
        "trait_type": "Attack",
        "value": "5"
      }, {
        "trait_type": "Attack Type",
        "value": "Wand"
      }, {
        "trait_type": "Physical Defense",
        "value": "6"
      }, {
        "trait_type": "Magic Defense",
        "value": "7"
      }, {
        "trait_type": "Agility Arrows",
        "value": "10011001"
      }],
      "compiler": "HashLips Art Engine",
      "date": 1634900765007,
      "description": "This is the description of your NFT project, remember to replace this",
      "display_image": "ipfs://baseDisplayUri/10.png",
      "dna": "f005b4b083569b59252aa8d4cc4bb5dd24797164",
      "edition": 10,
      "image": "ipfs://baseUri/10.png",
      "name": "#10"
    }, {
      "attributes": [{
        "trait_type": "Neck Accessory",
        "value": "Green Bowtie"
      }, {
        "trait_type": "Animal",
        "value": "Bull"
      }, {
        "trait_type": "Eye Accessory",
        "value": "Brown Round Glasses"
      }, {
        "trait_type": "Side Accessory",
        "value": "Violet Popcorn"
      }, {
        "trait_type": "Attack",
        "value": "7"
      }, {
        "trait_type": "Attack Type",
        "value": "Sword"
      }, {
        "trait_type": "Physical Defense",
        "value": "4"
      }, {
        "trait_type": "Magic Defense",
        "value": "5"
      }, {
        "trait_type": "Agility Arrows",
        "value": "10001010"
      }],
      "compiler": "HashLips Art Engine",
      "date": 1634900765166,
      "description": "This is the description of your NFT project, remember to replace this",
      "display_image": "ipfs://baseDisplayUri/11.png",
      "dna": "88a5c5a535d719e3e8b1847e1f776d1a9fe087f6",
      "edition": 11,
      "image": "ipfs://baseUri/11.png",
      "name": "#11"
    }, {
      "attributes": [{
        "trait_type": "Neck Accessory",
        "value": "Argentium Medallion Necklace"
      }, {
        "trait_type": "Animal",
        "value": "Corgi"
      }, {
        "trait_type": "Eye Accessory",
        "value": "Blue Round Glasses"
      }, {
        "trait_type": "Top Accessory",
        "value": "Red Nurse Cap"
      }, {
        "trait_type": "Attack",
        "value": "8"
      }, {
        "trait_type": "Attack Type",
        "value": "Wand"
      }, {
        "trait_type": "Physical Defense",
        "value": "A"
      }, {
        "trait_type": "Magic Defense",
        "value": "C"
      }, {
        "trait_type": "Agility Arrows",
        "value": "11100110"
      }],
      "compiler": "HashLips Art Engine",
      "date": 1634900765278,
      "description": "This is the description of your NFT project, remember to replace this",
      "display_image": "ipfs://baseDisplayUri/12.png",
      "dna": "5ae34d03b757a771d31245420e8e6d1387d75631",
      "edition": 12,
      "image": "ipfs://baseUri/12.png",
      "name": "#12"
    }, {
      "attributes": [{
        "trait_type": "Neck Accessory",
        "value": "Red Bandana"
      }, {
        "trait_type": "Animal",
        "value": "Eagle"
      }, {
        "trait_type": "Eye Accessory",
        "value": "Green Aviator Goggles"
      }, {
        "trait_type": "Top Accessory",
        "value": "Green Chef Hat"
      }, {
        "trait_type": "Side Accessory",
        "value": "Yellow Ribbon"
      }, {
        "trait_type": "Attack",
        "value": "8"
      }, {
        "trait_type": "Attack Type",
        "value": "Dual"
      }, {
        "trait_type": "Physical Defense",
        "value": "9"
      }, {
        "trait_type": "Magic Defense",
        "value": "B"
      }, {
        "trait_type": "Agility Arrows",
        "value": "01000000"
      }],
      "compiler": "HashLips Art Engine",
      "date": 1634900765391,
      "description": "This is the description of your NFT project, remember to replace this",
      "display_image": "ipfs://baseDisplayUri/13.png",
      "dna": "7979be6a10bcd68d3bea8f035da6d7a320ec0a9c",
      "edition": 13,
      "image": "ipfs://baseUri/13.png",
      "name": "#13"
    }, {
      "attributes": [{
        "trait_type": "Neck Accessory",
        "value": "Blue Floater"
      }, {
        "trait_type": "Animal",
        "value": "Horse"
      }, {
        "trait_type": "Eye Accessory",
        "value": "Red and Green 3D Glasses"
      }, {
        "trait_type": "Top Accessory",
        "value": "Red Party Hat"
      }, {
        "trait_type": "Side Accessory",
        "value": "Cup of Green Tea"
      }, {
        "trait_type": "Attack",
        "value": "C"
      }, {
        "trait_type": "Attack Type",
        "value": "Wand"
      }, {
        "trait_type": "Physical Defense",
        "value": "7"
      }, {
        "trait_type": "Magic Defense",
        "value": "4"
      }, {
        "trait_type": "Agility Arrows",
        "value": "00011001"
      }],
      "compiler": "HashLips Art Engine",
      "date": 1634900765513,
      "description": "This is the description of your NFT project, remember to replace this",
      "display_image": "ipfs://baseDisplayUri/14.png",
      "dna": "b2e316512027efe35a8a4eba0b61dfcf48ad4be3",
      "edition": 14,
      "image": "ipfs://baseUri/14.png",
      "name": "#14"
    }, {
      "attributes": [{
        "trait_type": "Neck Accessory",
        "value": "Pink Floater"
      }, {
        "trait_type": "Animal",
        "value": "Monkey"
      }, {
        "trait_type": "Eye Accessory",
        "value": "Blue Visor"
      }, {
        "trait_type": "Top Accessory",
        "value": "Blue Nurse Cap"
      }, {
        "trait_type": "Side Accessory",
        "value": "Purple Green Racket and Red Tennis Ball"
      }, {
        "trait_type": "Attack",
        "value": "5"
      }, {
        "trait_type": "Attack Type",
        "value": "Sword"
      }, {
        "trait_type": "Physical Defense",
        "value": "A"
      }, {
        "trait_type": "Magic Defense",
        "value": "7"
      }, {
        "trait_type": "Agility Arrows",
        "value": "11100010"
      }],
      "compiler": "HashLips Art Engine",
      "date": 1634900765631,
      "description": "This is the description of your NFT project, remember to replace this",
      "display_image": "ipfs://baseDisplayUri/15.png",
      "dna": "ca1e35f3a31d655afca02d5b28d885d8f5075063",
      "edition": 15,
      "image": "ipfs://baseUri/15.png",
      "name": "#15"
    }, {
      "attributes": [{
        "trait_type": "Neck Accessory",
        "value": "Blue Chains"
      }, {
        "trait_type": "Animal",
        "value": "Rabbit"
      }, {
        "trait_type": "Eye Accessory",
        "value": "Orange Visor"
      }, {
        "trait_type": "Top Accessory",
        "value": "Green Flat Cap"
      }, {
        "trait_type": "Side Accessory",
        "value": "Cup of Red Tea"
      }, {
        "trait_type": "Attack",
        "value": "6"
      }, {
        "trait_type": "Attack Type",
        "value": "Wand"
      }, {
        "trait_type": "Physical Defense",
        "value": "4"
      }, {
        "trait_type": "Magic Defense",
        "value": "A"
      }, {
        "trait_type": "Agility Arrows",
        "value": "11110111"
      }],
      "compiler": "HashLips Art Engine",
      "date": 1634900765742,
      "description": "This is the description of your NFT project, remember to replace this",
      "display_image": "ipfs://baseDisplayUri/16.png",
      "dna": "455260032621cb38e3c6b090ee605850ce4ed297",
      "edition": 16,
      "image": "ipfs://baseUri/16.png",
      "name": "#16"
    }, {
      "attributes": [{
        "trait_type": "Neck Accessory",
        "value": "Green Bandana"
      }, {
        "trait_type": "Animal",
        "value": "Mouse"
      }, {
        "trait_type": "Eye Accessory",
        "value": "Brown Round Glasses"
      }, {
        "trait_type": "Top Accessory",
        "value": "Red Bowler Hat"
      }, {
        "trait_type": "Side Accessory",
        "value": "Green Sai"
      }, {
        "trait_type": "Attack",
        "value": "9"
      }, {
        "trait_type": "Attack Type",
        "value": "Sword"
      }, {
        "trait_type": "Physical Defense",
        "value": "6"
      }, {
        "trait_type": "Magic Defense",
        "value": "6"
      }, {
        "trait_type": "Agility Arrows",
        "value": "10011111"
      }],
      "compiler": "HashLips Art Engine",
      "date": 1634900765862,
      "description": "This is the description of your NFT project, remember to replace this",
      "display_image": "ipfs://baseDisplayUri/17.png",
      "dna": "ce27f2e117e62a8fe4b9ce0c211c7c360d1b7b2d",
      "edition": 17,
      "image": "ipfs://baseUri/17.png",
      "name": "#17"
    }, {
      "attributes": [{
        "trait_type": "Neck Accessory",
        "value": "Green Bandana"
      }, {
        "trait_type": "Animal",
        "value": "Monkey"
      }, {
        "trait_type": "Top Accessory",
        "value": "Blue Fez Hat"
      }, {
        "trait_type": "Attack",
        "value": "8"
      }, {
        "trait_type": "Attack Type",
        "value": "Wand"
      }, {
        "trait_type": "Physical Defense",
        "value": "7"
      }, {
        "trait_type": "Magic Defense",
        "value": "8"
      }, {
        "trait_type": "Agility Arrows",
        "value": "00000010"
      }],
      "compiler": "HashLips Art Engine",
      "date": 1634900765962,
      "description": "This is the description of your NFT project, remember to replace this",
      "display_image": "ipfs://baseDisplayUri/18.png",
      "dna": "e1b0f8db1fc611c18809460c3bc077c8ccfa16e3",
      "edition": 18,
      "image": "ipfs://baseUri/18.png",
      "name": "#18"
    }, {
      "attributes": [{
        "trait_type": "Neck Accessory",
        "value": "Blue Headphones"
      }, {
        "trait_type": "Animal",
        "value": "Rabbit"
      }, {
        "trait_type": "Eye Accessory",
        "value": "Blue and Red Cateye Glasses"
      }, {
        "trait_type": "Top Accessory",
        "value": "Blue Sorcerer Hat"
      }, {
        "trait_type": "Side Accessory",
        "value": "Blue Ribbon"
      }, {
        "trait_type": "Attack",
        "value": "7"
      }, {
        "trait_type": "Attack Type",
        "value": "Wand"
      }, {
        "trait_type": "Physical Defense",
        "value": "8"
      }, {
        "trait_type": "Magic Defense",
        "value": "6"
      }, {
        "trait_type": "Agility Arrows",
        "value": "11010001"
      }],
      "compiler": "HashLips Art Engine",
      "date": 1634900766086,
      "description": "This is the description of your NFT project, remember to replace this",
      "display_image": "ipfs://baseDisplayUri/19.png",
      "dna": "32c50ffe85b4269f40bb6a8a47547649b0a2e909",
      "edition": 19,
      "image": "ipfs://baseUri/19.png",
      "name": "#19"
    }, {
      "attributes": [{
        "trait_type": "Neck Accessory",
        "value": "Red Chains"
      }, {
        "trait_type": "Animal",
        "value": "Eagle"
      }, {
        "trait_type": "Eye Accessory",
        "value": "Purple Shades"
      }, {
        "trait_type": "Top Accessory",
        "value": "Red Party Hat"
      }, {
        "trait_type": "Side Accessory",
        "value": "Golden Revolver"
      }, {
        "trait_type": "Attack",
        "value": "5"
      }, {
        "trait_type": "Attack Type",
        "value": "Wand"
      }, {
        "trait_type": "Physical Defense",
        "value": "3"
      }, {
        "trait_type": "Magic Defense",
        "value": "A"
      }, {
        "trait_type": "Agility Arrows",
        "value": "00001100"
      }],
      "compiler": "HashLips Art Engine",
      "date": 1634900766189,
      "description": "This is the description of your NFT project, remember to replace this",
      "display_image": "ipfs://baseDisplayUri/20.png",
      "dna": "dd530a42797a3fda0ca5a9ba315ec0a722c353b5",
      "edition": 20,
      "image": "ipfs://baseUri/20.png",
      "name": "#20"
    }]
  }

  return response.set.map(mapMetadataToCard);
}
