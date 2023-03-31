import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FemaComponent } from "./fema.component";

describe("FemaComponent", () => {
  let component: FemaComponent;
  let fixture: ComponentFixture<FemaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FemaComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
