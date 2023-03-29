import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs/Rx";
import { CyhyTitleService } from "../cyhy-title.service";
import { CyhyConfigService } from "../cyhy-config.service";
import { CyhyJsonDataSource } from "../cyhy-data-sources/cyhy-json-data-source";

// Bower loaded libraries, @types only.
import * as jQueryType from "jquery";

declare var $: typeof jQueryType;

@Component({
  selector: "app-risk-rating",
  templateUrl: "./risk-rating.component.html",
  styleUrls: ["./risk-rating.component.css"],
})
export class RiskRatingComponent implements OnInit {
  public static cycleName: string = "RiskRatingComponent";
  private reportData: any;
  public isLoading: boolean;
  public average_vulnerability_ranking: string[];
  public avg_max_vuln_alive_score: string[];
  public average_max_time_to_mitigate: string[];
  public overall_rank: string[];
  public http_error: string;
  private dataSource: CyhyJsonDataSource;
  private dataSubscription: Subscription;

  constructor(
    private titleService: CyhyTitleService,
    private config: CyhyConfigService
  ) {
    this.reportData = undefined;
    this.isLoading = true;
  }

  ngOnInit() {
    this.titleService.setTitle("Risk Rating Report");
    this.dataSource = new CyhyJsonDataSource(
      "Risk Rating",
      this.config.get("data_protocol"),
      this.config.get("data_host"),
      [this.config.get("data_path"), "metrics", "risk"],
      this.config.get("data_port")
    );

    this.dataSubscription = this.dataSource.subscribe(
      (data) => {
        if (data) {
          this.average_vulnerability_ranking = data[0];
          this.avg_max_vuln_alive_score = data[1];
          this.average_max_time_to_mitigate = data[2];
          this.overall_rank = data[3];
          this.reportData = data;
          this.http_error = "";
          this.isLoading = false;
        }
      },
      (error) => {
        this.http_error = error;
        this.isLoading = false;
        console.warn(error);
      }
    );
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }
}
