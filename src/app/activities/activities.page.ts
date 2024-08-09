import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivityComponent } from './activity/activity.component';
import { ActivatedRoute } from '@angular/router';
import { categories } from '../mock.data';
import { Subscriber } from 'rxjs';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.page.html',
  styleUrls: ['./activities.page.scss'],
})
export class ActivitiesPage implements OnInit {
  
  categories :any = categories;
  showCongrats : boolean = false;
  activities : any =[];
  selectedImp:any;
  speechText:any;
  subCategoryIndex='';
  constructor(private modalController: ModalController,
    private routerParams : ActivatedRoute,
    private utilService : UtilsService) {
      routerParams.params.subscribe((param:any) =>{
        this.routerParams.queryParams.subscribe((params : any) =>{
          this.subCategoryIndex = params.subDomain;
        })
          this.categories.forEach((projects :any) =>{
            if(this.subCategoryIndex && projects.subDomain?.length){
            let subDomain =  projects?.subDomain.find((subDomain:any) => subDomain.id == this.subCategoryIndex)
              let activity : any =  subDomain?.improvements?.projects.find((project:any) =>project.id == param.id);
              if(activity){
               this.selectedImp = activity;
                       this.activities = activity.activites;
                       this.selectedImp.status = this.selectedImp.status == "notstarted" ?  'inprogress' : this.selectedImp.status;
                       this.udateHighLight();
              }
            }else{
              if(projects?.improvements?.projects){
             let activity : any =  projects?.improvements.projects.find((project:any) =>project.id == param.id);
             if(activity){
              this.selectedImp = activity;
                      this.activities = activity.activites;
                      this.selectedImp.status = this.selectedImp.status == "notstarted" ?  'inprogress' : this.selectedImp.status;
                      this.udateHighLight();
             }
              }
            }
          })
      })
      this.speechText = "This is are the Activities, Please click on each activity to start, and completing these activities will help you to complete selected Improvement project"
    }

  async presentModal(item:any) {
    if(!item?.highlight || item?.status === "completed"){ return};
    const modal = await this.modalController.create({
      component: ActivityComponent,
      componentProps: {
        item: item
      }
    });
    modal.onDidDismiss().then((data) => {
    let completedActivities =  this.activities.filter((activity : any) => activity.status === "completed");
    if(completedActivities.length === this.activities.length){
      this.showCongrats = true;
      this.selectedImp.status = "completed";
      this.utilService.projectCompleted( this.selectedImp);
      this.speechText = `Congratulations!!!, you have completed all the activities and you completed Improvement project`
    }
    this.udateHighLight();
    });
    return await modal.present();
  }
  ngOnInit() {
  }

  ionViewWillEnter(){
}

udateHighLight(){
  let notStartedActivities =  this.activities.filter((activity : any) => activity.status === "notstarted");
  if(notStartedActivities.length === this.activities.length){
    this.activities[0].highlight =  true;
}else{
  this.activities.find((item: any) => {
    if (item.status === "inprogress" || item.status === "notstarted") {
      item.highlight = true;
      return true;
    }else{
      item.highlight = false;
    }
    return false;
  });
}
}
}
