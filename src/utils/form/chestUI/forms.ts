import { Container, type RawMessage } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import {
  CHEST_UI_SIZES,
  custom_content,
  custom_content_keys,
  inventory_enabled,
  number_of_custom_items,
} from "./constants.js";
import { typeIdToDataId, typeIdToID } from "./typeIds.js";

class ChestFormData {
  #titleText;
  #buttonArray;
  private slotCount: number;
  constructor(size = "small") {
    const sizing = CHEST_UI_SIZES.get(size) ?? ["§c§h§e§s§t§2§7§r", 27];
    /** @internal */
    this.#titleText = { rawtext: [{ text: `${sizing[0]}` }] };
    /** @internal */
    this.#buttonArray = Array(sizing[1]).fill(["", undefined]);
    this.slotCount = sizing[1];
  }
  title(text: string) {
    this.#titleText.rawtext.push({ text: text });

    return this;
  }
  button(
    slot: number,
    itemName: string,
    itemDesc: string[],
    texture: string,
    stackSize = 1,
    durability = 0,
    enchanted = false
  ) {
    const targetTexture = custom_content_keys.has(texture)
      ? custom_content[texture]?.texture
      : texture;
    const ID =
      typeIdToDataId.get(targetTexture ?? "") ??
      typeIdToID.get(targetTexture ?? "");
    let buttonRawtext = {
      rawtext: [
        {
          text: `stack#${String(Math.min(Math.max(stackSize, 1), 99)).padStart(
            2,
            "0"
          )}dur#${String(Math.min(Math.max(durability, 0), 99)).padStart(
            2,
            "0"
          )}§r`,
        },
      ],
    };
    if (typeof itemName === "string") {
      buttonRawtext.rawtext.push({ text: itemName ? `${itemName}§r` : "§r" });
    }
    if (Array.isArray(itemDesc) && itemDesc.length > 0) {
      for (const obj of itemDesc) {
        buttonRawtext.rawtext.push({ text: `\n${obj}` });
      }
    }
    this.#buttonArray.splice(
      Math.max(0, Math.min(slot, this.slotCount - 1)),
      1,
      [
        buttonRawtext,
        ID === undefined
          ? targetTexture
          : (ID + (ID < 256 ? 0 : number_of_custom_items)) * 65536 +
            (enchanted ? 32768 : 0),
      ]
    );
    return this;
  }
  /**
   *
   * @param pattern
   * @param key DO NOT USE STACKSIZE, HEROBRINE'S DUMBASS PUT IT HERE!
   * @returns
   */
  pattern(
    pattern: string[],
    key: {
      [key: string]: {
        itemName?: string | RawMessage;
        itemDesc?: (string | RawMessage)[];
        stackSize?: number;
        stackAmount?: number;
        enchanted?: boolean;
        durability?: number;
        texture: string;
      };
    }
  ) {
    for (let i = 0; i < pattern.length; i++) {
      const row = pattern[i] as string;

      for (let j = 0; j < row.length; j++) {
        const letter = row.charAt(j);
        const data = key[letter];

        if (!data) continue;

        const slot = j + i * 9;
        const targetTexture = custom_content_keys.has(data.texture)
          ? custom_content[data.texture]?.texture
          : data.texture;
        const ID =
          typeIdToDataId.get(targetTexture ?? "") ??
          typeIdToID.get(targetTexture ?? "");
        const {
          stackAmount = 1,
          durability = 0,
          itemName,
          itemDesc,
          enchanted = false,
        } = data;
        const stackSize = String(
          Math.min(Math.max(stackAmount, 1), 99)
        ).padStart(2, "0");
        const durValue = String(Math.min(Math.max(durability, 0), 99)).padStart(
          2,
          "0"
        );
        let buttonRawtext = {
          rawtext: [{ text: `stack#${stackSize}dur#${durValue}§r` }],
        };

        buttonRawtext.rawtext.push({ text: `${itemName}§r` });

        if (Array.isArray(itemDesc) && itemDesc.length > 0) {
          for (const obj of itemDesc) {
            buttonRawtext.rawtext.push({ text: `\n${obj}` });
          }
        }

        this.#buttonArray.splice(
          Math.max(0, Math.min(slot, this.slotCount - 1)),
          1,
          [
            buttonRawtext,
            ID === undefined
              ? targetTexture
              : (ID + (ID < 256 ? 0 : number_of_custom_items)) * 65536 +
                (enchanted ? 32768 : 0),
          ]
        );
      }
    }
    return this;
  }
  show(player: any) {
    const form = new ActionFormData().title(this.#titleText);
    this.#buttonArray.forEach((button) => {
      form.button(button[0], button[1]?.toString());
    });
    if (!inventory_enabled) return form.show(player);
    /** @type {Container} */
    const container = player.getComponent("inventory").container;
    for (let i = 0; i < container.size; i++) {
      const item = container.getItem(i);
      if (!item) continue;
      const typeId = item.typeId;
      const targetTexture = custom_content_keys.has(typeId)
        ? custom_content[typeId]?.texture
        : typeId;
      const ID =
        typeIdToDataId.get(targetTexture) ?? typeIdToID.get(targetTexture);
      const durability = item.getComponent("durability");
      const durDamage = durability
        ? Math.round(
            ((durability.maxDurability - durability.damage) /
              durability.maxDurability) *
              99
          )
        : 0;
      const amount = item.amount;
      const formattedItemName = typeId
        .replace(/.*(?<=:)/, "")
        .replace(/_/g, " ")
        .replace(/(^\w|\s\w)/g, (m: string) => m.toUpperCase());
      let buttonRawtext = {
        rawtext: [
          {
            text: `stack#${String(amount).padStart(2, "0")}dur#${String(
              durDamage
            ).padStart(2, "0")}§r${formattedItemName}`,
          },
        ],
      };
      const loreText = item.getLore().join("\n");
      if (loreText) buttonRawtext.rawtext.push({ text: loreText });
      const finalID =
        ID === undefined
          ? targetTexture
          : (ID + (ID < 256 ? 0 : number_of_custom_items)) * 65536;
      form.button(buttonRawtext, finalID.toString());
    }
    return form.show(player);
  }
}

export { ChestFormData };
