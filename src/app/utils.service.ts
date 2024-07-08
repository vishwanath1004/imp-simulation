import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
completedEvent = new Subject();
profileName:string ='';
  constructor() { }


  projectCompleted(project:any){
this.completedEvent.next(project);
  }

  setName(name:string) {
    this.profileName = name;
  }
}
