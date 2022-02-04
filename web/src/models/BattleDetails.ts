import SwordImage from "../images/icons/sword.png";
import StaffImage from "../images/icons/staff.png";
import PhysicShieldImage from "../images/icons/pshield.png";
import MagicShieldImage from "../images/icons/mshield.png";
import DualImage from "../images/icons/dual.png";
import UltiImage from "../images/icons/ulti.png";

export default class BattleDetails {
  readonly atkType: string;

  readonly defType: string;

  readonly atk: number;

  readonly def: number;

  readonly flipBattleLost: boolean;

  constructor(atkType: string, defType: string, atk: number, def: number, flipBattleLost: boolean) {
    this.atkType = atkType;
    this.defType = defType;
    this.atk = atk;
    this.def = def;
    this.flipBattleLost = flipBattleLost;
  }

  getAtkIcon() {
    switch (this.atkType) {
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

  getDefIcon() {
    if (this.defType === "P") {
      return PhysicShieldImage;
    }
    return MagicShieldImage;
  }
}
