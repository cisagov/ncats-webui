import { Component, OnInit, AfterViewInit } from "@angular/core";
import { DragulaService } from "ng2-dragula/ng2-dragula";
import { CookieService } from "../cookie.service";
import { CyhyTitleService } from "../cyhy-title.service";
import { CyhyDataService } from "../cyhy-data.service";
import { PageCycleService } from "../page-cycle.service";
import { Subscription } from "rxjs/Rx";

// Have to use bower instance until we figure out how to add .foundation() to jquery.
declare var $: any;

@Component({
  selector: "app-preferences",
  templateUrl: "./preferences.component.html",
  styleUrls: [
    "./preferences.component.css",
    "../../../node_modules/dragula/dist/dragula.min.css",
  ],
})
export class PreferencesComponent implements OnInit, AfterViewInit {
  public dataFeeds: Object[];
  public verticalUnderscan: string;
  public horizontalUnderscan: string;
  public cycleList: Array<string>;
  public componentList: Array<string>;

  constructor(
    private titleService: CyhyTitleService,
    private cyhyDataService: CyhyDataService,
    private cookies: CookieService,
    private pageCycle: PageCycleService,
    private dragulaService: DragulaService
  ) {
    this._setupDataFeedList();
    this._setupDragula();
  }

  ngOnInit() {
    this._initializeUnderscan();
    this._initializeCycleList();
    this._setupReflowOnDropdownClick();
  }

  ngAfterViewInit() {
    $(document).foundation(this._getFoundationEventHandlers());
    this.titleService.setTitle("Preferences");
    (<HTMLInputElement>$("#censor_names")[0]).checked =
      this.cookies.get(CookieService.CENSOR_NAMES) == "true";
    (<HTMLInputElement>$("#election_data")[0]).checked =
      this.cookies.get(CookieService.ELECTION_DASHBOARD) == "true";
    (<HTMLInputElement>$("#cycle_pages")[0]).checked =
      this.cookies.get(CookieService.CYCLE_PAGES) == "true";
    (<HTMLInputElement>$("#cycle_delay")[0]).value =
      this.cookies.get(CookieService.CYCLE_DELAY) || "300";
    (<HTMLInputElement>$("#cycle_delay")[0]).value =
      this.cookies.get(CookieService.CYCLE_DELAY) || "300";
  }

  toggleCookie(event): void {
    let element = event.target;
    let cookie = this._localElementToCookie(element.id);
    this.cookies.set(cookie, element.checked);
  }

  saveInput(event): void {
    let element = event.target;
    let cookie = this._localElementToCookie(element.id);
    this.cookies.set(cookie, element.value);
  }

  resetVerticalUnderscan(): void {
    $("#vertical-underscan-slider").foundation("slider", "set_value", 0);
  }

  resetHorizontalUnderscan(): void {
    $("#horizontal-underscan-slider").foundation("slider", "set_value", 0);
  }

  _setupDataFeedList(): void {
    this.dataFeeds = this.cyhyDataService.getAllSubjects();
  }

  private _setupDragula(): void {
    if (!this.dragulaService.find("cycle-list-bag")) {
      this.dragulaService.setOptions("cycle-list-bag", {
        direction: "horizontal",
      });
    }

    this.dragulaService.dropModel.subscribe((value) => {
      this.cookies.set(CookieService.CYCLE_LIST, this.cycleList);
    });

    this.dragulaService.removeModel.subscribe((value) => {
      // For future use.
    });
  }

  _initializeUnderscan(): void {
    this.verticalUnderscan =
      this.cookies.get(CookieService.VERTICAL_UNDERSCAN) || "0";
    $("#vertical-underscan-slider").attr(
      "data-options",
      $("#vertical-underscan-slider").attr("data-options") +
        "initial: " +
        this.verticalUnderscan +
        ";"
    );

    this.horizontalUnderscan =
      this.cookies.get(CookieService.HORIZONTAL_UNDERSCAN) || "0";
    $("#horizontal-underscan-slider").attr(
      "data-options",
      $("#horizontal-underscan-slider").attr("data-options") +
        "initial: " +
        this.horizontalUnderscan +
        ";"
    );
  }

  private _initializeCycleList(): void {
    this.cycleList = this.cookies.getJSON(CookieService.CYCLE_LIST);
    this.componentList = this.pageCycle
      .getCyclableComponents()
      .filter((item) => this.cycleList.indexOf(item) < 0);
  }

  _getFoundationEventHandlers(): Object {
    return {
      slider: {
        on_change: () => {
          this.verticalUnderscan = $("#vertical-underscan-slider").attr(
            "data-slider"
          );
          this.cookies.set(
            CookieService.VERTICAL_UNDERSCAN,
            this.verticalUnderscan
          );
          $("body, nav").css("margin-top", this.verticalUnderscan + "px");
          $("body, nav").css("margin-bottom", this.verticalUnderscan + "px");
          $(".f-topbar-fixed").css("padding-top", $("nav").height() + "px");

          this.horizontalUnderscan = $("#horizontal-underscan-slider").attr(
            "data-slider"
          );
          this.cookies.set(
            CookieService.HORIZONTAL_UNDERSCAN,
            this.horizontalUnderscan
          );
          $("body, nav").css("margin-left", this.horizontalUnderscan + "px");
          $("body, nav").css("margin-right", this.horizontalUnderscan + "px");
          $(".f-topbar-fixed").css("padding-top", $("nav").height() + "px");
        },
      },
    };
  }

  _setupReflowOnDropdownClick(): void {
    $(".dropdown-content").on("click", () => {
      setTimeout(() => {
        $(document).foundation("reflow");
      }, 250);
    });
  }

  _localElementToCookie(id) {
    let cookie = null;

    switch (id) {
      case "censor_names":
        cookie = CookieService.CENSOR_NAMES;
        break;

      case "election_data":
        cookie = CookieService.ELECTION_DASHBOARD;
        break;

      case "cycle_pages":
        cookie = CookieService.CYCLE_PAGES;
        break;

      case "cycle_delay":
        cookie = CookieService.CYCLE_DELAY;
        break;
    }

    return cookie;
  }
}
