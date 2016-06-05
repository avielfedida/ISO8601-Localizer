interface Localizer {
  to(offset: number): Localizer;
  returnAs(as: string): Localizer;
  localize(): string;
}

declare class ISO8601Localizer implements Localizer {
  constructor(userISO8601: string);
  to(offset: number): Localizer;
  returnAs(as: string): Localizer;
  localize(): string;
}

declare module "iso8601-localizer" {
  export = ISO8601Localizer;
}
