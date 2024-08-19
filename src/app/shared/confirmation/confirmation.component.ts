import { Component, OnInit,Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent  implements OnInit {
  @Input() title : any;
  constructor(
    private modal : ModalController
  ) { }

  ngOnInit() {}
  action(action : boolean){
    this.modal.dismiss(action);
  }

  dismiss(){
    this.modal.dismiss();
  }
}
