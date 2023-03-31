/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { HostMapComponent } from "./host-map.component";

describe("Component: HostMap", () => {
  let component: HostMapComponent;
  let fixture: ComponentFixture<HostMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HostMapComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create an instance", () => {
    expect(component).toBeTruthy();
  });
});
