/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { HiringDashboardComponent } from "./hiringdashboard.component";

describe("Component: HiringDashboard", () => {
  let component: HiringDashboardComponent;
  let fixture: ComponentFixture<HiringDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HiringDashboardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HiringDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create an instance", () => {
    expect(component).toBeTruthy();
  });
});
