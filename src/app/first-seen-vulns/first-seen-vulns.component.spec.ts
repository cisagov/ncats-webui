/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { FirstSeenVulnsComponent } from "./first-seen-vulns.component";

describe("FirstSeenVulnsComponent", () => {
  let component: FirstSeenVulnsComponent;
  let fixture: ComponentFixture<FirstSeenVulnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FirstSeenVulnsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstSeenVulnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
