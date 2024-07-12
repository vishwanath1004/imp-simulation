import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { categories } from '../mock.data';
import { UtilsService } from '../utils.service';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { Location } from '@angular/common';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss'],
})
export class ProjectsPage implements OnInit {

  texts=["Here you can see the improvement projects of the selected domain.",
  "Well!, on the left side of the screen, you'll see a list of improvement projects. These projects are not in any specific order",
  "On the right side of the screen, there are empty blocks. These are the places where you need to drop the projects", 
  "You have to drag a project from the left side and drop it into the correct block on the right side", 
  "By doing like this you can re-arrange the improvment project order, to complete this level.",
   "At top here you can see the number of attempts taken for complete the re-arranging, try to re-arrange with less number of attempts.",
   "and here you can see the number of improvement projects placed in the correct order.", 
   "And Hint option will help you, if you stuck somewhere, it will show the correct order for the improvement project.","It's your turn, goahead and play with this and sort the projects in correct order."]
  @ViewChildren('timelineItem') private timelineItemElements!: QueryList<ElementRef>;
  droppedItems: any = [];
result :any=[{id:116},{id:113},{id:112},{id:11},{id:114},{id:115},{id:1}]
dropAnimationState = 'default';
  characterStyle = {
    bottom: '100px',
    right: "0%"
  };
  showSpeechBubble = false;
  showHintOption= false;
  speechText ="";
  categories = categories;
  timelineItems: any = [];
  subCategoryIndex =0;
  categoryId =0;
  attempts =0;
  completed =0;
  count =0;

  constructor(
    private router: Router,
    private utils: UtilsService,
    private routerParam: ActivatedRoute,
    private location : Location
  ) {
    this.routerParam.params.subscribe((param: any) => {
      const categoryId = parseInt(param.id);
    });
    this.routerParam.queryParams.subscribe((params : any) =>{
      this.subCategoryIndex = params.subDomain;
    })
    const category = this.categories[this.categoryId];
    if (category?.subDomain?.length) {
      this.timelineItems = category.subDomain[this.subCategoryIndex]?.improvements?.projects ?? [];
    } else {
      this.timelineItems = category?.improvements?.projects ?? [];
    }
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

  ngOnInit(): void {
    
  }

  ionViewWillEnter() {
    setTimeout(() =>{
    this.speechText = this.texts[this.count];
      this.showSpeechBubble = true;
      console.log("82", this.showSpeechBubble );
      },100)
      console.log("82", this.showSpeechBubble );
      
    this.checkAndHighlightFirstItem();
    this.startCharacterJourney();
  }

  speechOver(){
    this.showSpeechBubble = false;
    this.count++;
    this.speechText = this.texts[this.count];
    setTimeout(() =>{
    this.showSpeechBubble = true;
    },0)
    if(this.count >= this.texts.length){
      setTimeout(() =>{
        this.showSpeechBubble = false;
        },0)
    }
    if(this.completed ==  this.timelineItems?.length){
      this.speechText = "You are now being redirected to the improvement projects domain list.";
      setTimeout(() =>{
        this.showSpeechBubble = true;
      },10);
      setTimeout(() =>{
      this.location.back();
    },60);
      return;
  }
}


  drop1(event: CdkDragDrop<{ title: string }[]>, index: number) {
    this.showSpeechBubble = false;
    this.attempts++;
    if(!this.timelineItems?.[event.previousIndex].isCompleted){
      if(this.result?.[index]?.id === this.timelineItems?.[event.previousIndex]?.id){
        this.timelineItems[event.previousIndex].isCompleted =  true;
        this.droppedItems[index] = this.timelineItems?.[event.previousIndex];
     
        console.log( this.timelineItems[event.previousIndex]," this.timelineItems[index]  this.timelineItems[index]");
        this.speechText = "Great! you placed in correct order. Keep moving on";
        this.completed++;
        this.dropAnimationState = 'dropped';
        setTimeout(() =>{
          this.showSpeechBubble = true
        },0)

        if(this.completed ==  this.timelineItems?.length){
          this.speechText = "Congratulation! you sorted the given improvement projects in correct order.";
          setTimeout(() =>{
            this.showSpeechBubble = true
          },0)
          return;
        }
      }else{
        console.log("wrong selection");
        this.speechText = "Oh! you trying to place in wrong order, Please try again";
        this.dropAnimationState = 'default';
        setTimeout(() =>{
          this.showSpeechBubble = true
        },0)
      }
    }else{
      this.speechText = "Oh! this is already sorted, Please try other";
      this.dropAnimationState = 'default';
      setTimeout(() =>{
        this.showSpeechBubble = true
      },0)
    }
  }
  startCharacterJourney(): void {
    const steps = this.timelineItems.length;
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps) {
        this.characterStyle.bottom = `${currentStep * 98}px`;
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }

  openActivity(item: any) {
    this.router.navigate(["/activities", item.id],{queryParams:{subDomain:this.subCategoryIndex}});
  }

  getItemColor(status: string): string {
    switch (status) {
      case 'notstarted':
        return '#ccc';
      case 'inprogress':
        return 'orange';
      case 'completed':
        return 'green';
      default:
        return 'white';
    }
  }

  toggleItem(item: any) {
    item.animate = !item.show; // Apply animation only when item is about to show
    item.show = !item.show;
  }

  getStatusClass(item: any) {
    return `status-${item?.status}`;
  }

  checkAndHighlightFirstItem() {
    const allNotStarted = this.timelineItems.every((item: any) => item.status === 'notstarted');
    if (allNotStarted && this.timelineItems.length > 0) {
      this.timelineItems[0].highlight = true;
      setTimeout(() => this.scrollToHighlightedElement(), 0);
    } else {
      this.timelineItems.forEach((element: any) => {
        element.highlight = false;
      });
      let highlight = this.timelineItems.find((item: any) => item.status === 'inprogress' || item.status === 'notstarted');
      if (highlight) {
        highlight.highlight = true;
        setTimeout(() => this.scrollToHighlightedElement(), 0);
      }
    }
  }

  private scrollToHighlightedElement(): void {
    const highlightedElement = this.timelineItemElements.find(el => el.nativeElement.classList.contains('highlight'));
    if (highlightedElement) {
      highlightedElement.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  showHint() {
    for (let element of this.timelineItems) {
      console.log(element.isCompleted,"isCompleted");
      if (!element.isCompleted) {
        let response = this.result.find((res: any) => res.id === element.id);
        console.log(response, "response");
        if (response) {
          element.hint = true;
          response.hint = true;
          this.showHintOption = true;
          setTimeout(() => {
            element.hint = false;
            response.hint = false;
            this.showHintOption = false;
          }, 3000); 
          break;
        }
      }
    }
  }
  
}