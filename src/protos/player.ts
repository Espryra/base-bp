import { EntityComponentTypes, Player, system } from "@minecraft/server";

declare module "@minecraft/server" {
  //@ts-expect-error | Entity type issues.
  interface Player {
    sendError(message: string): void;
    sendSuccess(message: string): void;

    container(): Container;
    addItem(itemStack: ItemStack): void;
  }
}

Player.prototype.sendError = function (message): void {
  this.sendMessage(`§c${message}`);
  system.run(() => this.playSound("note.bass"));
};
Player.prototype.sendSuccess = function (message): void {
  this.sendMessage(`§a${message}`);
  system.run(() => this.playSound("note.pling"));
};

Player.prototype.addItem = function (item): void {
  const container = this.getComponent(
    EntityComponentTypes.Inventory,
  )!.container;

  container.addItem(item);
};
