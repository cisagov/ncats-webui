import { Component, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
import { Params, ActivatedRoute } from "@angular/router";
import { CyhyTitleService } from "../cyhy-title.service";
import { CyhyConfigService } from "../cyhy-config.service";
import { CyhyDataService } from "../cyhy-data.service";
import { Subscription } from "rxjs/Rx";
import { Http, Response } from "@angular/http";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CyhyJsonDataSource } from "../cyhy-data-sources/cyhy-json-data-source";

@Component({
  selector: "app-comma-separated",
  templateUrl: "./stakeholders.component.html",
  styleUrls: ["./stakeholders.component.css"],
})
export class StakeholdersComponent implements OnInit {
  public static cycleName: string = "StakeholdersComponent";
  public api_href: string;
  private reportData: any;
  public isLoading: boolean;
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
    this.titleService.setTitle("Stakeholder Info");
    this.api_href = this.config.getApiPath();
    this.dataSource = new CyhyJsonDataSource(
      "Stakeholder Info",
      this.config.get("data_protocol"),
      this.config.get("data_host"),
      [this.config.get("data_path"), "/stakeholders/"],
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
