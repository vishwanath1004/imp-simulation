import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { categories } from '../mock.data';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss'],
})
export class ProjectsPage implements OnInit {

  @ViewChildren('timelineItem') private timelineItemElements!: QueryList<ElementRef>;

  characterStyle = {
    bottom: '100px',
    right: "0%"
  };
  showSpeechBubble = false;
  speechText = "Here you can see the road map of Selected domain, click on the improvement project to see the activities";
  categories = categories;
  timelineItems: any[] = [];
  subCategoryIndex =0;
  categoryId =0;
  constructor(
    private router: Router,
    private utils: UtilsService,
    private routerParam: ActivatedRoute
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
    console.log("speak() 57");
  }

  ionViewWillEnter() {
    this.checkAndHighlightFirstItem();
    this.startCharacterJourney();
    this.showSpeechBubble = true;

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
}