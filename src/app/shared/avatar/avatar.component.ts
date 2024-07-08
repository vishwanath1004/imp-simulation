import { Component, OnInit,Input, EventEmitter, Output } from '@angular/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent  implements OnInit {
@Input() speechText :any;
@Output() completed = new EventEmitter();
showSpeechBubble = false;
speechDuration =0;
  constructor() { }

  ionViewWillEnter() {
    this.speak();
  }
  ngOnInit(){
    this.speak();
  }

  speak() {
    this.showSpeechBubble = true;
      if (this.speechText.trim().length === 0) {
        this.showSpeechBubble = false;
        return;
      }
      const words = this.speechText.split(' ').length;
      const avgWordsPerMinute = 200;
       this.speechDuration = (words / avgWordsPerMinute) * 60 * 1000;
  
      TextToSpeech.speak({
        text: this.speechText,
        lang: 'en-US',
        rate: 0.5,
        pitch: 1.0,
        volume: 1000.0
      }).then(() => {
        setTimeout(() =>{
          this.showSpeechBubble = false;
          console.log("erere event emit");
        this.completed.emit();
        },100)
      }).catch(error => {
        this.showSpeechBubble = false;
      });
  }
}
