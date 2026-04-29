import { EnchantmentType, type Enchantment } from "@minecraft/server";

export default class EnchantInstance {
  public constructor(
    private typeId: string,
    private level = 1,
  ) {}

  public SetTypeId(typeId: string): EnchantInstance {
    this.typeId = typeId;

    return this;
  }
  public SetLevel(level: number): EnchantInstance {
    this.level = level;

    return this;
  }

  public GetTypeId(): string {
    return this.typeId;
  }
  public GetLevel(): number {
    return this.level;
  }

  public Build(): Enchantment {
    return {
      level: this.level,
      type: new EnchantmentType(this.typeId),
    } as Enchantment;
  }
}
