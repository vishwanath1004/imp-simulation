import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent  implements OnInit {
  item: any;
  constructor(private modalController: ModalController,private navParams: NavParams) {}

  dismiss() {
    this.modalController.dismiss();
  }

  ngOnInit() {
    this.item = this.navParams.get('item');
    this.item.status = this.item.status == "notstarted" ?"inprogress" : this.item.status;
  }
  complete(){
    this.item.status = "completed";
    // this.modalController.dismiss();
  }

}
