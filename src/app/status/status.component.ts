import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs/Rx";
import { CyhyDataService } from "../cyhy-data.service";
import { CyhyTitleService } from "../cyhy-title.service";
import { CyhyJsonDataSource } from "../cyhy-data-sources/cyhy-json-data-source";

// Bower loaded libraries, @types only.
import * as jQueryType from "jquery";

declare var $: typeof jQueryType;

// Until we can figure out how to add .bullet() to d3 object, just declare
declare var d3: any;

let DATA_PARMS_RECENT: any = "j&maxage=259200"; // 3 days
let DATA_PARMS_ALL: any = "j";
let DATA_PARMS_NOW: any = "j&maxage=60";

let self: any; // for keeping track of 'this'

@Component({
  selector: "app-status",
  templateUrl: "./status.component.html",
})
export class StatusComponent implements OnInit, OnDestroy {
  public static cycleName: string = "StatusComponent";
  private commaFormatter: any;
  private dateFormatter: any;
  private STAGES: any;
  private STATUS: any;
  private margin: any;
  private chart: any;
  private width: any;
  private height: any;
  private CHART_SPACING: any;
  private refreshInterval: any;
  private dataSource: CyhyJsonDataSource;
  private dataSubscription: Subscription;
  public isLoading: boolean;

  constructor(
    private titleService: CyhyTitleService,
    private cyhyDataService: CyhyDataService,
    private router: Router
  ) {
    self = this;

    self.commaFormatter = d3.format(",");
    self.dateFormatter = d3.time.format("%Y-%m-%d %H:%M");
    self.STAGES = ["NETSCAN1", "NETSCAN2", "PORTSCAN", "VULNSCAN", "BASESCAN"];
    self.STATUS = ["WAITING", "READY", "RUNNING", "DONE"];
    (self.margin = { top: 5, right: 40, bottom: 20, left: 120 }),
      (self.width = 960 - self.margin.left - self.margin.right),
      (self.height = 50 - self.margin.top - self.margin.bottom),
      (self.CHART_SPACING = 24);
    self.isLoading = true;

    self.chart = d3.bullet().width(self.width).height(self.height);
  }

  ngOnInit() {
    self.titleService.setTitle("Scan Progress");
    setTimeout(() => {
      // Give time for component-specific CSS to load
      let data = self.cyhyDataService.getData(
        self.cyhyDataService.dataIdentifiers.STATUS_ALL
      );
      self.update(undefined, data);
    }, 100);

    self.dataSource = self.cyhyDataService.getDataSubject(
      self.cyhyDataService.dataIdentifiers.STATUS_ALL
    );
    if (self.dataSource) self.dataSource.refreshData();
    self.dataSubscription = self.cyhyDataService.subscribeToSubject(
      self.cyhyDataService.dataIdentifiers.STATUS_ALL,
      self.update
    );

    // Workaround for dynamically added content that needs to be linked. <a href
    $(document).on("click", "svg>a", (e) => {
      if (e.currentTarget) {
        let acronym = $(e.currentTarget).find("g>g>a")[0].textContent;
        if (acronym) self.router.navigate(["/status", acronym]);
      }
    });
  }

  ngOnDestroy() {
    clearInterval(self.refreshInterval);
    if (self.dataSubscription) self.dataSubscription.unsubscribe();
  }

  change_view(i: number): void {
    if (!self.dataSource) return;

    self.isLoading = true;

    switch (i) {
      case 0:
        self.dataSource.setParameters(DATA_PARMS_RECENT).refreshData();
        document.getElementById("dd-all").className = "";
        document.getElementById("dd-recent").className = "active";
        document.getElementById("dd-now").className = "";
        break;
      case 1:
        self.dataSource.setParameters(DATA_PARMS_ALL).refreshData();
        document.getElementById("dd-all").className = "active";
        document.getElementById("dd-recent").className = "";
        document.getElementById("dd-now").className = "";
        break;
      case 2:
        self.dataSource.setParameters(DATA_PARMS_NOW).refreshData();
        document.getElementById("dd-all").className = "";
        document.getElementById("dd-recent").className = "";
        document.getElementById("dd-now").className = "active";
        break;
    }
  }

