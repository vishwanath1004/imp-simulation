import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { categories } from '../mock.data';
import { UtilsService } from '../utils.service';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { Location } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { DetailsComponent } from '../details/details.component';


@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
})
export class NewComponent  implements OnInit {
  texts=["Here you can see the improvement projects of the selected domain.",
  "Well!, on the left side of the screen, you'll see a list of improvement projects. These projects are not in any specific order",
  "On the right side of the screen, there are empty blocks. These are the places where you need to drop the projects", 
  "You have to drag a project from the left side and drop it into the correct block on the right side", 
  "By doing like this you can re-arrange the improvment project order, to complete this level."]
  @ViewChildren('timelineItem') private timelineItemElements!: QueryList<ElementRef>;
  
  colors =['#D32F2F','#3D5AFE','#37474F','#00BCD4','#FDD835','#FF6F00','#FF3D00','#D32F2F','#3D5AFE','#37474F','#0D47A1','#1E88E5','#00B8D4','#AEEA00','#D500F9','#009688','#388E3C','#0288D1'];
  widthList :any= []
  result :any =[{id:1},{id:11},{id:112},{id:113}]
  showSpeechBubble = false;
  showHintOption= false;
  speechStop= false;
  speechText ="";
  categories = categories;
  timelineItems: any = [];
  subCategoryIndex =0;
  categoryId =0;
  attempts =0;
  completed =0;
  count =0;
  showDropAnimation : boolean = false;
  visited : boolean = false;
  draggingItem : any;
  constructor(
    private router: Router,
    private utils: UtilsService,
    private routerParam: ActivatedRoute,
    private location : Location,
    private modal : ModalController
  ) {
    let category : any =[];
    this.routerParam.params.subscribe((param: any) => {
      this.categoryId = parseInt(param.id);
      this.initializeCategory();
    });
    this.routerParam.queryParams.subscribe((params : any) =>{
      this.subCategoryIndex = params.subDomain;
    })
    utils.completedEvent.subscribe((data: any) => {
      this.categories.forEach(projects => {
        if (projects?.improvements?.projects) {
          let project: any = projects.improvements.projects.find((project: any) => project.id == data.id);
          if (project) {
            project.status = "completed";
          }
        }
      });
    });
  }

  ngOnInit() {
  }

  initializeCategory() {
  this.visited = localStorage.getItem('page3') ?  true : false;
    const category = this.categories[this.categoryId];
    console.log("initializeCategory")
    if (category?.subDomain?.length) {
      // this.timelineItems = category.subDomain[this.subCategoryIndex]?.improvements?.projects ?? [];
    } else {
      this.timelineItems = [...category?.improvements?.projects] ?? [];
      console.log(this.timelineItems,"this.timelineItems ");
      this.result = category?.improvements?.result?.slice().reverse() ?? [];
      if(!this.visited){
        this.completed =0;
        this.count =0;
        setTimeout(() =>{
          this.speechText = this.texts[this.count];
          this.showSpeechBubble = true;
            },100)
      }else{
        this.completed =0;
        this.count = this.texts.length +1;
      }
    this.calculateWidthList();
    }
  }


  showWrong : boolean = false;
  progress: number = 0;
  droppedItems: any =[];
  onDragStart(event: any, item: any) {
    item.isDragging =  true;
  }
  

  onDragOver(event: any, item: any) {
    // event.preventDefault();
    console.log("event",item);
    item.isDragging =  false;
    this.draggingItem = item;
  }
  
  speechOver(){
    if(!this.visited){
    this.showSpeechBubble = false;
    this.count++;
    this.speechText = this.texts[this.count];
    console.log( this.speechText," this.speechText");
    setTimeout(() =>{
    this.showSpeechBubble = true;
    },0)
    if(this.count >= this.texts.length){
      setTimeout(() =>{
        this.showSpeechBubble = false;
        },0)
    }
}
if(this.completed ==  this.result?.length){
  this.speechText = "You are now being redirected to the improvement projects domain list.";
  setTimeout(() =>{
    this.showSpeechBubble = true;
  },10);
  setTimeout(() =>{
  this.location.back();
},3000);
  return;
}
}
ionViewWillEnter() {
  this.visited = localStorage.getItem('page3') ?  true : false;
}

