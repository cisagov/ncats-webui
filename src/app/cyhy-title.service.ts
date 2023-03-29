import { Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";

@Injectable()
export class CyhyTitleService {
  constructor(private titleService: Title) {}

  setTitle(newTitle: string) {
    this.titleService.setTitle("Cyber Hygiene | " + newTitle);
  }
}
