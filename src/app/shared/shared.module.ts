import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CelebrationComponent } from './celebration/celebration.component';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AvatarComponent } from './avatar/avatar.component';
import { TypingAnimationDirective } from './typing-animation.directive';
import { PyramidComponent } from './pyramid/pyramid.component';

AvatarComponent

@NgModule({
  declarations: [CelebrationComponent,AvatarComponent,TypingAnimationDirective,PyramidComponent],
  exports:[CelebrationComponent,AvatarComponent,PyramidComponent],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class SharedModule { }
