import { OnInit, Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Utility } from '../../utils/utility';

@Component({
    selector: 'app-list-label',
    template: `
      <span tabindex="0" class="pull-left" title="{{listObjLabel}}">{{listObjLabel}}</span>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListLabelComponent implements OnInit {

    @Input('list') list: any[] = [];
    @Input('value') value;
    @Input('type') type;
    listObjLabel: String = '';
    ngOnInit() {
      
        if (this.type === 'multiple') {
            if (Array.isArray(this.value)) {
              this.listObjLabel = this.value
              .filter((item) => ![518, 541, 547].includes(item))
                .map((item) => {
                  const obj = Utility.getObjectFromArrayByKeyAndValue(this.list, 'id', item);
                  return obj !== null ? obj['description'] : '';
                })
                .join('\n'); 
            } else {
              this.listObjLabel = '';
            }
          }else if(this.type === 'readDescription'){
            const obj = Utility.getObjectFromArrayByKeyAndValue(this.list, 'id', this.value);   
            if(obj !== null) {
              this.listObjLabel = obj['description'] ;             
             }
          } 
          else if(this.type === 'readValue' ){
            const obj = Utility.getObjectFromArrayByKeyAndValue(this.list, 'id', this.value);   
            if(obj !== null) {
              this.listObjLabel = obj['value'] ? obj['value'] :obj['orgName'] ;             
             }
          } else { 
            const obj = Utility.getObjectFromArrayByKeyAndValue(this.list, 'id', this.value);   
            if(obj !== null) {
                this.listObjLabel = this.type == 'mentivity' ? obj['description'] : obj['value'];
            }
            else{
              this.listObjLabel =  obj['description'];
            }
          }     
    }

}
