import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RiskRatingComponent } from "./risk-rating.component";

describe("RiskRatingComponent", () => {
  let component: RiskRatingComponent;
  let fixture: ComponentFixture<RiskRatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RiskRatingComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
