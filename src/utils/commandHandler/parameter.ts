import type {
  CustomCommandParameter,
  CustomCommandParamType,
} from "@minecraft/server";

export default class CommandParameter {
  public constructor(
    private name: string,
    private type: CustomCommandParamType,
    private required = false,
  ) {}

  public SetName(name: string): CommandParameter {
    this.name = name;

    return this;
  }
  public SetType(type: CustomCommandParamType): CommandParameter {
    this.type = type;

    return this;
  }
  public SetRequired(required: boolean): CommandParameter {
    this.required = required;

    return this;
  }

  public GetName(): string {
    return this.name;
  }
  public GetType(): CustomCommandParamType {
    return this.type;
  }
  public GetRequired(): boolean {
    return this.required;
  }

  public Build(): CustomCommandParameter {
    return {
      name: this.name,
      type: this.type,
    } as CustomCommandParameter;
  }
}
