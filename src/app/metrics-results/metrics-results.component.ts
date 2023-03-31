import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-metrics-results",
  templateUrl: "./metrics-results.component.html",
  styleUrls: ["./metrics-results.component.css"],
})
export class MetricsResultsComponent implements OnInit {
  @Input() queryResult = undefined;

  constructor() {}

  ngOnInit() {}
}
