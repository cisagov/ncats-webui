import { Component, OnInit, OnDestroy } from "@angular/core";
import { CyhyTitleService } from "../cyhy-title.service";
import { CyhyConfigService } from "../cyhy-config.service";
import { Subscription } from "rxjs/Rx";

import { CyhyJsonDataSource } from "../cyhy-data-sources/cyhy-json-data-source";

// Bower loaded libraries, @types only.
import * as d3Type from "d3";

declare var d3: typeof d3Type;

let self: any; // for keeping track of 'this'

@Component({
  selector: "app-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.css"],
})
export class HistoryComponent implements OnInit, OnDestroy {
  public isLoading: boolean;
  private commaFormatter: any;
  private dataSource: CyhyJsonDataSource;
  private dataSubscription: Subscription;

  constructor(
    private titleService: CyhyTitleService,
    private config: CyhyConfigService
  ) {
    self = this;
    self.isLoading = true;
  }

  ngOnInit() {
    this.titleService.setTitle("Scan History");
    // Load the agency data asynchronously.
    // Draw now
    self.dataSource = new CyhyJsonDataSource(
      "Scan History",
      this.config.get("data_protocol"),
      this.config.get("data_host"),
      [this.config.get("data_path"), "history/"],
      this.config.get("data_port"),
      "j",
      60000
    );

    self.dataSubscription = self.dataSource.subscribe(
      (data) => {
        if (data) {
          self.isLoading = false;
          self.redraw(data);
        }
      },
      (error) => console.warn(error)
    );

    self.commaFormatter = d3.format(",");
  }

  ngOnDestroy() {
    self.dataSubscription.unsubscribe();
  }

  cellData(d: any): any {
    let now = new Date();
    let startDate = new Date(d.start_time);
    let endDate = new Date(d.end_time);
    let age =
      Math.round((now.getTime() - endDate.getTime()) / (100 * 60 * 60 * 24)) /
      10;
    let duration =
      Math.round(
        (endDate.getTime() - startDate.getTime()) / (100 * 60 * 60 * 24)
      ) / 10;

    return [d.owner, age, startDate, endDate, duration];
  }

  rowStyle(d: any): string {
    let now = new Date();
    let startDate = new Date(d.start_time);
    let endDate = new Date(d.end_time);
    let age =
      Math.round((now.getTime() - endDate.getTime()) / (100 * 60 * 60 * 24)) /
      10;

    if (age >= 80 && age < 90) return "warn";
    if (age >= 90) return "critical";
  }

  redraw(jsonData: any): void {
    //DATA JOIN, keyed on owner
    let rows = d3
      .select("#snapshot-table")
      .select("tbody")
      .selectAll("tr")
      .data(jsonData, function (d: any) {
        return d.owner;
      });

    // UPDATE
    rows
      .attr("class", self.rowStyle)
      .selectAll("td")
      .data(self.cellData)
      .text(function (d: any) {
        return d;
      });

    // ENTER
    rows
      .enter()
      .insert("tr")
      .attr("class", self.rowStyle)
      .selectAll("td")
      .data(self.cellData)
      .enter()
      .append("td")
      .text(function (d: any) {
        return d;
      });

    //EXIT
    rows.exit().transition().duration(4000).style("opacity", 0).remove();
  }
}
