/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { MetricsResultsComponent } from "./metrics-results.component";

describe("MetricsResultsComponent", () => {
  let component: MetricsResultsComponent;
  let fixture: ComponentFixture<MetricsResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MetricsResultsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricsResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
