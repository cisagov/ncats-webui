/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from "@angular/core/testing";
import { CyhyTitleService } from "./cyhy-title.service";

describe("Service: CyhyTitleService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CyhyTitleService],
    });
  });

  it("should ...", inject([CyhyTitleService], (service: CyhyTitleService) => {
    expect(service).toBeTruthy();
  }));
});
