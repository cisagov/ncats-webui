import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs/Rx";
import { CyhyDataService } from "../cyhy-data.service";
import { CyhyTitleService } from "../cyhy-title.service";
import { CyhyJsonDataSource } from "../cyhy-data-sources/cyhy-json-data-source";

import * as colorbrewer from "colorbrewer";

// Bower loaded version of d3. Hexbin prevents using @types/d3
declare var d3: any;
declare var queue: any;
declare var topojson: any;
declare var Foundation: any;

let self: any;

@Component({
  selector: "app-host-map",
  templateUrl: "./host-map.component.html",
  styleUrls: ["./host-map.component.css"],
})
export class HostMapComponent implements OnInit {
  public static cycleName: string = "HostMapComponent";
  private width: any;
  private height: any;
  private parseDate: any;
  private color_scale: any;
  private hexbin: any;
  private radius: any;
  private projection: any;
  private scan_source: any;
  private path: any;
  private svg: any;
  private isLoaded: boolean;
  private dataSource: CyhyJsonDataSource;
  private dataSubscription: Subscription;

  constructor(
    private titleService: CyhyTitleService,
    private cyhyDataService: CyhyDataService
  ) {
    self = this;

    self.isLoaded = false;
  }

  ngOnInit() {
    this.titleService.setTitle("Host Locations");
    self.width = $("body").width() * 0.9;
    self.height = $("body").height() - $("#map").offset().top;
    self.parseDate = d3.time.format("%x").parse;

    let scale = 0;
    if (this.width < this.height) {
      scale = this.width;
    } else {
      scale = this.height;
    }

    if (Foundation.utils.is_medium_only()) {
      scale *= 1.2;
    } else if (Foundation.utils.is_large_only()) {
      scale *= 1.6;
    } else if (Foundation.utils.is_xlarge_up()) {
      scale *= 1.9;
    }

    $("#map").width(self.width);
    $("#map").height(self.height);

    let colorArray: string[] = Array.from(colorbrewer.RdBu[9]);
    self.color_scale = d3.scale
      .threshold()
      .domain([10, 50, 250, 500, 1000, 2000, 5000])
      .range(colorArray.reverse());

    self.hexbin = d3.hexbin().size([self.width, self.height]).radius(16);

    self.radius = d3.scale.sqrt().domain([0, 12]).range([0, 8]);

    self.projection = d3.geo
      .albersUsa()
      .scale([scale])
      .translate([self.width / 2, self.height / 2])
      .precision(0.1);

    self.scan_source = self.projection([-77, 39]);

    self.path = d3.geo.path().projection(self.projection);

    self.svg = d3.select("body").select("body").select("#map");

    queue().defer(d3.json, "/assets/topo/us.json").await(self.topo_ready);

    self.dataSource = self.cyhyDataService.getDataSubject(
      self.cyhyDataService.dataIdentifiers.HOST_MAP
    );
    if (self.dataSource) self.dataSource.refreshData();
  }

  ngOnDestroy() {
    if (this.dataSubscription) this.dataSubscription.unsubscribe();
  }

  topo_ready(error: any, us: any): void {
    const promise = new Promise((resolve, reject) => {
      self.svg
        .append("path")
        .datum(topojson.feature(us, us.objects.land))
        .attr("class", "land")
        .attr("d", self.path);

      self.svg
        .append("path")
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
        }
      }

      self.dataSubscription = self.cyhyDataService.subscribeToSubject(
        self.cyhyDataService.dataIdentifiers.HOST_MAP,
        self.update_hexes
      );
    });
  }

  update_hexes(error: any, hosts: any): void {
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
        return self.color_scale(d.length);
      });

      node
        .select("text")
        .text(function (d) {
          return d.length;
        })
        .style("font-size", function (d) {
          if (d.length < 100) return 16;
          if (d.length < 1000) return 12;
          if (d.length < 10000) return 10;
          if (d.length < 100000) return 8;
          if (d.length < 1000000) return 6;
          //return 14;
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

      self.isLoaded = true;
    }
  }
}
