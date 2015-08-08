module interfaces {

  export interface asObject {

    second: string,
    minute: string,
    hour: string,
    day: string,
    month: string,
    year: string

  }

  export interface offsetObject {

    operator: string;
    offsetHours: number;

  }

  export interface localizer {

    to(offset: number): localizer,
    returnAs(as: string): localizer,
    localize(): string | asObject;

  }

}

export = interfaces;
