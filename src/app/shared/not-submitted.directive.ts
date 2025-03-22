import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appNotSubmitted]'
})
export class NotSubmittedDirective {

  constructor(el: ElementRef) {
    el.nativeElement.style.backgroundColor= 'red';
    el.nativeElement.style.border='1px solid blue';
    el.nativeElement.style.bcolor='yellow';

    
   }

}
