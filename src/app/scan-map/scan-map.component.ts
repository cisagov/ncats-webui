import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs/Rx";
import { CyhyDataService } from "../cyhy-data.service";
import { CyhyTitleService } from "../cyhy-title.service";
import { CyhyJsonDataSource } from "../cyhy-data-sources/cyhy-json-data-source";

import * as colorbrewer from "colorbrewer";

// Bower loaded libraries, @types only.
import * as jQueryType from "jquery";

// Bower loaded libraries. Hexbin prevents using @types/d3
declare var d3: any;
declare var queue: any;
declare var topojson: any;
declare var $: typeof jQueryType;
declare var Foundation: any;

let self: any;

@Component({
  selector: "app-scan-map",
  templateUrl: "./scan-map.component.html",
  styleUrls: ["./scan-map.component.css"],
})
export class ScanMapComponent implements OnInit, OnDestroy {
  public static cycleName: string = "ScanMapComponent";
  private svg: any;
  private mapLayer: any;
  private stateLayer: any;
  private path: any;
  private color: any;
  private hexbin: any;
  private scan_source: any;
  private projection: any;
  private update_interval: any;
  private dataSource: CyhyJsonDataSource;
  private dataSubscription: Subscription;

  constructor(
    private router: Router,
    private titleService: CyhyTitleService,
    private cyhyDataService: CyhyDataService
  ) {
    self = this;
    self.router = router;
  }

  ngOnInit() {
    this.titleService.setTitle("Running Map");

    let width = $("body").width() * 0.9,
      height = $("body").height() - $("#map").offset().top,
      parseDate = d3.time.format("%x").parse;

    let scale = 0;
    if (width < height) {
      scale = width;
    } else {
      scale = height;
    }

    if (Foundation.utils.is_medium_only()) {
      scale *= 1.2;
    } else if (Foundation.utils.is_large_only()) {
      scale *= 1.6;
    } else if (Foundation.utils.is_xlarge_up()) {
      scale *= 1.9;
    }

    $("#map").width(width);
    $("#map").height(height);

    self.svg = d3.select("#map");
    self.mapLayer = self.svg.append("path");
    self.stateLayer = self.svg.append("path");

    self.color = d3.scale
      .ordinal()
      .domain(["NETSCAN1", "PORTSCAN", "VULNSCAN"])
      .range(["#c66270", "#cfc666", "#7bbe5e"]);

    self.hexbin = d3.hexbin().size([width, height]).radius(16);

    let radius = d3.scale.sqrt().domain([0, 12]).range([0, 8]);

    self.projection = d3.geo
      .albersUsa()
      .scale([scale])
      .translate([width / 2, height / 2])
      .precision(0.1);

    self.scan_source = self.projection([-77, 39]);

    self.path = d3.geo.path().projection(self.projection);

    queue().defer(d3.json, "/assets/topo/us.json").await(self.topo_ready);

    self.dataSource = self.cyhyDataService.getDataSubject(
      self.cyhyDataService.dataIdentifiers.SCAN_MAP
    );
    if (self.dataSource) self.dataSource.refreshData();
  }

  ngOnDestroy() {
    clearInterval(self.update_interval);
    if (self.dataSubscription) self.dataSubscription.unsubscribe();
  }

  topo_ready(error, us) {
    const promise = new Promise((resolve, reject) => {
      self.mapLayer
        .datum(topojson.feature(us, us.objects.land))
        .attr("class", "land")
        .attr("d", self.path);

      self.stateLayer
        .datum(
          topojson.mesh(us, us.objects.states, function (a, b) {
            return a !== b;
          })
        )
        .attr("class", "states")
        .attr("d", self.path);

      resolve();
    }).then(() => {
      if (self.dataSource) {
        let data = self.dataSource.getData();
        if (data) {
          self.update_hexes(undefined, data);
          self.isLoading = false;
        }
      }
      self.dataSubscription = self.cyhyDataService.subscribeToSubject(
        self.cyhyDataService.dataIdentifiers.SCAN_MAP,
        self.update_hexes
      );
    });
  }

  update_hexes(error, hosts) {
    if (error) {
      return console.warn(error);
    }

    if (hosts && hosts.length > 0) {
      var projected_hosts = [];
      hosts.forEach(function (d) {
        var p = self.projection(d.loc);
        if (p != null) {
          projected_hosts.push({ 0: p[0], 1: p[1], stage: d.stage });
        }
      });
      hosts = projected_hosts;

      // Want to understand what is going on below?: http://bl.ocks.org/mbostock/3808218
      // DATA JOIN
      var node = self.svg.selectAll(".hexagons").data(
        self.hexbin(hosts).sort(function (a, b) {
          return b.length - a.length;
        })
      );

      // UPDATE
      // Update old elements as needed.

      // noop

      // ENTER
      // Create new elements as needed.
      let enters = node
        .enter()
        .append("g")
        .attr("class", "hexagons")
        .attr("transform", "translate(" + self.scan_source + ")");

      enters
        .append("path")
        .attr("d", function (d) {
          return self.hexbin.hexagon();
        })
        .style("fill-opacity", 0)
        .transition()
        .duration(750)
        .style("fill-opacity", 1);

      enters.append("text").attr("text-anchor", "middle").attr("dy", ".35em");

      enters
        .transition()
        .duration(750)
        .attr("transform", function (d) {
          return "translate(" + d.x + "," + d.y + ")";
        });

      // ENTER + UPDATE
      // Appending to the enter selection expands the update selection to include
      // entering elements; so, operations on the update selection after appending to
      // the enter selection will apply to both entering and updating nodes.

      // set text and color of hex
      node.select("path").style("fill", function (d) {
        return self.color(d[0].stage);
      }); //TODO use best color, not first

      node
        .select("text")
        .text(function (d) {
          return d.length;
        })
        .style("font-size", function (d) {
          if (d.length < 100) return 16;
          if (d.length < 1000) return 12;
          return 10;
        });

      // EXIT
      // Remove old elements as needed.
      node
        .exit()
        .transition()
        .duration(750)
        .style("opacity", 0)
        .attr("transform", "translate(" + self.scan_source + ")")
        .remove();

      self.isLoading = false;
    }
  }
}
