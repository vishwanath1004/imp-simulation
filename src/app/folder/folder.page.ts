import { Component, inject, OnInit ,Renderer2} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { categories } from '../mock.data';
import { UtilsService } from '../utils.service';
import { ModalController } from '@ionic/angular';
import { SubDomainComponent } from './sub-domain/sub-domain.component';
import { Location } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
  animations: [
    trigger('fadeAnimation', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition('void <=> *', animate(500)),
    ])
  ]
})
export class FolderPage implements OnInit {
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);
  images = Array(5).fill({ src: './assets/images/progress.gif' });
  showSpeechBubble: boolean = false;
  showProgress: boolean = false;
  totalSteps =1;
  schoolImage ="./assets/images/school/1.png";
  text = [
    "On the left side of the screen, you can see the list of improvement project domains.",
    "And on the right side, we have a school with poor infrastructure.",
    "By sorting each domain's improvement projects, you can help us build the school.",
    "Well now select the category to sort the improvement projects."
  ];
  speechText: string = "";
  count =0;
  cssClass ='fade-in';
  categoriesCompleted = 0;
  imagesPerCategory =0;
  visited :  boolean = false;
  zoomOut:  boolean = false;
  constructor(
    private router : Router,
    private utils : UtilsService,
    private modalController : ModalController,
    private location: Location,
    private renderer: Renderer2
  ) {}

  categories =categories;
  talkOver(){
    this.showSpeechBubble = false;
    this.count++;
    this.speechText = this.text[this.count];
    setTimeout(() =>{
    this.showSpeechBubble = true;
    },0)
    if(this.count >= this.text.length){
      setTimeout(() =>{
        this.showSpeechBubble = false;
        localStorage.setItem('page2',"true") 
        },0)
    }
  }
  onSelect(type :any){
    if(type === "yes"){
      this.talkOver();
    }else{
      // route
    }
  }
  ngOnInit() {
    this.visited = localStorage.getItem('page2') ?  true : false;
      this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
      if(!this.visited){
        this.count = 0;
        setTimeout(() =>{
          this.speechText =  this.text[this.count];
        this.showSpeechBubble = true;
        },300)
      }
  }

  ionViewWillEnter(){
    this.visited = localStorage.getItem('page2') ?  true : false;
    this.imagesPerCategory = Math.ceil(8 / this.categories.length);
    const completed = this.categories.filter(category => category.isCompleted);
      if(completed?.length){
        this.speechText ="Thanks for helping us to improve our school by sorting the improvement projects."
        this.text=[];
        setTimeout(() =>{
          this.showSpeechBubble = true;
        },2000)
        setTimeout(() =>{
          this.changeSchool(completed);
        },2000)
      }else{
        this.schoolImage ="./assets/images/school/1.png"
      }
  }

  navigateToProject(index:any){
    this.showSpeechBubble = false;
    if(this.categories[index]?.subDomain?.length){
      this.showSubDomainModal(index,this.categories[index]?.subDomain);
    }else{
  localStorage.setItem('page2',"true");
      this.router.navigate(["/new",index]);
    }
  }

  async showSubDomainModal(index:any,data:any){
    const modal = await this.modalController.create({
      component: SubDomainComponent,
      componentProps: { data }
    });
    await modal.present();

  const { data: modalData, role } = await modal.onDidDismiss();
  if (modalData) {
    {
      this.router.navigate(["/new",index],{
        queryParams: { subDomain: modalData}      });
    }
  }
  }


  changeSchool(completed: any) {
    this.categoriesCompleted++;
    this.showProgress = true;
    for (let i = this.totalSteps; i <= this.imagesPerCategory * this.categoriesCompleted; i++) {
      this.totalSteps++;
      setTimeout(() => {
        const currentImage = `./assets/images/school/${i}.png`;
        const nextImage = `./assets/images/school/${i + 1}.png`;

        this.applyKeyframeAnimation(currentImage, nextImage, i);
        this.schoolImage = currentImage;
      }, 800 * i);
    }
    if (this.totalSteps >= this.imagesPerCategory * this.categoriesCompleted) {
      setTimeout(() => {
        this.zoomOut = true;
      }, 1000);
      setTimeout(() => {
        this.showProgress = false;
        this.zoomOut = false;
      }, 1000 * this.totalSteps);
    }
  }

  applyKeyframeAnimation(currentImage: string, nextImage: string, index: number) {
    const keyframes = `
      @keyframes imageAnimation${index} {
        0% {
          background-image: url('${currentImage}');
        }
        100% {
          background-image: url('${nextImage}');
        }
      }
    `;

    const styleSheet = this.renderer.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerHTML = keyframes;

    this.renderer.appendChild(document.head, styleSheet);

    const animationClass = `image-animation-${index}`;
    const animationStyle = `
      .${animationClass} {
        animation: imageAnimation${index} 800ms ease-in-out;
      }
    `;
    styleSheet.innerHTML += animationStyle;

    this.renderer.addClass(document.querySelector('.styled-image'), animationClass);
  }

  goBack(){
    this.location.back();
  }
  stopSpeech(){
    this.showSpeechBubble = false;
   this.count = this.text.length+1;
   localStorage.setItem('page2', "true");
  }

  resumeSpeech(){
    setTimeout(() =>{
      this.showSpeechBubble = true;
      if(!this.speechText){
        this.speechText = this.text[this.count];
      }
    },100)
  }
}
