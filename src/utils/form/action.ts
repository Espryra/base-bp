import type { Player } from "@minecraft/server";
import { ActionFormData, ActionFormResponse } from "@minecraft/server-ui";
import FormConfig from "../../lib/form";
import type { ActionFormButton } from "./types";

export default class ActionForm {
  public title?: string;
  public body?: string | string[];
  public buttons: ActionFormButton[] = [];

  public constructor() {}

  public SetTitle(title: string): ActionForm {
    this.title = title;

    return this;
  }
  public SetBody(body: string | string[]): ActionForm {
    this.body = body;

    return this;
  }
  public SetButtons(buttons: ActionFormButton[]): ActionForm {
    this.buttons = buttons;

    return this;
  }

  public AddButton(text: string, subtext?: string, icon?: string): ActionForm {
    this.buttons.push({ text, subtext, icon });

    return this;
  }

  public GetTitle(): string | undefined {
    return this.title;
  }
  public GetBody(): string | string[] | undefined {
    return this.body;
  }
  public GetButtons(): ActionFormButton[] {
    return this.buttons;
  }

  public Show(player: Player): Promise<ActionFormResponse> {
    const form = new ActionFormData();

    if (this.title) {
      form.title(FormConfig.TitleColor + this.title);
    }
    if (this.body) {
      const text =
        typeof this.body === "string" ? this.body : this.body.join("\n");

      form.body(FormConfig.TextColor + text);
    }

    for (const button of this.buttons) {
      form.button(
        FormConfig.ButtonColor +
          button.text +
          (!button.subtext
            ? ""
            : `\n§r${FormConfig.SubtextBracketColor}[ ${FormConfig.SubtextColor + button.subtext} §r${FormConfig.SubtextBracketColor}]`),
        button.icon,
      );
    }

    return form.show(player);
  }
}
