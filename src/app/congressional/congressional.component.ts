import { Component, OnInit } from "@angular/core";
import { Http, Response } from "@angular/http";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CyhyTitleService } from "../cyhy-title.service";
import { CyhyConfigService } from "../cyhy-config.service";
import { UrlLib } from "../utilities/url-lib";
import { Query } from "./query.interface";

// Bower loaded libraries, @types only.
import * as jQueryType from "jquery";

declare var $: typeof jQueryType;

@Component({
  selector: "app-congressional",
  templateUrl: "./congressional.component.html",
  styleUrls: ["./congressional.component.css"],
})
export class CongressionalComponent implements OnInit {
  public queryForm: FormGroup;
  public queryResult: any = undefined;
  public formSubmitted: boolean;
  public queryFlash: string = undefined;
  public isLoading: boolean = false;

  constructor(
    public http: Http,
    private titleService: CyhyTitleService,
    private config: CyhyConfigService
  ) {}

  ngOnInit() {
    this.titleService.setTitle("Congressional Report");
    this.queryForm = new FormGroup({
      start: new FormControl("", <any>Validators.required),
      end: new FormControl("", <any>Validators.required),
    });
  }

  submit(model: Query, isValid: boolean) {
    console.log(model);
    this.formSubmitted = true;

    if (isValid) {
      this._renderLoadingState();
      this.http
        .post(
          this.config.getApiPath() +
            "/" +
            UrlLib.pathJoin(["metrics", "congressional"]),
          this._jsonToFormData(model)
        )
        .map((res: Response) => res.json())
        .subscribe(
          (data) => {
            //if (data.success) {
            this.queryFlash = undefined;
            this.queryResult = data;
            //} else {
            //  this.queryFlash = undefined;
            //  this._checkResponseForFlash(data);
            //}
          },
          (err) => {
            this.queryResult = {
              err: "ERROR - " + err.status + " - " + err.statusText,
            };
            this._renderLoadedState();
            console.log("Err: ", err);
          },
          () => {
            this._renderLoadedState();
          }
        );
    }
  }

  _checkResponseForFlash(res: any) {
    if (res.hasOwnProperty("flash")) {
      this.queryFlash = res.flash;
    }
  }

  _jsonToFormData(json: any) {
    var formData = new FormData();

    for (var key in json) {
      if (json[key]) {
        formData.append(key, json[key]);
      }
    }
    return formData;
  }

  _renderLoadingState() {
    this.isLoading = true;
    $("#querySubmit").prop("disabled", true);
    $("#querySubmit").prop("value", "Getting Results...");
  }

  _renderLoadedState() {
    this.isLoading = false;
    $("#querySubmit").prop("disabled", false);
    $("#querySubmit").prop("value", "Submit");
  }
}
