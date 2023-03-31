/* Adapted from https://gist.github.com/fernandohu/122e88c3bcd210bbe41c608c36306db9 */
import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { UrlLib } from "./utilities/url-lib";

@Injectable()
export class CyhyConfigService {
  private config: Object = null;

  constructor(private http: Http) {}

  /**
   * Use to get the data found in the second file (config file)
   */
  public get(key: any) {
    return this.config[key];
  }

  /**
   * This method loads "config.json" to get all configuration variables
   */
  public load() {
    return new Promise((resolve, reject) => {
      let request: any = null;

      this.http
        .get("/config/config.json")
        .map((res: Response) => res.json())
        .subscribe(
          (responseData) => {
            this.config = responseData;
            resolve(true);
          },
          (err) => {
            console.error("Error reading configuration file");
            resolve(err);
            throw err;
          }
        );
    });
  }

  /**
   * This will return the full URI of the api specified by the config file.
   */
  public getApiPath(): string {
    return UrlLib.removeTrailingSlash(
      this.get("data_protocol") +
        "://" +
        this.get("data_host") +
        ":" +
        this.get("data_port") +
        "/" +
        this.get("data_path")
    );
  }
}
