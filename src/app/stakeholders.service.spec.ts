import { TestBed, inject } from "@angular/core/testing";

import { StakeholdersService } from "./stakeholders.service";

describe("StakeholdersService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StakeholdersService],
    });
  });

  it("should be created", inject(
    [StakeholdersService],
    (service: StakeholdersService) => {
      expect(service).toBeTruthy();
    }
  ));
});