  calculateRanges(scanData: any, doneCount: any): any {
    // calculate the ranges given a single scan, and whether the scan has completed.
    // ranges represent the remaining IPs/Hosts to scan in each stage
    // WAITING + READY + RUNNING
    var listOfRanges = [doneCount];
    var startOfRange = doneCount;
    var endOfRange;
    var scanCompleted = true;
    for (var i = 0; i < self.STAGES.length; i++) {
      var count = 0;
      for (var j = 0; j < self.STATUS.length - 1; j++) {
        count += scanData.counts[self.STAGES[i]][self.STATUS[j]];
      }
      // determine if the scan has completed
      if (count > 0) {
        scanCompleted = false;
      }
      endOfRange = startOfRange + count;
      listOfRanges.push(endOfRange);
      startOfRange = endOfRange;
    }
    return [listOfRanges, scanCompleted];
  }

  calculateMeasures(scanData: any): any {
    // calculate the measures given a single scan
    // measures represent the completed and running IPs/Hosts
    // DONE, RUNNING
    var done = 0;
    var running = 0;
    for (var i = 0; i < self.STAGES.length; i++) {
      done += scanData.counts[self.STAGES[i]]["DONE"];
      running += scanData.counts[self.STAGES[i]]["RUNNING"];
    }
    running += done;
    return [done, running];
  }

  bottomOfH1(): any {
    var placeholder = d3.select("div.placeholder");
    placeholder = <any>placeholder[0][0];
    return (
      placeholder.offsetTop + placeholder.offsetHeight + self.CHART_SPACING * 2
    );
  }

  calculateChartTop(d: any, i: number): any {
    return (
      (i * (self.height + self.CHART_SPACING) + self.bottomOfH1()).toString() +
      "px"
    );
  }

  update(error: any, jsonData: any): void {
    if (error) {
      return console.warn(error);
    }

    if (jsonData) {
      //Massage jsonData to something the bullet chart would like
      var bullets = [];
      for (var i = 0; i < jsonData.length; i++) {
        let d = jsonData[i];
        let bulletData = {};
        //Convert date
        bulletData["last_change"] = new Date(Date.parse(d["last_change"]));
        bulletData["title"] = d["_id"];
        bulletData["subtitle"] = self.dateFormatter(bulletData["last_change"]);
        let measures = self.calculateMeasures(d);
        bulletData["measures"] = measures;
        // not all browsers support destructuring assignment
        let c = self.calculateRanges(d, measures[0]);
        bulletData["ranges"] = c[0];
        bulletData["completed"] = c[1];
        bulletData["markers"] = [0]; //TODO: make bullet object accept no markers
        bullets.push(bulletData);
      }

      // sort data by last_change date
      bullets.sort(function (i, j) {
        return j.last_change - i.last_change;
      });

      //BIND
      var svg = d3
        .select("body")
        .select("body")
        .select(".placeholder")
        .selectAll("svg")
        .data(bullets, function (d) {
          try {
            return d.title;
          } catch (e) {
            console.log(e);
          }
        });

      //ENTER
      var svgEnter = svg
        .enter()
        .append("svg")
        .attr("class", "bullet")
        .attr("width", self.width + self.margin.left + self.margin.right)
        .attr("height", self.height + self.margin.top + self.margin.bottom)
        .style("top", self.calculateChartTop)
        .append("a")
        .append("g")
        .attr(
          "transform",
          "translate(" + self.margin.left + "," + self.margin.top + ")"
        )
        .call(self.chart);

      var title = svgEnter
        .append("g")
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + self.height / 2 + ")");

      title
        .append("a")
        .append("text")
        .attr("class", "title-active")
        .text(function (d) {
          return d.title;
        });

      title
        .append("text")
        .attr("class", "subtitle")
        .attr("dy", "1em")
        .text(function (d) {
          return d.subtitle;
        });

      //UPDATE
      svg.select("text.subtitle").text(function (d) {
        return d.subtitle;
      });

      svg
        .select("text.title-active, text.title-completed")
        .attr("class", function (d) {
          return d.completed ? "title-completed" : "title-active";
        });

      svg
        .transition()
        .duration(1000)
        .style("top", self.calculateChartTop)
        .call(self.chart.duration(1000));

      //EXIT
      svg
        .exit()
        .transition()
        .duration(750)
        .style("fill-opacity", 1e-6)
        .remove();

      self.isLoading = false;
    }
  }
}
