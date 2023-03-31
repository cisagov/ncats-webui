import { Injectable } from "@angular/core";

import * as cookies from "js-cookie";

@Injectable()
export class CookieService {
  public static readonly CENSOR_NAMES: string = "censor_names";
  public static readonly CYCLE_PAGES: string = "cycle_pages";
  public static readonly CYCLE_LIST: string = "cycle_list";
  public static readonly CYCLE_DELAY: string = "cycle_delay";
  public static readonly SAW_ACCESS_WARNING: string = "saw_warning";
  public static readonly VERTICAL_UNDERSCAN: string = "vertical_underscan";
  public static readonly HORIZONTAL_UNDERSCAN: string = "horizontal_underscan";
  public static readonly ELECTION_DASHBOARD: string = "election_data";

  constructor() {}

  public get(cookie: string, _default?: string): string {
    _default = _default || "";
    let result = cookies.get(cookie) || _default;
    return result;
  }

  public getJSON(cookie: string, _default?: any): any {
    _default = _default || [];
    let result = cookies.getJSON(cookie) || _default;
    return result;
  }

  public set(cookie: string, value: any, options?: Object): void {
    options = options || {};
    options["path"] = options["path"] || "/";

    cookies.set(cookie, value, options);
  }
}
