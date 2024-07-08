import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/utils.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  profileName ='';
  askName : boolean = false;
  showSpeechBubble: boolean = false;
  speechText: string = "";
  text :any=[];
  count =0;
  selected :boolean = false;
  isNameValid = false;
  constructor(
    private utils : UtilsService,
    private router : Router
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    if(this.utils.profileName){
      this.profileName = this.utils.profileName;
      this.askName = false;
      this.showSpeechBubble = false;
      this.count =1;
      this.speechText =  this.text[this.count];
    }else {
  this.text =["Hi, Please enter your good name."];
      this.showSpeechBubble = true;
      this.askName = true;
      this.speechText =  this.text[this.count];
    }
  }

  updateName(){
    this.showSpeechBubble = false;
    this.utils.setName(this.profileName);
    this.text.push(`Thank you, Hello ${this.profileName}! Welcome to micro-improvement simulation.`,
    "Do you want to know  about micro-improvement approach? please click on Yes, or else click on No to continue to the project simulation",)
    setTimeout(() =>{
    this.askName  = false;
      this.count ++;
      console.log( this.count,"this.count");
      this.speechText =  this.text[this.count]
      this.showSpeechBubble = true;
    },100)
  }


  talkOver(){
    this.showSpeechBubble = false;
    if( this.count +1 < this.text?.length && !this.askName ){
    this.count++;
      this.speechText  = this.text[this.count];
      setTimeout(() =>{
        this.showSpeechBubble = true;
      },100)
    }else{
      if(this. selected){
        setTimeout(() =>{
          this.router.navigate(['/folder']);
        },100)
        return
      }
      if(this.text?.length >3){
        this.speechText  = "Well, its time to look into the main course";
        setTimeout(() =>{
          this.showSpeechBubble = true;
        },100)
        setTimeout(() =>{
          this.router.navigate(['/folder']);
        },200)
      }
    }
  }

  onNameInput(event: any) {
    this.isNameValid = this.profileName.length >= 3;
  }
  onSelect(type :any){
    this.showSpeechBubble = false;
    this.speechText ="";
    if(type === "yes"){
      this.selected = true;
      this.count++;
      this.text.push(`The objective of micro-improvement approach is to make systemic change in the education system through a series of easy, 
      simple, +1 and doable initiatives.
       It empowers stakeholders to undertake incremental micro-steps within their daily operational contexts, where they learn by doing.`,
       `It helps them in streamlining the activities leading to positive change in the school education system.`, 
       `The micro-improvement approach is implemented through the project capability. 
       It includes smaller action steps towards a larger goal. It is short term in nature.`,
       `A project consists of the following-`," 1 Tangible and achievable objective"," 2 Guided steps to achieve the desired objective",
       "3 Learning resources to aid in the implementation of the certain guided steps",
       "4 Functionality to attach evidences (photos, videos, documents, links)",
       "5 Feature to add more steps taken by user to achieve the objective");
      this.speechText  = this.text[this.count];
      setTimeout(() =>{
        this.showSpeechBubble = true;
      },100)
    }else{
      this.router.navigate(['/folder']);
    }
  }
}
