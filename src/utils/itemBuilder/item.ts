import { ItemComponentTypes, ItemLockMode, ItemStack } from "@minecraft/server";
import type EnchantInstance from "./enchant";
import type { PropertyType } from "./types";

export default class ItemInstance {
  private nameTag?: string;
  private damage?: number;
  private keepOnDeath = false;
  private lore?: string[];
  private lockMode: ItemLockMode = ItemLockMode.none;
  private enchants?: EnchantInstance[];
  private properties?: Record<string, any>;

  public constructor(
    private typeId: string,
    private amount = 1,
  ) {}

  public SetTypeId(typeId: string): ItemInstance {
    this.typeId = typeId;

    return this;
  }
  public SetAmount(amount: number): ItemInstance {
    this.amount = amount;

    return this;
  }
  public SetNameTag(nameTag: string): ItemInstance {
    this.nameTag = nameTag;

    return this;
  }
  public SetDamage(damage: number): ItemInstance {
    this.damage = damage;

    return this;
  }
  public SetKeepOnDeath(keepOnDeath: boolean): ItemInstance {
    this.keepOnDeath = keepOnDeath;

    return this;
  }
  public SetLore(lore: string[]): ItemInstance {
    this.lore = lore;

    return this;
  }
  public SetLockMode(lockMode: ItemLockMode): ItemInstance {
    this.lockMode = lockMode;

    return this;
  }
  public SetEnchants(enchants: EnchantInstance[]): ItemInstance {
    this.enchants = enchants;

    return this;
  }
  public SetProperties(properties: Record<string, any>): ItemInstance {
    this.properties = properties;

    return this;
  }

  public GetTypeId(): string {
    return this.typeId;
  }
  public GetAmount(): number {
    return this.amount;
  }
  public GetNameTag(): string | undefined {
    return this.nameTag;
  }
  public GetDamage(): number | undefined {
    return this.damage;
  }
  public GetKeepOnDeath(): boolean {
    return this.keepOnDeath;
  }
  public GetLore(): string[] | undefined {
    return this.lore;
  }
  public GetLockMode(): ItemLockMode {
    return this.lockMode;
  }
  public GetEnchants(): EnchantInstance[] | undefined {
    return this.enchants;
  }
  public GetProperties(): Record<string, any> | undefined {
    return this.properties;
  }

  public AddEnchant(enchant: EnchantInstance): ItemInstance {
    if (!this.enchants) {
      this.enchants = [];
    }

    this.enchants.push(enchant);

    return this;
  }
  public AddProperty(key: string, value: PropertyType): ItemInstance {
    if (!this.properties) {
      this.properties = {};
    }

    this.properties[key] = value;

    return this;
  }

  public Build(): ItemStack {
    const item = new ItemStack(this.typeId, this.amount);
    const durability = item.getComponent(ItemComponentTypes.Durability);
    const enchanting = item.getComponent(ItemComponentTypes.Enchantable);

    item.nameTag = this.nameTag;
    item.lockMode = this.lockMode;
    item.keepOnDeath = this.keepOnDeath;

    if (this.lore) {
      item.setLore(this.lore);
    }
    if (this.damage && durability) {
      durability.damage = this.damage;
    }
    if (this.enchants && enchanting) {
      enchanting.addEnchantments(
        this.enchants.map((enchant) => enchant.Build()),
      );
    }
    if (this.properties) {
      for (const [key, value] of Object.entries(this.properties)) {
        item.setDynamicProperty(key, value);
      }
    }

    return item;
  }
}
