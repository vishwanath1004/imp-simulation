import { Component, OnInit , Input, Output} from '@angular/core';

@Component({
  selector: 'app-celebration',
  templateUrl: './celebration.component.html',
  styleUrls: ['./celebration.component.scss'],
})
export class CelebrationComponent  implements OnInit {
  @Input() title : String ="Congratulations";
  @Input() message : String ="You have completed the Improvement project";

  speechtext ="Congratulations, You have completed the Improvement project"
  constructor() { }

  ngOnInit() {
    setTimeout(() =>{
      this.speechtext ="Tap on the below button to continue"
    },6000)

  }


}
