/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from "@angular/core/testing";
import { CyhyUpdateService } from "./cyhy-update.service";

describe("Service: CyhyUpdateService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CyhyUpdateService],
    });
  });

  it("should ...", inject([CyhyUpdateService], (service: CyhyUpdateService) => {
    expect(service).toBeTruthy();
  }));
});
