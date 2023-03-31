import { Component, OnInit } from "@angular/core";
import { Http, Response } from "@angular/http";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CyhyTitleService } from "../cyhy-title.service";
import { CyhyConfigService } from "../cyhy-config.service";
import { UrlLib } from "../utilities/url-lib";
import { Query } from "./query.interface";

// Bower loaded libraries, @types only.
import * as jQueryType from "jquery";

declare var $: typeof jQueryType;

@Component({
  selector: "app-metrics",
  templateUrl: "./metrics.component.html",
  styleUrls: ["./metrics.component.css"],
})
export class MetricsComponent implements OnInit {
  public queryForm: FormGroup;
  public queryResult: any = undefined;
  public formSubmitted: boolean;
  public queryFlash: string = undefined;
  public isLoading: boolean = false;

  constructor(
    public http: Http,
    private titleService: CyhyTitleService,
    private config: CyhyConfigService
  ) {}

  ngOnInit() {
    this.titleService.setTitle("Metrics");
    this.queryForm = new FormGroup({
      start: new FormControl("", <any>Validators.required),
      end: new FormControl("", <any>Validators.required),

      vuln_ticket_count: new FormControl(),
      top_vulns: new FormControl(),

      top_OS: new FormControl(false),
      top_vuln_services: new FormControl(false),
      top_services: new FormControl(false),
      num_orgs_scanned: new FormControl(false),
      num_addresses_hosts_scanned: new FormControl(false),
      num_reports_generated: new FormControl(false),
      avg_cvss_score: new FormControl(false),
      unique_vulns: new FormControl(false),
      new_vuln_detections: new FormControl(false),
    });
  }

  submit(model: Query, isValid: boolean) {
    this.formSubmitted = true;

    if (isValid) {
      this._renderLoadingState();
      this.http
        .post(
          this.config.get("data_protocol") +
            "://" +
            this.config.get("data_host") +
            ":" +
            this.config.get("data_port") +
            "/" +
            UrlLib.pathJoin([
              this.config.get("data_path"),
              "metrics",
              "results?j",
            ]),
          this._jsonToFormData(model)
        )
        .map((res: Response) => res.json())
        .subscribe(
          (data) => {
            if (data.success) {
              this.queryFlash = undefined;
              this.queryResult = data.results;
            } else {
              this.queryFlash = undefined;
              this._checkResponseForFlash(data);
            }
          },
          (err) => {
            this.queryResult = {
              err: "ERROR - " + err.status + " - " + err.statusText,
            };
            this._renderLoadedState();
            console.log("Err: ", err);
          },
          () => {
            this._renderLoadedState();
          }
        );
    }
  }

  _checkResponseForFlash(res: any) {
    if (res.hasOwnProperty("flash")) {
      this.queryFlash = res.flash;
    }
  }

  _jsonToFormData(json: any) {
    var formData = new FormData();

    for (var key in json) {
      if (json[key]) {
        formData.append(key, json[key]);
      }
    }

    return formData;
  }

  _renderLoadingState() {
    this.isLoading = true;
    $("#querySubmit").prop("disabled", true);
    $("#querySubmit").prop("value", "Getting Results...");
  }

  _renderLoadedState() {
    this.isLoading = false;
    $("#querySubmit").prop("disabled", false);
    $("#querySubmit").prop("value", "Submit");
  }
}
