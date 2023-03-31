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
  selector: "app-hiringdashboard",
  templateUrl: "./hiringdashboard.component.html",
  styleUrls: ["./hiringdashboard.component.css"],
})
export class HiringDashboardComponent implements OnInit, OnDestroy {
  public static cycleName: string = "HiringDashboardComponent";
  private censorNames: boolean;
  private hiringMetricsSubscription: Subscription;
  private avg_days: string;
  private at_risk: number;
  private behind_schedule: number;
  private on_track: number;

  constructor(
    private titleService: CyhyTitleService,
    private cyhyDataService: CyhyDataService,
    private cookies: CookieService
  ) {
    self = this;
    self.titleService.setTitle("HiringDashboard");
    self.censorNames = false;
  }

  ngOnInit() {
    self.check_cookies();

    self.update_hire_metrics(
      undefined,
      self.cyhyDataService.getData(
        self.cyhyDataService.dataIdentifiers.HIRING_DASHBOARD_METRICS
      )
    );

    self.hiringMetricsSubscription = self.cyhyDataService.subscribeToSubject(
      self.cyhyDataService.dataIdentifiers.HIRING_DASHBOARD_METRICS,
      self.update_hire_metrics
    );
  }

  ngOnDestroy() {
    if (self.hiringMetricsSubscription)
      self.hiringMetricsSubscription.unsubscribe();
  }

  check_cookies(): void {
    // self.censorNames = (this.cookies.get(CookieService.CENSOR_NAMES) === 'true');
  }

