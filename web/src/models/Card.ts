import Cat from "../images/species/cat.png";
import Fox from "../images/species/fox.png";
import Lion from "../images/species/lion.png";
import Ostrich from "../images/species/ostrich.png";

export enum Species {
  CAT = "Cat",
  FOX = "Fox",
  LION = "Lion",
  OSTRICH = "Ostrich",
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
    if (this.species === Species.CAT) {
      return Cat;
    }
    if (this.species === Species.FOX) {
      return Fox;
    }
    if (this.species === Species.LION) {
      return Lion;
    }
    if (this.species === Species.OSTRICH) {
      return Ostrich;
    }
    return `/images/${this.id}`
  }

  public getFullName() {
    return `${this.species}`;
  }
}
