import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs/Rx";
import { CyhyTitleService } from "../cyhy-title.service";
import { CyhyConfigService } from "../cyhy-config.service";
import { CyhyJsonDataSource } from "../cyhy-data-sources/cyhy-json-data-source";

// Bower loaded libraries, @types only.
import * as jQueryType from "jquery";

declare var $: typeof jQueryType;

@Component({
  selector: "app-weekly-tickets",
  templateUrl: "./weekly-tickets.component.html",
  styleUrls: ["./weekly-tickets.component.css"],
})
export class WeeklyTicketsComponent implements OnInit {
  public static cycleName: string = "WeeklyTicketsComponent";
  private reportData: any;
  private fiscalYearKeys: any;
  public isLoading: boolean;
  private dataSource: CyhyJsonDataSource;
  private dataSubscription: Subscription;

  constructor(
    private titleService: CyhyTitleService,
    private config: CyhyConfigService
  ) {
    this.reportData = undefined;
    this.fiscalYearKeys = undefined;
    this.isLoading = true;
  }

  ngOnInit() {
    this.titleService.setTitle("Weekly Tickets Report");
    this.dataSource = new CyhyJsonDataSource(
      "Weekly Tickets",
      this.config.get("data_protocol"),
      this.config.get("data_host"),
      [this.config.get("data_path"), "metrics", "weekly"],
      this.config.get("data_port"),
      "j"
    );

    this.dataSubscription = this.dataSource.subscribe(
      (data) => {
        if (data) {
          this.reportData = data;
          this.isLoading = false;
          // Extract fiscal year keys from FY_ticket_counts_by_year
          this.fiscalYearKeys = Object.keys(
            this.reportData.FY_ticket_counts_by_year
          );
        }
      },
      (error) => console.warn(error)
    );
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }
}
