import { TestBed, inject } from "@angular/core/testing";

import { CongressionalService } from "./congressional.service";

describe("CongressionalService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CongressionalService],
    });
  });

  it("should be created", inject(
    [CongressionalService],
    (service: CongressionalService) => {
      expect(service).toBeTruthy();
    }
  ));
});
