module interfaces {

  export interface offsetObject {
    operator: string;
    offsetHours: number;
  }

  export interface genericGet<T> {
    get(): T;
  }

}
