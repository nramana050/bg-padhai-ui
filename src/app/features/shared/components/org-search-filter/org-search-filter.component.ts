import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { Utility } from 'src/app/framework/utils/utility';
import { IEstablishment, ILotname } from './org-search-filter.interface';

@Component({
  selector: 'org-search-filter',
  templateUrl: './org-search-filter.component.html',
  styleUrls: ['./org-search-filter.component.scss']
})
export class OrgSearchFilterComponent implements OnInit, OnChanges {

  @Input() organizations: IEstablishment[] = [];
  @Input() selectedOrganizations: IEstablishment[] = [];
  @Input() lotNames: ILotname[] = [];
  @Input() multiple: boolean;
  @Input() collapsible: boolean;
  @Input() header: string='Team(s)*';
  @Input() showfilter: boolean=true;


  @Output() update: EventEmitter<any> = new EventEmitter();

  orgNameFilter = new FormControl();
  lotNameFilter = new FormControl();
  selectAll: boolean;
  profileUrl;

  filteredOrganizations: IEstablishment[] = [];

  constructor() { 
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    
  }

  ngOnInit() {
    this.orgNameFilter.valueChanges
      .pipe(
        debounceTime(450),
      )
      .subscribe(value => {
        this.onFilter();
      });

    this.lotNameFilter.valueChanges
      .pipe(
        debounceTime(450),
      )
      .subscribe(value => {
        this.onFilter();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initAllLists();
  }

  initAllLists() {
    this.selectedOrganizations.forEach((org: IEstablishment) => {
      this.organizations.filter(filtered => filtered.id === org.id).forEach(org => {
        org.checked = true;
      });
    });
    this.filteredOrganizations.push(...this.organizations);
    this.selectAll = this.selectedOrganizations.length > 0 && this.selectedOrganizations.length === this.organizations.length ? true : false;
  }

  onFilter(): any {
    const orgNameFilter = this.orgNameFilter.value;
    const lotNameFilter = this.lotNameFilter.value;

    let tempFiltered = [];
    this.filteredOrganizations = [];

    if (!orgNameFilter && (!lotNameFilter || lotNameFilter.length === 0)) {
      this.filteredOrganizations.push(...this.organizations);
      this.updateSelectAllState();
      return;
    }

    tempFiltered = this.organizations.filter(option => {
      let orgNameCheck = false;
      let lotNameCheck = false;
      orgNameCheck = orgNameFilter ? option.organizationName.toLowerCase().includes(orgNameFilter.toLowerCase()) : true;
      if (lotNameFilter && lotNameFilter.length !== 0) {
        lotNameCheck = this.checkLotnameInOrg(lotNameFilter, option);
      } else {
        lotNameCheck = true;
      }
      return orgNameCheck && lotNameCheck;
    });

    if (tempFiltered.length > 0) {
      this.filteredOrganizations.push(...tempFiltered);
    }
    this.updateSelectAllState();
  }

  private checkLotnameInOrg(lotNameArr: string[], org: any): boolean {
    let flag = false;
    for (const lotName of lotNameArr) {
      flag = org.lotName.toLowerCase().includes((lotName || '').toLowerCase());
      if (flag) {
        break;
      }
    }
    return flag;
  }

  public onSelectedOptionsChange() {
    setTimeout(() => {
      const listSelected = [];
      this.organizations.filter(org => {
        return org.checked;
      }).forEach(chosen => {
        listSelected.push(chosen);
      });
      this.update.emit(listSelected);
      this.updateSelectAllState();
    })
  }

  public toggleCheckedOption(organization: IEstablishment) {
    organization.checked = !organization.checked;
    if(!this.multiple) {
      this.organizations.forEach(org => {
        if(org.id !== organization.id) {
          org.checked = false;
        }
      })
    }
  }

  public toggleSelectAll(organization: IEstablishment) {
    this.filteredOrganizations.forEach(org => {
      org.checked = this.selectAll;
    });
    this.onSelectedOptionsChange();
  }

  private updateSelectAllState() {
    if (this.filteredOrganizations.length === 0) {
      this.selectAll = false;
      return;
    }
    const notSelected = this.filteredOrganizations.filter(elem => !elem.checked);
    if (notSelected.length > 0) {
      this.selectAll = false;
      return;
    } else {
      this.selectAll = true;
      return;
    }
  }

  public reset() {
    this.organizations.forEach(org => org.checked = false);
    this.updateSelectAllState();
    this.update.emit([]);
  }

}