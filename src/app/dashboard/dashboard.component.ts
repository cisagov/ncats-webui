import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "../cookie.service";
import { CyhyTitleService } from "../cyhy-title.service";
import { CyhyDataService } from "../cyhy-data.service";
import { Subscription } from "rxjs/Rx";

// Bower loaded libraries, @types only.
import * as d3Type from "d3";
import * as jQueryType from "jquery";

// Importing d3 conflicts with status page. This is a workaround.
declare var d3: typeof d3Type;
declare var $: typeof jQueryType;

let self: any; // Keeping reference for callbacks

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  public static cycleName: string = "DashboardComponent";
  private queueSubscription: Subscription;
  private metricsSubscription: Subscription;
  private severityCountsSubscription: Subscription;
  private electionMetricsSubscription: Subscription;
  private electionSeverityCountsSubscription: Subscription;
  private waitingOnQueues: boolean;
  private waitingOnMetrics: boolean;
  private waitingOnTicketSeverity: boolean;
  private waitingOnElectionMetrics: boolean;
  private waitingOnElectionTicketSeverity: boolean;
  private censorNames: boolean;
  private showElectionData: boolean;

  constructor(
    private titleService: CyhyTitleService,
    private cyhyDataService: CyhyDataService,
    private router: Router,
    private cookies: CookieService
  ) {
    self = this;
    self.titleService.setTitle("Dashboard");
    self.waitingOnQueues = true;
    self.waitingOnMetrics = true;
    self.waitingOnTicketSeverity = true;
    self.waitingOnElectionMetrics = true;
    self.waitingOnElectionTicketSeverity = true;
    self.censorNames = false;
    self.showElectionData = false;
  }

  ngOnInit() {
    self.check_cookies();

    self.update_all_charts(
      undefined,
      self.cyhyDataService.getData(
        self.cyhyDataService.dataIdentifiers.DASHBOARD_QUEUE
      )
    );

    if (this.showElectionData) {
      self.update_overall_metrics(
        undefined,
        self.cyhyDataService.getData(
          self.cyhyDataService.dataIdentifiers.DASHBOARD_ELECTION_METRICS
        )
      );
      self.update_stakeholders(
        undefined,
        self.cyhyDataService.getData(
          self.cyhyDataService.dataIdentifiers.DASHBOARD_ELECTION_SEVERITY
        )
      );
      document.getElementById("metrics").textContent = "ELECTION METRICS";
      document.getElementById("stakeholder_type").textContent =
        "ELECTION STAKEHOLDER";
      document.getElementById("number_of_stakeholders").textContent =
        "ELECTION STAKEHOLDERS";
    } else {
      self.update_overall_metrics(
        undefined,
        self.cyhyDataService.getData(
          self.cyhyDataService.dataIdentifiers.DASHBOARD_METRICS
        )
      );
      self.update_stakeholders(
        undefined,
        self.cyhyDataService.getData(
          self.cyhyDataService.dataIdentifiers.DASHBOARD_SEVERITY
        )
      );
      document.getElementById("metrics").textContent = "OVERALL METRICS";
      document.getElementById("stakeholder_type").textContent = "STAKEHOLDER";
      document.getElementById("number_of_stakeholders").textContent =
        "STAKEHOLDERS";
    }

    self.queueSubscription = self.cyhyDataService.subscribeToSubject(
      self.cyhyDataService.dataIdentifiers.DASHBOARD_QUEUE,
      self.update_all_charts
    );
    if (this.showElectionData) {
      self.electionMetricsSubscription =
        self.cyhyDataService.subscribeToSubject(
          self.cyhyDataService.dataIdentifiers.DASHBOARD_ELECTION_METRICS,
          self.update_overall_metrics
        );
      self.electionSeverityCountsSubscription =
        self.cyhyDataService.subscribeToSubject(
          self.cyhyDataService.dataIdentifiers.DASHBOARD_ELECTION_SEVERITY,
          self.update_stakeholders
        );
    } else {
      self.metricsSubscription = self.cyhyDataService.subscribeToSubject(
        self.cyhyDataService.dataIdentifiers.DASHBOARD_METRICS,
        self.update_overall_metrics
      );
      self.severityCountsSubscription = self.cyhyDataService.subscribeToSubject(
        self.cyhyDataService.dataIdentifiers.DASHBOARD_SEVERITY,
        self.update_stakeholders
      );
    }
  }

  ngOnDestroy() {
    if (self.queueSubscription) self.queueSubscription.unsubscribe();
    if (self.metricsSubscription) self.metricsSubscription.unsubscribe();
    if (self.severityCountsSubscription)
      self.severityCountsSubscription.unsubscribe();
    if (self.electionMetricsSubscription)
      self.electionMetricsSubscription.unsubscribe();
    if (self.electionSeverityCountsSubscription)
      self.electionSeverityCountsSubscription.unsubscribe();
  }

  check_cookies(): void {
    self.censorNames = this.cookies.get(CookieService.CENSOR_NAMES) === "true";
    self.showElectionData =
      this.cookies.get(CookieService.ELECTION_DASHBOARD) === "true";
  }

  tween_it(element, new_datum, in_tween_duration): void {
    var calced_tween_duration =
      typeof in_tween_duration === "undefined" ? 5000 : in_tween_duration;
    var previous_datum = element.datum();
    if (!$.isNumeric(previous_datum)) {
      previous_datum = 0;
    }
    element
      .datum(new_datum)
      .transition()
      .duration(calced_tween_duration)
      .tween("text", function (d) {
        var i = d3.interpolateRound(previous_datum, d);
        return function (t) {
          this.textContent = d3.format(",")(i(t));
        };
      });
  }

  update_chart(chart_text, column_data): void {
    let svg_text = d3.select(chart_text);
    self.tween_it(svg_text, column_data, 5000);
  }

  update_all_charts(err, data): void {
    if (err) {
      console.warn(err);
    }

    if (data) {
      let json_data = JSON.parse(data.data);
      if (json_data) {
        self.update_chart("#ns1_waiting", json_data.ns1_waiting | 0);
        self.update_chart("#ns1_running", json_data.ns1_running | 0);
        self.update_chart("#ns2_waiting", json_data.ns2_waiting | 0);
        self.update_chart("#ns2_running", json_data.ns2_running | 0);
        self.update_chart("#ps_waiting", json_data.ps_waiting | 0);
        self.update_chart("#ps_running", json_data.ps_running | 0);
        self.update_chart("#vs_waiting", json_data.vs_waiting | 0);
        self.update_chart("#vs_running", json_data.vs_running | 0);
        self.waitingOnQueues = false;
      }
    }
  }

  update_single_overall_metric(new_datum, selector): void {
    var text_element = d3.select(selector);
    self.tween_it(text_element, new_datum, 5000);
  }

  update_overall_metrics(err, data): void {
    if (err) {
      console.warn(err);
    }

    if (data) {
      let json_data = JSON.parse(data.data);
      if (json_data) {
        self.update_single_overall_metric(
          json_data.stakeholders,
          "#stakeholders"
        );
        self.update_single_overall_metric(json_data.addresses, "#addresses");
        self.update_single_overall_metric(json_data.hosts, "#hosts");
        self.update_single_overall_metric(
          json_data.vulnerable_hosts,
          "#vulnerable_hosts"
        );
        self.update_single_overall_metric(
          json_data.open_tickets.total,
          "#vulns_total"
        );
        self.update_single_overall_metric(
          json_data.open_tickets.critical,
          "#vulns_critical"
        );
        self.update_single_overall_metric(
          json_data.open_tickets.high,
          "#vulns_high"
        );
        self.update_single_overall_metric(
          json_data.open_tickets.medium,
          "#vulns_medium"
        );
        self.update_single_overall_metric(
          json_data.open_tickets.low,
          "#vulns_low"
        );
        self.update_single_overall_metric(json_data.reports, "#reports");
        self.waitingOnMetrics = false;
      }
    }
  }

  update_stakeholders(err, data): void {
    if (err) {
      console.warn(err);
    }
    if (data) {
      let stakeholder_data = JSON.parse(data.data);

      if (stakeholder_data) {
        let stakeholder_name_class = "small-10 columns";
        stakeholder_name_class += self.censorNames ? " censored" : "";

        //binding on org_name
        var top_div = d3
          .select("#stakeholder_column")
          .selectAll("div.row")
          .data(stakeholder_data.slice(0, 10), function (d: any) {
            try {
              return d.org_name;
            } catch (e) {
              console.log(e);
            }
          });

        //entering
        var enters_row = top_div
          .enter()
          .append("div")
          .classed("row status", true);

        var enters_name = enters_row
          .append("div")
          .classed(stakeholder_name_class, true)
          .text(function (d) {
            return d.org_name.toUpperCase();
          });

        var enters_critical = enters_row
          .append("div")
          .classed("small-1 columns vuln-critical", true)
          .text(function (d) {
            return d.critical_open;
          });

        var enters_high = enters_row
          .append("div")
          .classed("small-1 columns vuln-high", true)
          .text(function (d) {
            return d.high_open;
          });

        //updating
        var crits = top_div.select("div.vuln-critical").text(function (d) {
          return d.critical_open;
        });

        var highs = top_div.select("div.vuln-high").text(function (d) {
          return d.high_open;
        });

        //exiting
        top_div.exit().remove();

        self.waitingOnTicketSeverity = false;
      }
    }
  }
}
