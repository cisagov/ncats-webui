import { ReflectiveInjector } from "@angular/core";
import {
  Http,
  Response,
  XHRBackend,
  ConnectionBackend,
  BrowserXhr,
  ResponseOptions,
  XSRFStrategy,
  BaseResponseOptions,
  CookieXSRFStrategy,
  RequestOptions,
  BaseRequestOptions,
} from "@angular/http";
import { CyhyDataSource } from "./cyhy-data-source";
import { UrlLib } from "../utilities/url-lib";

export class CyhyJsonDataSource extends CyhyDataSource<{}> {
  protected _http: Http;
  protected _protocol: string;
  protected _domain: string;
  protected _path: Array<string>;
  protected _port: string;
  protected _parameters: string;
  protected _refreshPeriod: number;
  protected _refreshInterval: any;
  protected _connectionCheckInterval: any;
  protected _url: string;
  protected _lastRequestSuccessful: boolean;

  constructor(
    name: string,
    protocol: string,
    domain: string,
    path: Array<string>,
    port?: string,
    parameters?: string,
    refreshPeriod?: number
  ) {
    super();
    this._name = name;
    this._http = this._resolveHttpService();
    this._protocol = protocol;
    this._domain = domain;
    this._path = path;
    this._port = port;
    this._parameters = parameters;
    this._refreshPeriod = refreshPeriod;
    this._lastRequestSuccessful = false;

    this._initialize();
    this._pullData();
  }

  _initialize(): void {
    this.update(null);
    this._constructUrl();
    this._setupIntervals();
  }

  refreshData(): CyhyJsonDataSource {
    return this._pullData();
  }

  _pullData(): CyhyJsonDataSource {
    this._http
      .get(this._url)
      .map((res: Response) => res.json())
      .subscribe(
        (data) => {
          this.update(data);
          this._lastRequestSuccessful = true;
        },
        (err) => {
          console.warn(
            this.constructor.name + "._pullData - " + this._url + ": ",
            err
          );
          this._lastRequestSuccessful = false;
        }
      );

    return this;
  }

  isConnected(): boolean {
    return this._lastRequestSuccessful;
  }

  setProtocol(protocol: string): CyhyJsonDataSource {
    this._protocol = protocol;
    this._constructUrl();
    return this;
  }

  setDomain(domain: string): CyhyJsonDataSource {
    this._domain = domain;
    this._constructUrl();
    return this;
  }

  setPath(path: Array<string>): CyhyJsonDataSource {
    this._path = path;
    this._constructUrl();
    return this;
  }

  setPort(port: string): CyhyJsonDataSource {
    this._port = port;
    this._constructUrl();
    return this;
  }

  setParameters(parameters: string): CyhyJsonDataSource {
    this._parameters = parameters;
    this._constructUrl();
    return this;
  }

  setRefreshPeriod(refreshPeriod: number): CyhyJsonDataSource {
    this._refreshPeriod = refreshPeriod;
    this._setupIntervals();
    return this;
  }

  _setupIntervals() {
    if (this._refreshPeriod) {
      clearInterval(this._connectionCheckInterval);

      this._refreshInterval = setInterval(() => {
        this._pullData();
      }, this._refreshPeriod);
    } else {
      clearInterval(this._refreshInterval);

      this._connectionCheckInterval = setInterval(() => {
        this._testConnection();
      }, 60000);
    }
  }

  _testConnection() {
    this._http.head(this._url).subscribe(
      (data) => {
        this._lastRequestSuccessful = true;
      },
      (err) => {
        this._lastRequestSuccessful = false;
      }
    );
  }

  _constructUrl() {
    this._url = this._protocol + "://" + this._domain;
    this._url += this._port ? ":" + this._port : "";
    this._url += "/" + UrlLib.pathJoin(this._path);
    this._url += this._parameters ? "?" + this._parameters : "";
  }

  _resolveHttpService() {
    return ReflectiveInjector.resolveAndCreate([
      Http,
      BrowserXhr,
      { provide: ConnectionBackend, useClass: XHRBackend },
      { provide: ResponseOptions, useClass: BaseResponseOptions },
      { provide: XSRFStrategy, useFactory: () => new CookieXSRFStrategy() },
      { provide: RequestOptions, useClass: BaseRequestOptions },
    ]).get(Http);
  }
}
