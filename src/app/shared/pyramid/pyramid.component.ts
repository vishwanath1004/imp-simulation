import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pyramid',
  templateUrl: './pyramid.component.html',
  styleUrls: ['./pyramid.component.scss'],
})
export class PyramidComponent {
  pyramid: number[] = [];
  objectCount: number = 0;

  addObject() {
    this.pyramid.push(this.pyramid.length + 1);
  }
}
