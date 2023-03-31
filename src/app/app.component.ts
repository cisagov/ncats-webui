import { Component, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "./cookie.service";
import { CyhyDataService } from "./cyhy-data.service";
import { CyhyConfigService } from "./cyhy-config.service";
import { ModalManagerService } from "./modal-manager.service";
import { PageCycleService } from "./page-cycle.service";
import { QueryParamExaminerService } from "./query-param-examiner.service";

// Have to use bower instance until we figure out how to add .foundation() to jquery.
declare var $: any;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements AfterViewInit {
  constructor(
    private config: CyhyConfigService,
    private router: Router,
    private cycle: PageCycleService,
    private examiner: QueryParamExaminerService,
    private cookies: CookieService,
    private modalManager: ModalManagerService
  ) {}

  ngAfterViewInit() {
    $(document).foundation();

    this._check_cookies();
    this._check_config();
  }

  _check_cookies(): void {
    if (!this.cookies.get(CookieService.SAW_ACCESS_WARNING)) {
      this.modalManager.displayModal(ModalManagerService.ACCESS_WARNING_MODAL);
    }
  }

  _check_config(): void {
    if (this.config.get("cycle_pages") == "true") {
      this.cookies.set(CookieService.CYCLE_PAGES, true);
      setTimeout(() => {
        this.router.navigate(["/dashboard"]);
      }, 1000);
    }
  }

  accept_access_warning(): void {
    this.cookies.set(CookieService.SAW_ACCESS_WARNING, true, {
      expires: 1,
      path: "/",
    });
  }
}
