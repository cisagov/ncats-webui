import { Injectable } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { CookieService } from "./cookie.service";
import { PageCycleService } from "./page-cycle.service";

@Injectable()
export class QueryParamExaminerService {
  private params: Object;

  constructor(
    _route: ActivatedRoute,
    private cookies: CookieService,
    private pages: PageCycleService
  ) {
    _route.queryParams.subscribe((params) => this._inspectParams(params));
  }

  _inspectParams(params: Object): void {
    for (var key in params) {
      switch (key) {
        case "enable-censor": {
          this.cookies.set(CookieService.CENSOR_NAMES, true);
          break;
        }
        case "disable-censor": {
          this.cookies.set(CookieService.CENSOR_NAMES, false);
          break;
        }
        case "accept-access-warning": {
          if (!this.cookies.get(CookieService.SAW_ACCESS_WARNING)) {
            this.cookies.set(CookieService.SAW_ACCESS_WARNING, true);
            window.location.reload();
          }
          break;
        }
        case "cycle-list": {
          let cycleList = new Array<string>();
          let componentList = this.pages.getCyclableComponents();
          for (var component of params[key].split(",")) {
            if (componentList.indexOf(component) > -1) {
              cycleList.push(component);
            }
          }
          this.cookies.set(CookieService.CYCLE_LIST, cycleList);
          break;
        }
      }
    }
  }
}