  async drop2(event:any, index: number){
    localStorage.setItem('page3','true');
    this.count = this.texts.length +1;
    setTimeout(() =>{
      this.showSpeechBubble = false;
    },0)
    if(!this.timelineItems?.[event.previousIndex].isCompleted && index == this.completed){
      console.log(this.result?.[(this.result?.length -1) - this.completed]?.id,"this.result?.[(this.result?.length -1) - this.completed]?.id",this.draggingItem.id);
        if(this.result?.[(this.result?.length -1) - this.completed]?.id === this.draggingItem.id){
      if(this.droppedItems?.length){
        const newIndex = this.droppedItems.length;
        this.droppedItems[newIndex] = this.draggingItem;
        setTimeout(() => {
          if (this.droppedItems[newIndex]) {
            this.droppedItems[newIndex].showDropAnimation = true;
            setTimeout(() => {
              this.droppedItems[newIndex].showDropAnimation = false;
            }, 2000);
          }
        }, 100);
        }else{
          this.droppedItems[0] = this.draggingItem;
          this.droppedItems[0].showDropAnimation =  true;
          setTimeout(() =>{
            this.droppedItems[0].showDropAnimation = false
          },2000)
        } 

     const itemIndex = this.timelineItems.findIndex((item:any) => item === this.draggingItem);
    if (itemIndex > -1) {
      this.timelineItems.splice(itemIndex, 1);
    }

    this.draggingItem = null;
       
      this.completed++;
      if(this.completed ==  this.result?.length){
        this.speechText = "Congratulation! you sorted the given improvement projects in correct order.";
        setTimeout(() =>{
          this.showSpeechBubble = true
        },0)
        this.categories[this.categoryId].isCompleted = true;
        return;
      }
      this.speechText = "Great! you placed in correct order. Keep moving on";
      setTimeout(() =>{
        this.showSpeechBubble = true
      },0)
      }else{
        let audio = new Audio('../../assets/wrong.mp3')
        audio.load();
       await audio.play();
        this.speechText = "Ohhh! this is the not correct position for this improvement project";
        setTimeout(() =>{
          this.showSpeechBubble = true
        },300)
      }
    }
  }

   calculateWidthList() {
   let count = this.timelineItems.length + this.droppedItems.length;
    for (let i = 0; i < count; i++) {
        let width = (100 - i * (100 / count)) + "%";
        let margin = "0 " + (i * (50 / count)) + "%";
        this.widthList.push({ width: width, margin: margin });
    }
}

getReverseIndices(length: number): number[] {
  return Array.from({ length }, (_, i) => length - 1 - i);
}

getStyles(index: number): { [key: string]: string } {
  const styles: { [key: string]: string } = {
    'color': '#fff'
  };

  if (index !== this.completed) {
    styles['background'] = '#ccc';
  } else {
    styles['background'] = this.colors[index];
    styles['color'] = '#fff';
  }

  if (this.droppedItems[index]?.title) {
    styles['background'] = this.colors[index];
  }

  return styles;
}

goBack(){
  this.location.back();
}


stopSpeech(){
  this.showSpeechBubble = false;
  this.count =  this.texts.length+1;
  localStorage.setItem('page3', "true");

}

resumeSpeech(){
  if(!this.speechText){
    this.count = 0;
    this.speechText = this.texts[this.count];
  }
  setTimeout(() =>{
    this.showSpeechBubble = true;
  },100)
}

async openDetail(data: any){
  const modal = this.modal.create({
    component: DetailsComponent,
      componentProps:{
        data:data
      }
  });
  (await modal).present();
}
}
