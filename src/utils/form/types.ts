export interface ActionFormButton {
  text: string;
  subtext?: string;
  icon?: string;
}

export enum ModalFormOptionTypes {
  DIVIDER,
  DROPDOWN,
  HEADER,
  LABEL,
  SLIDER,
  TEXTFIELD,
  TOGGLE,
}
export interface ModalFormDivider {
  type: ModalFormOptionTypes.DIVIDER;
}
export interface ModalFormDropdown {
  type: ModalFormOptionTypes.DROPDOWN;
  label: string;
  options: string[];
  defaultIndex?: number;
  tooltip?: string;
}
export interface ModalFormHeader {
  type: ModalFormOptionTypes.HEADER;
  text: string;
}
export interface ModalFormLabel {
  type: ModalFormOptionTypes.LABEL;
  text: string | string[];
}
export interface ModalFormSlider {
  type: ModalFormOptionTypes.SLIDER;
  label: string;
  min: number;
  max: number;
  defaultValue?: number;
  step?: number;
  tooltip?: string;
}
export interface ModalFormTextField {
  type: ModalFormOptionTypes.TEXTFIELD;
  label: string;
  placeholder: string;
  defaultValue?: string;
  tooltip?: string;
}
export interface ModalFormToggle {
  type: ModalFormOptionTypes.TOGGLE;
  label: string;
  defaultValue?: boolean;
  tooltip?: string;
}
export type ModalFormOption =
  | ModalFormDivider
  | ModalFormDropdown
  | ModalFormHeader
  | ModalFormLabel
  | ModalFormSlider
  | ModalFormTextField
  | ModalFormToggle;
