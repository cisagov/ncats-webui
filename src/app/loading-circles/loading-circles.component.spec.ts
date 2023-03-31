/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { LoadingCirclesComponent } from "./loading-circles.component";

describe("LoadingCirclesComponent", () => {
  let component: LoadingCirclesComponent;
  let fixture: ComponentFixture<LoadingCirclesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingCirclesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingCirclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
