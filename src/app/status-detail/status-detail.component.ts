import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs/Rx";
import { CyhyTitleService } from "../cyhy-title.service";
import { CyhyConfigService } from "../cyhy-config.service";

import { CyhyJsonDataSource } from "../cyhy-data-sources/cyhy-json-data-source";

@Component({
  selector: "app-status-detail",
  templateUrl: "./status-detail.component.html",
  styleUrls: ["./status-detail.component.css"],
})
export class StatusDetailComponent implements OnInit {
  private static readonly STAGES: string[] = [
    "NETSCAN1",
    "NETSCAN2",
    "PORTSCAN",
    "VULNSCAN",
    "BASESCAN",
  ];
  private static readonly STATUS: string[] = [
    "WAITING",
    "READY",
    "RUNNING",
    "DONE",
  ];
  private static readonly SUBSCRIPTION_REFRESH_TIME: number = 20000;

  public customer: any;
  public tallyTableData: any; // Types are [string, number[]]
  private customerDataSource: CyhyJsonDataSource;
  private customerDataSubscription: Subscription;

  constructor(
    private titleService: CyhyTitleService,
    private config: CyhyConfigService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.updateCustomerSubscription(params["acronym"]);
    });
  }

  ngOnDestroy() {
    this.customerDataSubscription.unsubscribe();
  }

  updateCustomer(newCustomer: Object): void {
    this.customer = newCustomer;
    this.titleService.setTitle(newCustomer["_id"] + " Details");

    this.customer["scan_limits"].sort(function (a, b) {
      if (a.scanType > b.scanType) return 1;
      if (a.scanType < b.scanType) return -1;
      return 0; // a must be equal to b
    });
  }

  updateCustomerSubscription(acronym: string): void {
    if (this.customerDataSource) {
      this.customerDataSource.setPath([
        this.config.get("data_path"),
        "status",
        acronym,
      ]);
      this.customerDataSource.refreshData();
    } else {
      this.customerDataSubscription = this._setupCustomerSubscription(acronym);
    }

    this.router.navigate(["/status", acronym]);
    window.scrollTo(0, 0);
  }

  updateTallyTableData(tally: Object): void {
    this.tallyTableData = [];

    let counts = this._orderBy(
      StatusDetailComponent.STAGES,
      tally["counts"],
      true
    );
    for (var count of counts) {
      this.tallyTableData.push([
        count[0],
        this._orderBy(StatusDetailComponent.STATUS, count[1], false),
      ]);
    }
  }

  _orderBy(ordering, data, withKeys) {
    var result = [];

    for (var obj of ordering) {
      if (withKeys == true) {
        result.push([obj, data[obj]]);
      } else {
        result.push(data[obj]);
      }
    }

    return result;
  }

  _setupCustomerSubscription(acronym: string): Subscription {
    this.customerDataSource = new CyhyJsonDataSource(
      "Status Detail",
      this.config.get("data_protocol"),
      this.config.get("data_host"),
      [this.config.get("data_path"), "status", acronym],
      this.config.get("data_port"),
      "j",
      StatusDetailComponent.SUBSCRIPTION_REFRESH_TIME
    );

    return this.customerDataSource.subscribe(
      (data) => {
        if (data) {
          this.updateCustomer(data["request"]);
          this.updateTallyTableData(data["tally"]);
        }
      },
      (error) => console.warn(error)
    );
  }
}
