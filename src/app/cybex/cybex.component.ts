import { Component, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
import { Params, ActivatedRoute } from "@angular/router";
import { CyhyTitleService } from "../cyhy-title.service";
import { CyhyConfigService } from "../cyhy-config.service";
import { CyhyDataService } from "../cyhy-data.service";
import { Subscription } from "rxjs/Rx";

/* TODO Should be like self
import * as c3Type from 'c3';
declare var c3: typeof c3Type;*/
declare var c3: any;

let self: any; // Keeping reference for callbacks

@Component({
  selector: "app-cybex",
  templateUrl: "./cybex.component.html",
  styleUrls: ["./cybex.component.css"],
})
export class CybexComponent implements OnInit, OnDestroy {
  public static cycleName: string = "CybexComponent";
  private dataSubscription: Subscription;
  private cybex_chart1: any;
  private cybex_chart2: any;
  private cybex_chart3: any;
  private cybex_chart4: any;
  private is_printable_chart: boolean;
  public display_chart: any;
  public chart: any;
  public api_href: string;

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
      THREE,
      FOUR,
    }
    self.chart = chart;
  }

  ngOnInit() {
    self.titleService.setTitle("Cyber Exposure");
    this.api_href = this.config.getApiPath();
    self.determine_charts_to_display();
  }

  ngAfterViewInit() {
    self.create_charts();
    self.update_all_charts(
      undefined,
      self.cyhyDataService.getData(
        self.cyhyDataService.dataIdentifiers.CYBEX_ALL
      )
    );
    self.dataSubscription = self.cyhyDataService.subscribeToSubject(
      self.cyhyDataService.dataIdentifiers.CYBEX_ALL,
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
      } else if (chart === "chart3") {
        self.display_chart = self.chart.THREE;
      } else if (chart === "chart4") {
        self.display_chart = self.chart.FOUR;
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
    } else if (self.display_chart == self.chart.THREE) {
      self.generate_chart3("#naked_chart3");
    } else if (self.display_chart == self.chart.FOUR) {
      self.generate_chart4("#naked_chart4");
    } else {
      self.generate_chart1("#cybex_chart1");
      self.generate_chart2("#cybex_chart2");
      self.generate_chart3("#cybex_chart3");
      self.generate_chart4("#cybex_chart4");
    }
  }

  update_all_charts(err, data): void {
    if (err) {
      console.warn(err);
    }

    if (data) {
      if (self.display_chart == self.chart.ONE) {
        self.cybex_chart1.load({ json: JSON.parse(data.cybex_chart1) });
      } else if (self.display_chart == self.chart.TWO) {
        self.cybex_chart2.load({ json: JSON.parse(data.cybex_chart2) });
      } else if (self.display_chart == self.chart.THREE) {
        self.cybex_chart3.load({ json: JSON.parse(data.cybex_chart3) });
      } else if (self.display_chart == self.chart.FOUR) {
        self.cybex_chart4.load({ json: JSON.parse(data.cybex_chart4) });
      } else {
        self.cybex_chart1.load({ json: JSON.parse(data.cybex_chart1) });
        self.cybex_chart2.load({ json: JSON.parse(data.cybex_chart2) });
        self.cybex_chart3.load({ json: JSON.parse(data.cybex_chart3) });
        self.cybex_chart4.load({ json: JSON.parse(data.cybex_chart4) });
      }
    }
  }

  generate_chart1(id) {
    self.cybex_chart1 = c3.generate({
      bindto: id,
      data: {
        columns: [],
        mimeType: "json",
        x: "x",
        types: {
          young: "area",
          old: "area",
          total: "line",
        },
        groups: [["young", "old"]],
        order: null,
        colors: {
          young: "#0099cc",
          old: "#cc0000",
          total: "#777777",
        },
        names: {
          young: "< 30 days",
          old: "> 30 days",
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
          // label: {
          //     text: 'Date',
          //     position: 'outer-center'
          // }
        },
        y: {
          label: {
            text: "Vulnerability Count",
            position: "outer-middle",
          },
          // min: 0,
          // max: 1400,
          padding: {
            bottom: 0,
          },
        },
      },
      padding: {
        right: 25,
      },
      regions: [
        // {start: '2015-04-17', end: '2015-4-24', class:'yellow'},
        // {start: '2015-04-24', class:'red'}
      ],
      point: {
        show: false,
      },
      grid: {
        x: {
          lines: [
            //{value: '2015-05-21', text: 'BOD 15-01 Start', position: 'end'},
          ],
        },
        y: {
          show: self.is_printable_chart,
        },
      },
    });
  }

  generate_chart2(id) {
    self.cybex_chart2 = c3.generate({
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
          type: "category",
          label: {
            text: "Age (Days)",
            position: "center",
          },
          tick: {
            //count: 10,
            values: [0, 20, 40, 60, 80, 100, 120, 140, 160, 180],
            fit: false,
            centered: true /*,
					format: function (d) {
						return (d == 180) ? (d+'+') : d;
					},*/,
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
          tick: {
            /*format: function (d) {
						return (parseInt(d) == d) ? d : null;
					}*/
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
            } else if (d == 180) {
              return "180+ days old";
            } else if (d > 180) {
              return null;
            } else return d + " days old";
          },
        },
      },
      padding: {
        right: 18,
      },
      regions: [
        { start: "0", end: "7", class: "cybex-age1" /*, opacity:0.4*/ },
        { start: "7", end: "14", class: "cybex-age2" /*, opacity:0.4*/ },
        { start: "14", end: "21", class: "cybex-age3" /*, opacity:0.4*/ },
        { start: "21", end: "30", class: "cybex-age4" /*, opacity:0.4*/ },
        { start: "30", end: "90", class: "cybex-age5" /*, opacity:0.4*/ },
        { start: "90", class: "cybex-age6" /*, opacity:0.3*/ },
      ],
      point: {
        show: false,
      },
      grid: {
        x: {
          lines: [
            { value: 7, text: "7 Days", position: "end" },
            { value: 14, text: "14 Days", position: "end" },
            { value: 21, text: "21 Days", position: "end" },
            { value: 30, text: "30 Days", position: "end" },
            { value: 90, text: "90 Days", position: "end" },
          ],
        },
      },
    });
  }

  generate_chart3(id) {
    self.cybex_chart3 = c3.generate({
      bindto: id,
      data: {
        columns: [],
        mimeType: "json",
        x: "x",
        types: {
          young: "area",
          old: "area",
          total: "line",
        },
        groups: [["young", "old"]],
        order: null,
        colors: {
          young: "#0099cc",
          old: "#cc0000",
          total: "#777777",
        },
        names: {
          young: "< 30 days",
          old: "> 30 days",
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
          // label: {
          //     text: 'Date',
          //     position: 'outer-center'
          // }
        },
        y: {
          label: {
            text: "Vulnerability Count",
            position: "outer-middle",
          },
          // min: 0,
          // max: 1400,
          padding: {
            bottom: 0,
          },
        },
      },
      padding: {
        right: 25,
      },
      regions: [
        // {start: '2015-04-17', end: '2015-4-24', class:'yellow'},
        // {start: '2015-04-24', class:'red'}
      ],
      point: {
        show: false,
      },
      grid: {
        x: {
          lines: [
            //{value: '2015-05-21', text: 'BOD 15-01 Start', position: 'end'},
          ],
        },
        y: {
          show: self.is_printable_chart,
        },
      },
    });
  }

  generate_chart4(id) {
    self.cybex_chart4 = c3.generate({
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
          type: "category",
          label: {
            text: "Age (Days)",
            position: "center",
          },
          tick: {
            //count: 10,
            values: [0, 40, 80, 120, 160, 200, 240, 280, 320, 360],
            fit: false,
            centered: true,
            /*format: function (d) {
						return (d == 360) ? (d+'+') : d;
					}*/
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
            } else if (d == 360) {
              return "360+ days old";
            } else if (d > 360) {
              return null;
            } else return d + " days old";
          },
        },
      },
      padding: {
        right: 20,
      },
      regions: [
        { start: "0", end: "14", class: "cybex-age1" /*, opacity:0.4*/ },
        { start: "14", end: "28", class: "cybex-age2" /*, opacity:0.4*/ },
        { start: "28", end: "42", class: "cybex-age3" /*, opacity:0.4*/ },
        { start: "42", end: "60", class: "cybex-age4" /*, opacity:0.4*/ },
        { start: "60", end: "180", class: "cybex-age5" /*, opacity:0.4*/ },
        { start: "180", class: "cybex-age6" /*, opacity:0.3*/ },
      ],
      point: {
        show: false,
      },
      grid: {
        x: {
          lines: [
            { value: 14, text: "14 Days", position: "end" },
            { value: 28, text: "28 Days", position: "end" },
            { value: 42, text: "42 Days", position: "end" },
            { value: 60, text: "60 Days", position: "end" },
            { value: 180, text: "180 Days", position: "end" },
          ],
        },
      },
    });
  }
}
