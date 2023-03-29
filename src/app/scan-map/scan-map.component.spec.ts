/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { ScanMapComponent } from "./scan-map.component";

describe("ScanMapComponent", () => {
  let component: ScanMapComponent;
  let fixture: ComponentFixture<ScanMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScanMapComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
