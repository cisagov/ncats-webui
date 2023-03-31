import { Response } from "@angular/http";
import { CyhyJsonDataSource } from "./cyhy-data-sources/cyhy-json-data-source";

export class CyhyUpdateService extends CyhyJsonDataSource {
  constructor(
    name: string,
    protocol: string,
    domain: string,
    path: Array<string>,
    port?: string,
    parameters?: string,
    refreshPeriod?: number
  ) {
    super(name, protocol, domain, path, port, parameters, refreshPeriod);
  }

  _pullData(): CyhyUpdateService {
    this._http
      .get(this._url)
      .map((res: Response) => res.text())
      .subscribe(
        (data) => {
          this.update(data);
          this._lastRequestSuccessful = true;
        },
        (err) => {
          console.warn(
            this.constructor.name + "._pullData - " + this._url + ": ",
            err
          );
          this._lastRequestSuccessful = false;
        }
      );

    return this;
  }

  update(data: string): void {
    let oldData = this.getData();

    if (oldData && data != oldData) {
      window.location.reload();
    } else {
      super.update(data);
    }
  }
}
