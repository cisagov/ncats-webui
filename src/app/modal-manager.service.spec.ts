/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from "@angular/core/testing";
import { ModalManagerService } from "./modal-manager.service";

describe("ModalManagerService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModalManagerService],
    });
  });

  it("should ...", inject(
    [ModalManagerService],
    (service: ModalManagerService) => {
      expect(service).toBeTruthy();
    }
  ));
});
