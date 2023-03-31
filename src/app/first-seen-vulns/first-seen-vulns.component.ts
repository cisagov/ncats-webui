import { Component, OnInit, OnDestroy } from "@angular/core";
import { CyhyTitleService } from "../cyhy-title.service";
import { CyhyConfigService } from "../cyhy-config.service";
import { Subscription } from "rxjs/Rx";

import { CyhyJsonDataSource } from "../cyhy-data-sources/cyhy-json-data-source";

@Component({
  selector: "app-first-seen-vulns",
  templateUrl: "./first-seen-vulns.component.html",
  styleUrls: ["./first-seen-vulns.component.css"],
})
export class FirstSeenVulnsComponent implements OnInit, OnDestroy {
  public static cycleName: string = "FirstSeenVulnsComponent";
  public SEVERITY: string[];
  public isLoading: boolean;
  public firstSeenVulns: any;
  public selectedVuln: Object;
  private dataSource: CyhyJsonDataSource;
  private dataSubscription: Subscription;
  private vulnDetails: CyhyJsonDataSource;
  private vulnDetailsSubscription: Subscription;

  constructor(
    private titleService: CyhyTitleService,
    private config: CyhyConfigService
  ) {
    this.isLoading = true;
  }

  ngOnInit() {
    this.titleService.setTitle("First-Seen Vulnerabilities");
    this.SEVERITY = ["Info", "Low", "Medium", "High", "Critical"];

    this.dataSource = new CyhyJsonDataSource(
      "First Seen Vulnerabilities",
      this.config.get("data_protocol"),
      this.config.get("data_host"),
      [this.config.get("data_path"), "dashboard", "firstseen"],
      this.config.get("data_port"),
      "j"
    );

    this.dataSubscription = this.dataSource.subscribe(
      (data) => {
        this.firstSeenVulns = data;
        this.isLoading = false;
      },
      (error) => console.warn(error)
    );
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }

    if (this.vulnDetailsSubscription) {
      this.vulnDetailsSubscription.unsubscribe();
    }
  }

  public viewVuln(vuln: Object): void {
    this.isLoading = true;
    this.vulnDetails = new CyhyJsonDataSource(
      "Details",
      this.config.get("data_protocol"),
      this.config.get("data_host"),
      [
        this.config.get("data_path"),
        "dashboard",
        "tq",
        vuln["source"] + ":" + vuln["source_id"],
      ],
      this.config.get("data_port")
    );

    this.vulnDetailsSubscription = this.vulnDetails.subscribe(
      (data) => {
        this.selectedVuln = data;
        this.isLoading = false;
      },
      (error) => console.warn(error)
    );
  }

  public goBack(): void {
    this.selectedVuln = null;
    this.vulnDetailsSubscription.unsubscribe();
  }

  public rowStyle(d): string {
    if (d.details.severity == 3) return "warn";
    if (d.details.severity == 4) return "critical";
  }
}
