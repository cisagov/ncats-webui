/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from "@angular/core/testing";
import { CyhyDataService } from "./cyhy-data.service";

describe("Service: CyhyData", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CyhyDataService],
    });
  });

  it("should ...", inject([CyhyDataService], (service: CyhyDataService) => {
    expect(service).toBeTruthy();
  }));
});
