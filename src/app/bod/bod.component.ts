import { Component, AfterViewInit, OnInit, OnDestroy } from "@angular/core";
import { Params, ActivatedRoute } from "@angular/router";
import { CyhyTitleService } from "../cyhy-title.service";
import { CyhyConfigService } from "../cyhy-config.service";
import { CyhyDataService } from "../cyhy-data.service";
import { Subscription } from "rxjs/Rx";

/* TODO Should be like this
import * as c3Type from 'c3';
declare var c3: typeof c3Type;*/
declare var c3: any;

let self: any; // Keeping reference for callbacks

@Component({
  selector: "app-bod",
  templateUrl: "./bod.component.html",
  styleUrls: ["./bod.component.css"],
})
export class BodComponent implements OnInit, AfterViewInit, OnDestroy {
  public static cycleName: string = "BodComponent";
  private dataSubscription: Subscription;
  private bod_chart1: any;
  private bod_chart2: any;
  private is_printable_chart: any;
  public api_href: string;
  public display_chart: any;
  public chart: any;

  constructor(
    private titleService: CyhyTitleService,
    private config: CyhyConfigService,
    private cyhyDataService: CyhyDataService,
    private route: ActivatedRoute
  ) {
    self = this;
    self.display_chart = 0;
    enum chart {
      ALL,
      ONE,
      TWO,
    }
    self.chart = chart;
  }

  ngOnInit() {
    self.titleService.setTitle("BOD");
    this.api_href = this.config.getApiPath();
    self.determine_charts_to_display();
  }

  ngAfterViewInit() {
    self.create_charts();
    self.update_all_charts(
      undefined,
      self.cyhyDataService.getData(self.cyhyDataService.dataIdentifiers.BOD_ALL)
    );
    self.dataSubscription = self.cyhyDataService.subscribeToSubject(
      self.cyhyDataService.dataIdentifiers.BOD_ALL,
      self.update_all_charts
    );
  }

  ngOnDestroy() {
    if (self.dataSubscription) self.dataSubscription.unsubscribe();
  }

  determine_charts_to_display() {
    self.route.params.forEach((params: Params) => {
      let chart = params["chart"];
      if (chart === "chart1") {
        self.display_chart = self.chart.ONE;
      } else if (chart === "chart2") {
        self.display_chart = self.chart.TWO;
      } else {
        self.display_chart = self.chart.ALL;
      }
    });

    if (self.display_chart != self.chart.ALL) {
      self.is_printable_chart = true;
    }
  }

  create_charts(): void {
    if (typeof self.is_printable_chart === "undefined") {
      self.is_printable_chart = false;
    }

    if (self.display_chart == self.chart.ONE) {
      self.generate_chart1("#naked_chart1");
    } else if (self.display_chart == self.chart.TWO) {
      self.generate_chart2("#naked_chart2");
    } else {
      self.generate_chart1("#bod_chart1");
      self.generate_chart2("#bod_chart2");
    }
  }

  generate_chart1(id) {
    self.bod_chart1 = c3.generate({
      bindto: id,
      data: {
        columns: [],
        mimeType: "json",
        x: "x",
        types: {
          young: "area",
          mid: "area",
          old: "area",
          backlog: "line",
          total: "line",
        },
        groups: [["young", "mid", "old"]],
        order: null,
        colors: {
          young: "#0099cc",
          mid: "#cc7a00",
          old: "#cc0000",
          backlog: "#00aa00",
          total: "#777777",
        },
        names: {
          young: "< 30 days",
          mid: "30 - 60 days",
          old: "> 60 days",
          backlog: "Backlog",
          total: "Total",
        },
      },
      axis: {
        x: {
          type: "timeseries",
          tick: {
            format: "%Y-%m-%d",
            count: 8,
          },
        },
        y: {
          label: {
            text: "Vulnerability Count",
            position: "outer-middle",
          },
          min: 0,
          padding: {
            bottom: 0,
          },
        },
      },
      padding: {
        right: 20,
      },
      point: {
        show: false,
      },
      grid: {
        x: {
          lines: [
            /* TODO Should be like self
                    <c3Type.LineOptions>{value: 20150601, text: 'DOE Scope Change', position: 'end'},
                    <c3Type.LineOptions>{value: 20150702, text: 'DOE Scope Change', position: 'end'},
                    <c3Type.LineOptions>{value: 20150707, text: 'DOE Scope Change', position: 'end'},
                    <c3Type.LineOptions>{value: 20150714, text: 'Windows Server 2003 EOL', position: 'end'},
                    <c3Type.LineOptions>{value: 20150909, text: 'DOE Scope Change', position: 'end'},
                    */
            { value: "2015-06-01", text: "DOE Scope Change", position: "end" },
            { value: "2015-07-02", text: "DOE Scope Change", position: "end" },
            { value: "2015-07-07", text: "DOE Scope Change", position: "end" },
            {
              value: "2015-07-14",
              text: "Windows Server 2003 EOL",
              position: "end",
            },
            { value: "2015-09-09", text: "DOE Scope Change", position: "end" },
            // {value: '2015-04-24', text: 'Report Agency', position: 'start'}
          ],
        },
        y: {
          show: self.is_printable_chart,
        },
      },
    });
  }

  generate_chart2(id) {
    self.bod_chart2 = c3.generate({
      bindto: id,
      data: {
        columns: [],
        mimeType: "json",
        types: {
          age: "bar",
        },
        groups: [],
        order: null,
        colors: {
          age: "#000000",
        },
        names: {
          age: "vulnerability count",
        },
      },
      axis: {
        x: {
          label: {
            text: "Age (Days)",
            position: "center",
          },
        },
        y: {
          label: {
            text: "Vulnerability Count",
            position: "outer-middle",
          },
          min: 0,
          padding: {
            bottom: 0,
          },
        },
      },
      legend: {
        show: false,
      },
      tooltip: {
        format: {
          title: function (d) {
            if (d == 0) {
              return "less than a day old";
            } else if (d == 1) {
              return "1 day old";
            } else return d + " days old";
          },
        },
      },
      padding: {
        right: 20,
      },
      regions: [
        { start: "0", end: "30", class: "blue" },
        { start: "30", end: "60", class: "yellow" },
        { start: "60", class: "red" },
      ],
      point: {
        show: false,
      },
      grid: {
        x: {
          lines: [
            { value: 30, text: "30 Days", position: "end" },
            { value: 60, text: "60 Days", position: "end" },
          ],
        },
      },
    });
  }

  update_all_charts(err, data): void {
    if (err) {
      console.warn(err);
    }

    if (data) {
      if (self.display_chart == self.chart.ONE) {
        self.bod_chart1.load({ json: JSON.parse(data.bod_chart1) });
      } else if (self.display_chart == self.chart.TWO) {
        self.bod_chart2.load({ json: JSON.parse(data.bod_chart2) });
      } else {
        self.bod_chart1.load({ json: JSON.parse(data.bod_chart1) });
        self.bod_chart2.load({ json: JSON.parse(data.bod_chart2) });
      }
    }
  }
}
