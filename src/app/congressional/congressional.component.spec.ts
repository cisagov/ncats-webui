import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CongressionalComponent } from "./congressional.component";

describe("CongressionalComponent", () => {
  let component: CongressionalComponent;
  let fixture: ComponentFixture<CongressionalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CongressionalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CongressionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
