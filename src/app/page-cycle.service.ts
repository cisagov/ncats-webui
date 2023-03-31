import { Injectable } from "@angular/core";
import { Router, Route, Routes, NavigationEnd } from "@angular/router";

import { CookieService } from "./cookie.service";

@Injectable()
export class PageCycleService {
  private componentUrlMap: Map<string, string>;
  private urlComponentMap: Map<string, string>;
  private cycleTimeout: any;

  constructor(private router: Router, private cookies: CookieService) {
    [this.componentUrlMap, this.urlComponentMap] = this.getComponentUrlMap(
      this.router.config
    );
    router.events
      .filter((event) => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        this.configureNextCycle(event.url);
      });
  }

  /**
   * Returns a list of Component names that are able to be cycled through.
   */
  public getCyclableComponents(): Array<string> {
    let result = new Array<string>();
    for (let key of Array.from(this.componentUrlMap.keys())) {
      let component = this.formatComponentName(key);
      if (component !== "") {
        result.push(component);
      }
    }
    return result.sort();
  }

  /**
   * Returns a mapping of component names to paths for all paths in the
   *  application.
   */
  private getComponentUrlMap(elements: Routes): Map<string, string>[] {
    let resultAB = new Map<string, string>();
    let resultBA = new Map<string, string>();

    elements.forEach((element: Route) => {
      // Only parse routes matching components
      if (element.hasOwnProperty("component")) {
        if (element["component"]["cycleName"]) {
          // Add current element to map
          let componentName = this.formatComponentName(
            element["component"]["cycleName"]
          );
          resultAB.set(componentName, element.path);
          resultBA.set(element.path, componentName);
        }

        // If the route has children, recurse
        if (element.hasOwnProperty("children")) {
          let childMap = this.getComponentUrlMap(element.children)[0];
          // Add child mappings to current map
          childMap.forEach((value: string, key: string) => {
            let componentName = this.formatComponentName(key);
            resultAB.set(componentName, value);
            resultBA.set(value, componentName);
          });
        }
      }
    });

    return [resultAB, resultBA];
  }

  /**
   * Matches the format of the component name with our config.json file.
   */
  private formatComponentName(name: string): string {
    return name.replace("Component", "").toLowerCase();
  }

  /**
   * Calculates the next component to load, and sets it's trigger.
   */
  private configureNextCycle(currentUrl: string): void {
    // Remove leading slash
    if (currentUrl[0] === "/") {
      currentUrl = currentUrl.substr(1);
    }

    let cycleList = this.cookies.getJSON(CookieService.CYCLE_LIST);
    if (this.cookies.get(CookieService.CYCLE_PAGES) == "true") {
      // If component of the currentUrl is in cycleList
      //  set up the timeout for the next page to dispaly
      // Otherwise, cancel the timeout (because we navigated away from the cycle)
      let component = this.urlComponentMap.get(currentUrl);
      let cycleIndex = cycleList.indexOf(component);

      if (cycleIndex > -1) {
        // Configure the timeout
        let cycleDelay = this.cookies.get(CookieService.CYCLE_DELAY) || 300;
        let nextIndex = 0;

        if (cycleIndex + 1 < cycleList.length) {
          nextIndex = cycleIndex + 1;
        }

        this.cycleTimeout = setTimeout(() => {
          this.router.navigate([
            "/" + this.componentUrlMap.get(cycleList[nextIndex]),
          ]);
        }, +cycleDelay * 1000);
      } else {
        clearTimeout(this.cycleTimeout);
      }
    }
  }
}
