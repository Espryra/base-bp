import type { Player } from "@minecraft/server";
import { ModalFormData, type ModalFormResponse } from "@minecraft/server-ui";
import FormConfig from "../../lib/form";
import { ModalFormOptionTypes, type ModalFormOption } from "./types";

export default class ModalForm {
  public title?: string;
  public submitButton?: string;
  public options: ModalFormOption[] = [];

  public SetTitle(title: string): ModalForm {
    this.title = title;

    return this;
  }
  public SetSubmitButton(text: string): ModalForm {
    this.submitButton = text;

    return this;
  }

  public AddOption(option: ModalFormOption): ModalForm {
    this.options.push(option);

    return this;
  }
  public AddDivider(): ModalForm {
    this.options.push({ type: ModalFormOptionTypes.DIVIDER });

    return this;
  }
  public AddDropdown(
    label: string,
    options: string[],
    defaultIndex?: number,
    tooltip?: string,
  ): ModalForm {
    this.options.push({
      type: ModalFormOptionTypes.DROPDOWN,
      label,
      options,
      defaultIndex,
      tooltip,
    });

    return this;
  }
  public AddHeader(text: string): ModalForm {
    this.options.push({ type: ModalFormOptionTypes.HEADER, text });

    return this;
  }
  public AddLabel(text: string | string[]): ModalForm {
    this.options.push({ type: ModalFormOptionTypes.LABEL, text });

    return this;
  }
  public AddSlider(
    label: string,
    min: number,
    max: number,
    defaultValue?: number,
    step?: number,
    tooltip?: string,
  ): ModalForm {
    this.options.push({
      type: ModalFormOptionTypes.SLIDER,
      label,
      min,
      max,
      defaultValue,
      step,
      tooltip,
    });

    return this;
  }
  public AddTextField(
    label: string,
    placeholder: string,
    defaultValue?: string,
    tooltip?: string,
  ): ModalForm {
    this.options.push({
      type: ModalFormOptionTypes.TEXTFIELD,
      label,
      placeholder,
      defaultValue,
      tooltip,
    });

    return this;
  }
  public AddToggle(
    label: string,
    defaultValue?: boolean,
    tooltip?: string,
  ): ModalForm {
    this.options.push({
      type: ModalFormOptionTypes.TOGGLE,
      label,
      defaultValue,
      tooltip,
    });

    return this;
  }

  public GetOptions(): ModalFormOption[] {
    return this.options;
  }
  public GetTitle(): string | undefined {
    return this.title;
  }
  public GetSubmitButton(): string | undefined {
    return this.submitButton;
  }

  public Show(player: Player): Promise<ModalFormResponse> {
    const form = new ModalFormData();

    if (this.title) {
      form.title(FormConfig.TitleColor + this.title);
    }
    if (this.submitButton) {
      form.submitButton(FormConfig.ButtonColor + this.submitButton);
    }

    for (const option of this.options) {
      switch (option.type) {
        case ModalFormOptionTypes.DIVIDER:
          form.divider();
          break;
        case ModalFormOptionTypes.DROPDOWN:
          form.dropdown(
            FormConfig.TextColor + option.label,
            option.options.map((option) => FormConfig.ButtonColor + option),
            {
              defaultValueIndex: option.defaultIndex,
              tooltip: FormConfig.TooltipColor + option.tooltip,
            },
          );
          break;
        case ModalFormOptionTypes.HEADER:
          form.header(FormConfig.TextColor + option.text);
          break;
        case ModalFormOptionTypes.LABEL:
          form.label(
            FormConfig.TextColor +
              (typeof option.text === "string"
                ? option.text
                : option.text.join("\n")),
          );
          break;
        case ModalFormOptionTypes.SLIDER:
          form.slider(
            FormConfig.TextColor + option.label,
            option.min,
            option.max,
            {
              defaultValue: option.defaultValue,
              tooltip: FormConfig.TooltipColor + option.tooltip,
              valueStep: option.step,
            },
          );
          break;
        case ModalFormOptionTypes.TEXTFIELD:
          form.textField(
            FormConfig.TextColor + option.label,
            FormConfig.PlaceholderColor + option.placeholder,
            {
              defaultValue: option.defaultValue,
              tooltip: FormConfig.TooltipColor + option.tooltip,
            },
          );
          break;
        case ModalFormOptionTypes.TOGGLE:
          form.toggle(FormConfig.TextColor + option.label, {
            defaultValue: option.defaultValue,
            tooltip: FormConfig.TooltipColor + option.tooltip,
          });
          break;
      }
    }

    return form.show(player);
  }
}
