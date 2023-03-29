import { Injectable } from "@angular/core";
import { Subscription } from "rxjs/Rx";

import { CyhyConfigService } from "./cyhy-config.service";
import { CyhyDataSource } from "./cyhy-data-sources/cyhy-data-source";
import { CyhyJsonDataSource } from "./cyhy-data-sources/cyhy-json-data-source";
import { CyhyUpdateService } from "./cyhy-update.service";
import { CyhySocketIODataSource } from "./cyhy-data-sources/cyhy-socketio-data-source";
import { UrlLib } from "./utilities/url-lib";

enum cds_identifiers {
  CONNECTED,
  DISCONNECTED,
  DASHBOARD_QUEUE,
  DASHBOARD_METRICS,
  DASHBOARD_SEVERITY,
  STATUS_ALL,
  CYBEX_ALL,
  BOD_ALL,
  HOST_MAP,
  SCAN_MAP,
  UPDATE_SERVICE,
  HIRING_DASHBOARD_METRICS,
  HIRING_DASHBOARD_AVERAGES,
  DASHBOARD_ELECTION_METRICS,
  DASHBOARD_ELECTION_SEVERITY,
}

@Injectable()
export class CyhyDataService {
  private _socket: SocketIOClient.Socket;
  private _observableData: Map<number, CyhyDataSource<any>>;

  public dataIdentifiers = cds_identifiers;

  constructor(private config: CyhyConfigService) {
    this._initializeObservables();
  }

  getData(identifier: number): any {
    if (this._observableData.has(identifier)) {
      return this._observableData.get(identifier).getData();
    } else {
      return null;
    }
  }

  getDataSubject(identifier: number): CyhyDataSource<any> {
    return this._observableData.get(identifier);
  }

  getAllSubjects(): CyhyDataSource<any>[] {
    let result: CyhyDataSource<any>[] = [];

    this._observableData.forEach((source: CyhyDataSource<any>, key: number) => {
      result.push(source);
    });

    return result;
  }

  isDataGood(): boolean {
    let result = true;

    this._observableData.forEach((source: CyhyDataSource<any>, key: number) => {
      if (!source.isConnected()) {
        result = false;
      }
    });

    return result;
  }

  subscribeToSubject(
    identifier: number,
    callback: (err, data) => void
  ): Subscription {
    let subscription = null;
    let subject = this.getDataSubject(identifier);

    if (subject) {
      subscription = subject.subscribe(
        (data) => callback(undefined, data),
        (error) => callback(error, undefined)
      );
    }

    return subscription;
  }

  _initializeObservables(): void {
    let protocol = this.config.get("data_protocol");
    let host = this.config.get("data_host");
    let port = this.config.get("data_port");
    let api_path = this.config.get("data_path");
    let socketio_host: string = UrlLib.pathJoin([host + ":" + port, "cyhy"]);
    let configuredComponents = this.config.get("components");

    this._observableData = new Map<number, CyhyDataSource<any>>();

    if (configuredComponents.bod) {
      this._observableData.set(
        cds_identifiers.BOD_ALL,
        new CyhySocketIODataSource(
          "BOD",
          socketio_host,
          "bod",
          "bod_data_push",
          "bod_latest"
        )
      );
    }

    if (configuredComponents.cybex) {
      this._observableData.set(
        cds_identifiers.CYBEX_ALL,
        new CyhySocketIODataSource(
          "Cybex",
          socketio_host,
          "cybex",
          "cybex_data_push",
          "cybex_latest"
        )
      );
    }

    if (configuredComponents.dashboard) {
      this._observableData.set(
        cds_identifiers.DASHBOARD_QUEUE,
        new CyhySocketIODataSource(
          "Dashboard Queues",
          socketio_host,
          "queues",
          "queues_data_push",
          "queues_latest"
        )
      );
      this._observableData.set(
        cds_identifiers.DASHBOARD_METRICS,
        new CyhySocketIODataSource(
          "Dashboard Metrics",
          socketio_host,
          "overall_metrics",
          "overall_metrics",
          "overall_metrics_latest"
        )
      );
      this._observableData.set(
        cds_identifiers.DASHBOARD_SEVERITY,
        new CyhySocketIODataSource(
          "Dashboard Severity",
          socketio_host,
          "ticket_severity_counts",
          "ticket_severity_counts",
          "ticket_severity_counts_latest"
        )
      );
      this._observableData.set(
        cds_identifiers.DASHBOARD_ELECTION_METRICS,
        new CyhySocketIODataSource(
          "Dashboard Election Metrics",
          socketio_host,
          "election_metrics",
          "election_metrics",
          "election_metrics_latest"
        )
      );
      this._observableData.set(
        cds_identifiers.DASHBOARD_ELECTION_SEVERITY,
        new CyhySocketIODataSource(
          "Dashboard Election Severity",
          socketio_host,
          "election_ticket_severity_counts",
          "election_ticket_severity_counts",
          "election_ticket_severity_counts_latest"
        )
      );
    }

    if (configuredComponents.dashboard) {
      this._observableData.set(
        cds_identifiers.HIRING_DASHBOARD_METRICS,
        new CyhySocketIODataSource(
          "Hiring Dashboard Metrics",
          socketio_host,
          "new_hire_metrics",
          "new_hire_metrics",
          "new_hire_metrics_latest"
        )
      );
    }

    if (configuredComponents.dashboard) {
      this._observableData.set(
        cds_identifiers.HIRING_DASHBOARD_AVERAGES,
        new CyhySocketIODataSource(
          "Hiring Dashboard Averages",
          socketio_host,
          "new_hire_average_metrics",
          "new_hire_average_metrics",
          "hire_average_metrics_latest"
        )
      );
    }

    if (configuredComponents.hostmap) {
      this._observableData.set(
        cds_identifiers.HOST_MAP,
        new CyhyJsonDataSource(
          "Host Location",
          protocol,
          host,
          [api_path, "maps", "hosts"],
          port,
          "j"
        )
      );
    }

    if (configuredComponents.scanmap) {
      this._observableData.set(
        cds_identifiers.SCAN_MAP,
        new CyhyJsonDataSource(
          "Running Scans",
          protocol,
          host,
          [api_path, "maps", "running"],
          port,
          "j",
          30000
        )
      );
    }

    if (configuredComponents.status) {
      this._observableData.set(
        cds_identifiers.STATUS_ALL,
        new CyhyJsonDataSource(
          "Scan Progress",
          protocol,
          host,
          [api_path, "status/"],
          port,
          "j",
          30000
        )
      );
    }

    this._observableData.set(
      cds_identifiers.UPDATE_SERVICE,
      new CyhyUpdateService(
        "Update Manager",
        protocol,
        window.location.hostname,
        ["config", "app.version"],
        window.location.port,
        null,
        60000
      )
    );
  }
}
