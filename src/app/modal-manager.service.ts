import { Injectable } from "@angular/core";

// Have to use bower instance until we figure out how to add .foundation() to jquery.
declare var $: any;

/********************************************************
  NOTE: All HTML and TS code for modals are currently
  being managed in app.component ts/html files.
********************************************************/
@Injectable()
export class ModalManagerService {
  public static readonly ACCESS_WARNING_MODAL: string = "#access_modal";

  constructor() {}

  displayModal(id: string): void {
    /*
      foundation('reveal', 'open') sets overflow: hidden on the body element
        of the document. This prevents you from scrolling, and hides parts of
        the modal if it's too long. To get around this, we will just erase
        the overflow setting on the body, returning it to it's original value.
    */
    $(id).foundation("reveal", "open");
    $("body").css("overflow", "");
  }
}
