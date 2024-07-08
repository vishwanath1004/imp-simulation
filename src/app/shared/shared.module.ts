import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CelebrationComponent } from './celebration/celebration.component';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AvatarComponent } from './avatar/avatar.component';
import { TypingAnimationDirective } from './typing-animation.directive';

AvatarComponent

@NgModule({
  declarations: [CelebrationComponent,AvatarComponent,TypingAnimationDirective],
  exports:[CelebrationComponent,AvatarComponent],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class SharedModule { }
