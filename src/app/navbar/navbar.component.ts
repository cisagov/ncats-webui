import { Component, OnInit } from "@angular/core";
import { CookieService } from "../cookie.service";
import { CyhyDataService } from "../cyhy-data.service";
import { CyhyConfigService } from "../cyhy-config.service";

declare var screenfull: any;
// Have to use bower instance until we figure out how to add .foundation() to jquery.
declare var $: any;

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  public navbarConfig: any;

  constructor(
    public cyhyDataService: CyhyDataService,
    private cyhyConfigService: CyhyConfigService,
    private cookies: CookieService
  ) {
    this._configureNavbar();
  }

  ngOnInit() {
    $(document).foundation();
    this._initializeUnderscan();
    this._fullscreen_listener_setup();
    this._menu_listener_setup();
  }

  _configureNavbar(): void {
    this.navbarConfig = this.cyhyConfigService.get("components");

    this.navbarConfig.monitoringDropdown =
      this.navbarConfig.dashboard ||
      this.navbarConfig.history ||
      this.navbarConfig.status ||
      this.navbarConfig.hiringdashboard;

    this.navbarConfig.mapsDropdown =
      this.navbarConfig.hostmap ||
      this.navbarConfig.vulnerabilitymap ||
      this.navbarConfig.scanmap;

    this.navbarConfig.reportsDropdown =
      this.navbarConfig.bod ||
      this.navbarConfig.cybex ||
      this.navbarConfig.firstseenvulns ||
      this.navbarConfig.metrics ||
      this.navbarConfig.weeklytickets ||
      this.navbarConfig.fema ||
      this.navbarConfig.congressional ||
      this.navbarConfig.stakeholders ||
      this.navbarConfig.riskrating;
  }

  _initializeUnderscan(): void {
    let verticalUnderscan = this.cookies.get(CookieService.VERTICAL_UNDERSCAN);
    if (verticalUnderscan) {
      $("body, nav").css("margin-top", verticalUnderscan + "px");
      $("body, nav").css("margin-bottom", verticalUnderscan + "px");
      $(".f-topbar-fixed").css("padding-top", $("nav").height() + "px");
    }

    let horizontalUnderscan = this.cookies.get(
      CookieService.HORIZONTAL_UNDERSCAN
    );
    if (horizontalUnderscan) {
      $("body, nav").css("margin-left", horizontalUnderscan + "px");
      $("body, nav").css("margin-right", horizontalUnderscan + "px");
    }
  }

  _fullscreen_listener_setup(): void {
    if (screenfull.enabled) {
      $("#fullscreen")[0].addEventListener("click", function () {
        screenfull.toggle();
      });
    } else {
      $("#fullscreen")[0].setAttribute("class", "hide");
    }
  }

  _menu_listener_setup(): void {
    // Normally, the foundation() method is called when the page is loaded.
    //  Since we aren't reinitializing the entire page, the menu needs to
    //  be reset when a dropdown link is clicked. Otherwise, the dropdown
    //  menu will persist. We can do this by calling foundation() again.
    //  I'm open to a better solution if we can find one.

    for (var element of $(".dropdown a")) {
      element.addEventListener("click", () => {
        $(document).foundation();
      });
    }
  }
}
