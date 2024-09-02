import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-salacreate',
  templateUrl: './salacreate.page.html',
  styleUrls: ['./salacreate.page.scss'],
})
export class SalacreatePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  customCounterFormatter2(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} characters remaining`;
  }
}
