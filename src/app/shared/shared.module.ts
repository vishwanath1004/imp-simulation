import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CelebrationComponent } from './celebration/celebration.component';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AvatarComponent } from './avatar/avatar.component';
import { TypingAnimationDirective } from './typing-animation.directive';
import { PyramidComponent } from './pyramid/pyramid.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';

AvatarComponent

@NgModule({
  declarations: [CelebrationComponent,AvatarComponent,TypingAnimationDirective,PyramidComponent,ConfirmationComponent],
  exports:[CelebrationComponent,AvatarComponent,PyramidComponent,ConfirmationComponent],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class SharedModule { }
