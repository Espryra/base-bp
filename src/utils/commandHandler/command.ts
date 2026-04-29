import { CommandPermissionLevel } from "@minecraft/server";
import type CommandParameter from "./parameter";
import type { CommandCallback } from "./types";

export default class Command {
  private description = "";
  private permissions: CommandPermissionLevel = CommandPermissionLevel.Any;
  private aliases: string[] = [];
  private parameters: CommandParameter[] = [];

  public constructor(
    private name: string,
    private callback: CommandCallback,
  ) {}

  public SetName(name: string): Command {
    this.name = name;

    return this;
  }
  public SetCallback(callback: CommandCallback): Command {
    this.callback = callback;

    return this;
  }
  public SetDescription(description: string): Command {
    this.description = description;

    return this;
  }
  public SetPermissions(permissions: CommandPermissionLevel): Command {
    this.permissions = permissions;

    return this;
  }
  public SetAliases(aliases: string[]): Command {
    this.aliases = aliases;

    return this;
  }
  public SetParameters(parameters: CommandParameter[]): Command {
    this.parameters = parameters;

    return this;
  }

  public GetName(): string {
    return this.name;
  }
  public GetCallback(): CommandCallback {
    return this.callback;
  }

  public GetDescription(): string {
    return this.description;
  }
  public GetPermissions(): CommandPermissionLevel {
    return this.permissions;
  }
  public GetAliases(): string[] {
    return this.aliases;
  }
  public GetParameters(): CommandParameter[] {
    return this.parameters;
  }
  public GetRequiredParameters(): CommandParameter[] {
    return this.parameters.filter((param) => param.GetRequired());
  }
  public GetOptionalParameters(): CommandParameter[] {
    return this.parameters.filter((param) => !param.GetRequired());
  }

  public AddAlias(alias: string): Command {
    this.aliases.push(alias);

    return this;
  }
  public AddParameter(parameter: CommandParameter): Command {
    this.parameters.push(parameter);

    return this;
  }
}
