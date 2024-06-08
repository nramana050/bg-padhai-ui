import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appChangeColor]'
})
export class ChangeColorDirective implements OnInit{

  @Input('appChangeColor') course: any;
  constructor(
    private el: ElementRef, private renderer: Renderer2
  ) { }
 element : any;
  ngOnInit() {
     if(this.course.outlineStatus == 'Failed' || this.course.lessonStatus =='Failed' || this.course.outcomeStatus == 'Failed'
     || this.course.assetStatus=='Failed' || this.course.publishStatus =='Failed'){
      this.renderer.setStyle(this.el.nativeElement, 'background-color', '#F08030');
     }

  }
  
}