  update_hire_metrics(err, data): void {
    const AT_RISK_THRESHOLD = 3;
    const BEHIND_SCHEDULE_THRESHOLD = 6;
    const EOD_COLUMN = 10;
    const DAYS_COLUMN = 11;
    const COMPONENT_COLUMN = 0;
    const REFRESH_RATE = 40000; // ms
    const NUMBER_COLUMNS_IN_ROW = 12;
    var stage_averages = new Array(10).fill(0); //Total number weeks in stage
    var num_of_billets_in_stage = new Array(10).fill(0); //This array is used as the divisor to find out the average of week in a particular stage.

    if (err) {
      console.warn(err);
    }

    //Increament placeholder for total number of billets in a given stage
    function counter(current_stage: number) {
      if (
        current_stage > AT_RISK_THRESHOLD &&
        current_stage < BEHIND_SCHEDULE_THRESHOLD
      ) {
        self.at_risk += 1;
      } else if (current_stage >= BEHIND_SCHEDULE_THRESHOLD) {
        self.behind_schedule += 1;
      } else {
        self.on_track += 1;
      }
    }
    //Appends the CSS classes to a Div based on the value of it's contents
    function appendClass(node: HTMLElement, stage: any) {
      if (stage > AT_RISK_THRESHOLD && stage < BEHIND_SCHEDULE_THRESHOLD) {
        node.className = "at-risk grid-text";
      } else if (stage >= BEHIND_SCHEDULE_THRESHOLD) {
        node.className = "behind-schedule grid-text";
      } else if (stage <= AT_RISK_THRESHOLD) {
        node.className = "on-track grid-text";
      }
    }

    function createDiv(
      node: HTMLElement,
      stage: any,
      text: string,
      isStage: boolean
    ) {
      appendClass(node, stage);
      if (isStage && Number.isInteger(stage) && stage < 1) {
        textnode = document.createTextNode("<1");
      } else {
        textnode = document.createTextNode(text);
      }
      node.appendChild(textnode);
    }

    self.at_risk = 0;
    self.on_track = 0;
    self.behind_schedule = 0;

    //This clears the Billets Div. If the web daemon is restarted it would just append a 2nd set of data otherwise
    if (!$("#billets").is(":empty")) {
      $("#billets").empty();
    }

    var textnode;
    var number_of_billets;

    if (data) {
      let json_data = JSON.parse(data.data);
      if (json_data) {
        var avg_days = 0;
        number_of_billets = json_data.length; // TODO: check for unused
        for (var doc = 0; doc < json_data.length; doc++) {
          //Create row and append to container
          var node = document.createElement("DIV");
          node.className = "grid-row highlight";
          node.id = "grid-row" + String(doc);
          document.getElementById("billets").appendChild(node);

          //Append Billet Number to row as first column
          console.log(json_data);
          var current_stage = json_data[doc].current_stage;
          current_stage -= 1;
          counter(json_data[doc].weeks_in_stage[current_stage]);
          var node = document.createElement("DIV");
          createDiv(
            node,
            json_data[doc].weeks_in_stage[current_stage],
            json_data[doc].position_number.toString(),
            false
          );
          console.log(json_data[doc].position_number.toString());
          console.log(json_data[doc].weeks_in_stage[current_stage]);
          document.getElementById("grid-row" + String(doc)).appendChild(node);

          console.log(json_data[doc].sub_component);
          var node = document.createElement("DIV");
          createDiv(
            node,
            json_data[doc].weeks_in_stage[current_stage],
            json_data[doc].sub_component.toString(),
            false
          );
          document.getElementById("grid-row" + String(doc)).appendChild(node);

          for (var column = 0; column < NUMBER_COLUMNS_IN_ROW; column++) {
            var node = document.createElement("DIV");
            if (column >= EOD_COLUMN) {
              //Calculate number of days since billet started
              let date0 = +new Date(json_data[doc].billet_started);
              let date1 = +new Date();
              //Javascript dates are saved as milliseconds since 1970-01-01T00:00:00Z thus needing to divide by the amount of milliseconds in a day (8.64e7).
              var numberOfDays = Math.ceil((date1 - date0) / 8.64e7);
              //If the Billets has been open longer than one day
              if (column == DAYS_COLUMN && numberOfDays > 0) {
                createDiv(
                  node,
                  json_data[doc].weeks_in_stage[current_stage],
                  "" + numberOfDays,
                  false
                );
                avg_days += numberOfDays;
              }
              //If 10th column append EOD
              else if (column == EOD_COLUMN) {
                createDiv(
                  node,
                  json_data[doc].weeks_in_stage[current_stage],
                  json_data[doc].eod.toString(),
                  false
                );
              }
            }
            //Append stages 1-10 if not null
            else if (json_data[doc].weeks_in_stage[column] !== null) {
              //Keeps track of the total number of weeks per stage
              stage_averages[column] += json_data[doc].weeks_in_stage[column];
              //Keeps track of the number of billets in a stage
              num_of_billets_in_stage[column] += 1;
              createDiv(
                node,
                json_data[doc].weeks_in_stage[column],
                json_data[doc].weeks_in_stage[column],
                true
              );
            }
            //Append empty Divs for null values of stages
            else {
              textnode = document.createTextNode(""); // Create a empty text node
              node.appendChild(textnode);
            }
            document.getElementById("grid-row" + String(doc)).appendChild(node);
          }
          self.waitingOnMetrics = false;
        }
        //Change values for boxes at bottom of page
        document.getElementById("behind_schedule").textContent = String(
          self.behind_schedule
        );
        document.getElementById("at_risk").textContent = String(self.at_risk);
        document.getElementById("on_track").textContent = String(self.on_track);
        //Update Average Days
        self.avg_days = String(Math.round(avg_days / json_data.length));
        if (document.getElementById("avg_days") != null) {
          document.getElementById("avg_days").textContent = self.avg_days;
        }
      }
    }

    //This clears the Averages row. If the web daemon is restarted it would just append a 2nd averages row otherwise
    if (!$("#avg").is(":empty")) {
      $("#avg").empty();
    }

    // If there is no data do not append averages row
    if (data) {
      //Create Row containing Averages
      node = document.createElement("DIV");
      textnode = document.createTextNode("AVERAGE");
      node.appendChild(textnode);
      node.className = "grid-text";
      document.getElementById("avg").appendChild(node);
      node = document.createElement("DIV");
      createDiv(node, "", "", false);
      document.getElementById("avg").appendChild(node);

      //Iterate through stages 1-10
      for (var averages_column = 1; averages_column < 11; averages_column++) {
        node = document.createElement("DIV");
        var stage_average =
          stage_averages[averages_column - 1] /
          num_of_billets_in_stage[averages_column - 1];
        createDiv(
          node,
          Math.round(stage_average * 10) / 10,
          String(Math.round(stage_average * 10) / 10),
          true
        ); // Multiplying by ten and then dividing by ten gets you rounded to the nearest tenths place
        document.getElementById("avg").appendChild(node);
      }

      // TODO: take actual averages given the dates
      //Append blank DIV for EOD column
      node = document.createElement("DIV");
      createDiv(node, "", "", false);
      document.getElementById("avg").appendChild(node);
      //Append Average Days
      node = document.createElement("DIV");
      textnode = document.createTextNode(self.avg_days);
      node.id = "avg_days";
      node.className = "grid-text";
      node.appendChild(textnode);
      document.getElementById("avg").appendChild(node);
    }
    //Auto Scroll
    //Get Billets Div
    self.$list = $("#billets");
    self.$listSH = self.$list[0].scrollHeight - self.$list.outerHeight();

    function loop() {
      //Set page to top
      var t = self.$list.scrollTop();
      //If not at top slowly animate down the page.
      self.$list
        .stop()
        .animate({ scrollTop: !t ? self.$listSH : 0 }, REFRESH_RATE, loop);
    }
    loop();
    //If mouseover stop auto scrolling
    self.$list.on("mouseenter mouseleave", function (e) {
      return e.type == "mouseenter" ? self.$list.stop() : loop();
    });
  }
}
