import { world } from "@minecraft/server";
import "./protos/loader";
import CommandHandler from "./utils/commandHandler/handler";
import ActionForm from "./utils/form/action";

CommandHandler.Init();

world.afterEvents.itemUse.subscribe(async (event) => {
  const { source: player, itemStack: item } = event;

  if (item.typeId !== "minecraft:stick") {
    return;
  }

  new ActionForm()
    .SetTitle("Testing")
    .SetBody([`Hello, ${player.name}!\n`, "What would you like to do?\n"])
    .AddButton("Testing", "Click to Open", "textures/items/emerald")
    .Show(player);
});
