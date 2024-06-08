import { Component, OnInit, Input } from '@angular/core';
import { IDocViewerConfig } from './doc-viewer.config';

@Component({
  selector: 'app-doc-viewer',
  templateUrl: './doc-viewer.component.html',
  styleUrls: ['./doc-viewer.component.scss']
})
export class DocViewerComponent implements OnInit {

  @Input() src: string;
  @Input() height: string;
  @Input() config: IDocViewerConfig;
  
  constructor() { }

  ngOnInit() { }

}
