/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from "@angular/core/testing";
import { QueryParamExaminerService } from "./query-param-examiner.service";

describe("QueryParamExaminerService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QueryParamExaminerService],
    });
  });

  it("should ...", inject(
    [QueryParamExaminerService],
    (service: QueryParamExaminerService) => {
      expect(service).toBeTruthy();
    }
  ));
});
