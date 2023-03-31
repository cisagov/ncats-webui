import { ExamPage } from "./app.po";

describe("exam App", function () {
  let page: ExamPage;

  beforeEach(() => {
    page = new ExamPage();
  });

  it("should display message saying app works", () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual("app works!");
  });
});
