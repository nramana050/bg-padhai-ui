import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  selectedIndex = -1;
  @Input() filterArray: any[];

  @Output() filterEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  filter(id) {
    this.filterEmitter.emit({id: id});
    this.selectedIndex = id;
  }
  clearAllFilter() {
    this.filterEmitter.emit({id: ''});
    this.selectedIndex = null;
  }
}
