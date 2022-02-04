/*
import Eagle from "../images/placeholders/eagle.png";
import Dragon from "../images/placeholders/dragon.png";
import Boar from "../images/placeholders/boar.png";
import Mouse from "../images/placeholders/mouse.png";
import Dog from "../images/placeholders/dog.png";
import Doge from "../images/placeholders/doge.png";
import Monkey from "../images/placeholders/monkey.png";
import Goat from "../images/placeholders/goat.png";
import Bear from "../images/placeholders/panda.png";
import Rabbit from "../images/placeholders/bunny.png";
import Horse from "../images/placeholders/horse.png";
import Bull from "../images/placeholders/bull.png";
import Tiger from "../images/placeholders/tiger.png";
*/

export enum Species {
  BEAR = "Bear",
  GOAT = "Goat",
  MONKEY = "Monkey",
  EAGLE = "Eagle",
  DOG = "Dog",
  DOGE = "Doge",
  BOAR = "Boar",
  MOUSE = "Mouse",
  RABBIT = "Rabbit",
  DRAGON = "Dragon",
  HORSE = "Horse",
  BULL = "Bull",
  TIGER = "Tiger",
}

export type ArrowChoices = [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean];

export const ARROW_CHOICES: Array<ArrowChoices> = Array(255)
  .fill(null)
  .map((_, i) => {
    const x = i + 1;
    return [
      Math.floor(x / 128) === 1,
      Math.floor(x / 64) % 2 === 1,
      Math.floor(x / 32) % 2 === 1,
      Math.floor(x / 16) % 2 === 1,
      Math.floor(x / 8) % 2 === 1,
      Math.floor(x / 4) % 2 === 1,
      Math.floor(x / 2) % 2 === 1,
      x % 2 === 1,
    ];
  });

export default class Card {
  id: number;

  species: Species;

  arrows: ArrowChoices;

  atk: number;

  atkType: string;

  pdef: number;

  mdef: number;

  ownerId: string;

  constructor(
    id: number,
    species: Species,
    arrows: ArrowChoices,
    atk: number,
    atkType: string,
    pdef: number,
    mdef: number,
    ownerId: string,
  ) {
    this.id = id;
    this.species = species;
    this.arrows = arrows;
    this.ownerId = ownerId;
    this.atk = atk;
    this.atkType = atkType;
    this.pdef = pdef;
    this.mdef = mdef;
  }

  getSpeciesImageUrl() {
    return `/images/${this.id}`
  }

  public getFullName() {
    return `${this.species}`;
  }
}
