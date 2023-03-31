import { TestBed, inject } from "@angular/core/testing";

import { FemaService } from "./fema.service";

describe("FemaService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FemaService],
    });
  });

  it("should be created", inject([FemaService], (service: FemaService) => {
    expect(service).toBeTruthy();
  }));
});
