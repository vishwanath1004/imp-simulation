import { Component, OnInit,Input, EventEmitter, Output } from '@angular/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent  implements OnInit {
@Input() speechText :any;
@Output() completed = new EventEmitter();
@Output() resumeSpeech = new EventEmitter();
@Output() stopSpeech = new EventEmitter();
action = 'Hide';
isAvatarVisible = true;
resumed = false;

showSpeechBubble = false;
speechDuration =0;
  constructor(private cdr: ChangeDetectorRef) { }

  ionViewWillEnter() {

    this.speak();
  }
  ngOnInit(){
    this.speak();
  }

  speak() {
    console.log(this.action,"this.action");
    if(this.speechText && this.action == 'Hide'){
      this.showSpeechBubble = true;
      if (this.speechText && this.speechText.trim().length === 0) {
        this.showSpeechBubble = false;
        return;
      }
      console.log("33",this.speechText );
      const words = this.speechText.split(' ').length;
      const avgWordsPerMinute = 200;
       this.speechDuration = (words / avgWordsPerMinute) * 60 * 1000;
      TextToSpeech.speak({
        text: this.speechText,
        voice:118,
        lang: 'en-US',
        rate: 1,
        pitch: 1.0,
        volume: 100.0
      }).then(() => {
        setTimeout(() =>{
          this.showSpeechBubble = false;
        this.completed.emit();
        },100)
      }).catch(error => {
        this.showSpeechBubble = false;
      });
    }
    
  }

  resume(){
    this.resumed = false;
    this.speak();
    this.resumeSpeech.emit();
  }
  stop(){
    TextToSpeech.stop();
    this.resumed = true;
    setTimeout(() =>{
      this.speechText=" ";
    },100)
    this.cdr.detectChanges();
    this.stopSpeech.emit();
  }

  onAction(){
    this.isAvatarVisible = !this.isAvatarVisible;
    this.action = this.action == 'Hide' ? 'Help' : 'Hide';
    console.log(this.action,"this.action");

  }
}
