import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appTypingAnimation]'
})
export class TypingAnimationDirective implements OnChanges {
  @Input() text: string = '';
  @Input() duration: number = 0; // Duration in milliseconds

  constructor(private el: ElementRef) { }

  ngOnChanges(changes: any) {
    if (changes.text && changes.text.length || changes.duration) {
      this.typeText(this.text, this.duration);
    }
  }

  private typeText(text: string, duration: number) {
    this.el.nativeElement.innerHTML = '';
    const totalLength =text.length;
    const interval = duration / totalLength;
    let index = 0;

    const typingInterval = setInterval(() => {
      if (index < text.length) {
        this.el.nativeElement.innerHTML += text.charAt(index);
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, interval);
  }
}
