module interfaces {

  export interface offsetObject {
    operator: string;
    offsetHours: number;
  }

  export interface localizer {
    to(offset: number): localizer,
    localize(): string;
  }

}

export = interfaces;
