import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { categories } from '../mock.data';
import { UtilsService } from '../utils.service';
import { ModalController } from '@ionic/angular';
import { SubDomainComponent } from './sub-domain/sub-domain.component';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);

  showSpeechBubble: boolean = false;

  text =["Hi, Please enter your good name.",'Hello! Welcome to Improvement project simulation.',"If you want to know what is Improvement project please click on, Yes or else click on thank you"];
  speechText: string = "";
  count =0;
  constructor(
    private router : Router,
    private utils : UtilsService,
    private modalController : ModalController
  ) {}

  categories =categories;
  talkOver(){
    if( this.count < this.text?.length){
      this.count++;
      this.speechText  = this.text[this.count];
      console.log(this.count,"count");
    }
  }
  onSelect(type :any){
    if(type === "yes"){
      this.talkOver();
    }else{
      // route
    }
  }
  ngOnInit() {
      this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
      setTimeout(() =>{
        this.speechText =  "These are the improvement project domains, please select one domain and start working on it."
      this.showSpeechBubble = true;
      },300)
   
  }


  navigateToProject(index:any){
    if(this.categories[index]?.subDomain?.length){
      console.log(this.categories[index].subDomain?.length,"this.categories[index]")
      this.showSubDomainModal(index,this.categories[index]?.subDomain);
    }else{
      this.router.navigate(["/projects",index]);
    }
  }


  // async speak() {
  //   this.showSpeechBubble = true;
  //   if (this.speechText.trim().length === 0) {
  //     return;
  //   }
  //   await TextToSpeech.speak({
  //     text: this.speechText,
  //     lang: 'en-US',
  //     rate: 1.0,     
  //     pitch: 1.0,   
  //     volume: 1000.0 
  //   });
  //   this.showSpeechBubble = false;
  // }

  async showSubDomainModal(index:any,data:any){
    console.log("showSubDomainModal showSubDomainModal");
    const modal = await this.modalController.create({
      component: SubDomainComponent,
      componentProps: { data }
    });
    await modal.present();

  const { data: modalData, role } = await modal.onDidDismiss();
  if (modalData) {
    console.log('Modal dismissed with data:', modalData);
    {
      this.router.navigate(["/projects",index],{
        queryParams: { subDomain: modalData}      });
    }
  }
  }
}
