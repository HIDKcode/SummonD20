import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-biblioteca-crearhoja',
  templateUrl: './biblioteca-crearhoja.page.html',
  styleUrls: ['./biblioteca-crearhoja.page.scss'],
})
export class BibliotecaCrearhojaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} characters remaining`;
  }
  
}
