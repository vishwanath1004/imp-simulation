import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { UtilsService } from './utils.service';
import { NewComponent } from './new/new.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DetailsComponent } from './details/details.component';

@NgModule({
  declarations: [AppComponent,NewComponent,DetailsComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,SharedModule,BrowserAnimationsModule,DragDropModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },UtilsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
