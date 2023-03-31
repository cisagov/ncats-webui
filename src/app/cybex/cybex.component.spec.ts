/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { CybexComponent } from "./cybex.component";

describe("CybexComponent", () => {
  let component: CybexComponent;
  let fixture: ComponentFixture<CybexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CybexComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CybexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
