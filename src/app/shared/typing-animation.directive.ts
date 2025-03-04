import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appTypingAnimation]'
})
export class TypingAnimationDirective implements OnChanges {
  @Input() text: string = '';
  @Input() duration: number = 0; // Duration in milliseconds

  constructor(private el: ElementRef) { }

  ngOnChanges(changes: any) {
    console.log(changes,"changes")
    if (changes.text || changes.duration) {
      this.typeText(this.text, this.duration);
    }
  }

  private typeText(text: string, duration: number) {
    this.el.nativeElement.innerHTML = ''; // Clear the element
    const totalLength = text.length;
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
