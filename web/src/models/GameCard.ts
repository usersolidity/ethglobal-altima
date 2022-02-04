import Card, { ArrowChoices, Species } from "./Card";

export default class GameCard extends Card {
  belongsToPlayer: boolean;

  rarityScore: number;

  constructor(
    belongsToPlayer: boolean,
    id: number,
    species: Species,
    arrows: ArrowChoices,
    atk: number,
    atkType: string,
    pdef: number,
    mdef: number,
    ownerId: string,
  ) {
    super(
      id,
      species,
      arrows,
      atk,
      atkType,
      pdef,
      mdef,
      ownerId,
    )
    this.belongsToPlayer = belongsToPlayer;
    this.rarityScore = this.getRarityScore();
  }

  private getRarityScore(): number {
    const arrowCount = this.arrows.reduce((a, b) => a + (b ? 1 : 0), 0);
    const arrowScore = 2 ** (arrowCount - 1);
    const atkTypeScore = ["X", "A"].includes(this.atkType) ? 2 : 0;
    const atkScore = (this.atk + atkTypeScore) * arrowScore;
    const defScore = (this.pdef + this.mdef) * arrowScore;

    return arrowCount + atkScore + defScore;
  }

  public canCounter(offsetX: number, offsetY: number) {
    const counterOffsetX = -offsetX;
    const counterOffsetY = -offsetY;
    const counterX = counterOffsetX + 1;
    const counterY = counterOffsetY + 1;

    const counterArrowIndex = counterY * 3 + counterX < 4 ? counterY * 3 + counterX : counterY * 3 + counterX - 1;

    return this.arrows[counterArrowIndex];
  }

  public flip() {
    this.belongsToPlayer = !this.belongsToPlayer;
  }

  public copy() {
    return new GameCard(
      this.belongsToPlayer,
      this.id,
      this.species,
      this.arrows,
      this.atk,
      this.atkType,
      this.pdef,
      this.mdef,
      this.ownerId,
    );
  }

  static createFromCard(belongsToPlayer: boolean, card: Card) {
    return new GameCard(
      belongsToPlayer,
      card.id,
      card.species,
      card.arrows,
      card.atk,
      card.atkType,
      card.pdef,
      card.mdef,
      card.ownerId
    );
  }
}
