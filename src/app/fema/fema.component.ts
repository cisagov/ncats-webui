import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs/Rx";
import { CyhyTitleService } from "../cyhy-title.service";
import { CyhyConfigService } from "../cyhy-config.service";
import { CyhyJsonDataSource } from "../cyhy-data-sources/cyhy-json-data-source";
import { Http, Response } from "@angular/http";

// Bower loaded libraries, @types only.
import * as jQueryType from "jquery";

declare var $: typeof jQueryType;

@Component({
  selector: "app-fema",
  templateUrl: "./fema.component.html",
  styleUrls: ["./fema.component.css"],
})
export class FemaComponent implements OnInit {
  public static cycleName: string = "FemaComponent";
  private reportData: any;
  public isLoading: boolean;
  public api_href: string;
  public http_error: string;
  private dataSource: CyhyJsonDataSource;
  private dataSubscription: Subscription;

  constructor(
    public http: Http,
    private titleService: CyhyTitleService,
    private config: CyhyConfigService
  ) {
    this.reportData = undefined;
    this.isLoading = true;
  }

  ngOnInit() {
    this.titleService.setTitle("FEMA Report");
    this.api_href = this.config.getApiPath();
    this.dataSource = new CyhyJsonDataSource(
      "FEMA Data",
      this.config.get("data_protocol"),
      this.config.get("data_host"),
      [this.config.get("data_path"), "metrics", "fema"],
      this.config.get("data_port")
    );

    this.dataSubscription = this.dataSource.subscribe(
      (data) => {
        if (data) {
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
