import { Component, OnInit } from "@angular/core";
import { CyhyTitleService } from "../cyhy-title.service";

@Component({
  selector: "app-homepage",
  templateUrl: "./homepage.component.html",
  styleUrls: ["./homepage.component.css"],
})
export class HomepageComponent implements OnInit {
  public static cycleName: string = "HomepageComponent";

  constructor(private titleService: CyhyTitleService) {}

  ngOnInit() {
    this.titleService.setTitle("Welcome");
  }
}
