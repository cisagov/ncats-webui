import { TestBed, inject } from "@angular/core/testing";

import { PageCycleService } from "./page-cycle.service";

describe("PageCycleService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PageCycleService],
    });
  });

  it("should be created", inject(
    [PageCycleService],
    (service: PageCycleService) => {
      expect(service).toBeTruthy();
    }
  ));
});
