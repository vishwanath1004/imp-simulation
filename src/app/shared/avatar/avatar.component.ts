import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {
  @Input() speechText: any = '';
  @Output() completed = new EventEmitter<void>();
  @Output() resumeSpeech = new EventEmitter<void>();
  @Output() stopSpeech = new EventEmitter<void>();

  action: string = 'Hide';
  isAvatarVisible: boolean = true;
  resumed: boolean = false;
  showSpeechBubble: boolean = false;
  speechDuration: number = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.initializeAvatar();
  }

  private initializeAvatar() {
    this.action = localStorage.getItem('isAvatarVisible') === 'Help' ? 'Help' : 'Hide';
    this.isAvatarVisible = this.action === 'Hide';
    if (this.speechText && this.isAvatarVisible) {
      this.startSpeaking();
    }
  }

  private startSpeaking() {
    if (this.speechText.trim().length === 0) {
      this.showSpeechBubble = false;
      return;
    }

    const words = this.speechText.split(' ').length;
    const avgWordsPerMinute = 200;
    this.speechDuration = (words / avgWordsPerMinute) * 60 * 1000;

    this.showSpeechBubble = true;
    TextToSpeech.speak({
      text: this.speechText,
      voice: 118,
      lang: 'en-US',
      rate: 1,
      pitch: 1.0,
      volume: 100.0,
    })
      .then(() => {
        setTimeout(() => {
          this.showSpeechBubble = false;
          this.completed.emit();
        }, 100);
      })
      .catch((error) => {
        this.showSpeechBubble = false;
        console.error('Text-to-Speech error:', error);
      });
  }

  resume() {
    this.resumed = false;
    this.startSpeaking();
    this.resumeSpeech.emit();
  }

  stop() {
    TextToSpeech.stop();
    this.resumed = true;
    setTimeout(() => {
      this.speechText = '';
      this.cdr.detectChanges();
    }, 100);
    this.stopSpeech.emit();
  }

  onAction() {
    this.isAvatarVisible = !this.isAvatarVisible;
    this.action = this.isAvatarVisible ? 'Hide' : 'Help';
    localStorage.setItem('isAvatarVisible', this.action);

    if (!this.isAvatarVisible) {
      this.stop();
    }
  }
}
