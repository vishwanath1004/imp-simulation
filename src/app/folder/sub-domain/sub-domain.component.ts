import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-sub-domain',
  templateUrl: './sub-domain.component.html',
  styleUrls: ['./sub-domain.component.scss'],
})
export class SubDomainComponent  {
  @Input() data: any =[];
  speechText ="Please select one sub-domain to see the improvement projects";
  showSpeechBubble = false;
    constructor(
    private modal : ModalController
    ) { }

  dismiss(){
    this.modal.dismiss();
  }
  ionViewWillEnter(){
    setTimeout(() =>{
      this.showSpeechBubble = true;
    },100)
  }

  onSelect(id:any){
    console.log(id,"id");
    this.modal.dismiss(id);
  }
 
}
