import { Component, OnInit,Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent  implements OnInit {
@Input() data : any;
  constructor(
    private modal : ModalController
  ) { }

  ngOnInit() {
    console.log(this.data,"data");
  }

  dismiss(){
    this.modal.dismiss();
  }
}
