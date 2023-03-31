import { Subject } from "rxjs/Rx";

export class CyhyDataSource<T> extends Subject<T> {
  protected _name: string;
  private _data: T;
  private _lastUpdated: Date;

  constructor() {
    super();
  }

  getData(): T {
    return this._data;
  }

  getName(): string {
    return this._name;
  }

  setName(name: string): void {
    this._name = name;
  }

  update(data: T): void {
    this._data = data;
    if (data != null) this._lastUpdated = new Date();
    this.next(data);
  }

  lastUpdated(): Date {
    return this._lastUpdated;
  }

  isConnected(): boolean {
    return false;
  }
}
