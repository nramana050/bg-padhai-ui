import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ElementRef, EventEmitter, forwardRef, Inject, Input, OnDestroy, OnInit, QueryList,
  ViewChild,
  ContentChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import {
  A,
  Z,
  ZERO,
  NINE,
  SPACE,
} from '@angular/cdk/keycodes';
import { Subject } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators';
import { MatSelectSearchClearDirective } from './mat-select-search-clear.directive';


@Component({
  selector: 'mat-select-search',
  templateUrl: './mat-select-search.component.html',
  styleUrls: ['./mat-select-search.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MatSelectSearchComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MatSelectSearchComponent implements OnInit, OnDestroy, AfterViewInit, ControlValueAccessor {

  public _options: QueryList<MatOption>;
  private previousSelectedValues: any[];
  private overlayClassSet = false;
  private readonly change = new EventEmitter<string>();
  private readonly _onDestroy = new Subject<void>();

  @Input() placeholderLabel = 'Search';
  @Input() noEntriesFoundLabel = 'No options found';
  @Input() clearSearchInput = true;
  @Input() disableInitialFocus = false;
  @ViewChild('searchSelectInput', { read: ElementRef }) searchSelectInput: ElementRef;
  @ViewChild('innerSelectSearch', { read: ElementRef }) innerSelectSearch: ElementRef;
  @ContentChild(MatSelectSearchClearDirective, {static:false}) clearIcon: MatSelectSearchClearDirective;
  get value(): string {
    return this._value;
  }
  private _value: string;

  onChange: Function = (_: any) => { };
  onTouched: Function = (_: any) => { };

  constructor(@Inject(MatSelect) public matSelect: MatSelect,
    private readonly changeDetectorRef: ChangeDetectorRef) {

  }

  ngOnInit() {

    this.matSelect.panelClass = 'mat-select-search-panel';

    this.matSelect.openedChange
      .pipe(
        delay(1),
        takeUntil(this._onDestroy)
      )
      .subscribe((opened) => {
        if (opened) {
          this.getWidth();
        }
        if (opened && !this.disableInitialFocus) {
          this._focus();
        }
        if (this.clearSearchInput) {
          this._reset();
        }
      });

    this.matSelect.openedChange
      .pipe(take(1))
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this._options = this.matSelect.options;
        this._options.changes
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            const keyManager = this.matSelect._keyManager;
            if (keyManager && this.matSelect.panelOpen) {
              setTimeout(() => {
                keyManager.setFirstItemActive();
                this.getWidth();
              }, 1);
            }
          });
      });

    this.change
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.changeDetectorRef.detectChanges();
      });

    this.initMultipleHandling();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngAfterViewInit() {
    this.setOverlayClass();

    this.matSelect.openedChange
      .pipe(
        take(1),
        takeUntil(this._onDestroy)
      ).subscribe(() => {
        this.matSelect.options.changes
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.changeDetectorRef.markForCheck();
          });
      });
  }

  _handleKeydown(event: KeyboardEvent) {
    if ((event.key && event.key.length === 1) ||
      (event.keyCode >= A && event.keyCode <= Z) ||
      (event.keyCode >= ZERO && event.keyCode <= NINE) ||
      (event.keyCode === SPACE)) {
      event.stopPropagation();
    }
  }


  writeValue(value: string) {
    const valueChanged = value !== this._value;
    if (valueChanged) {
      this._value = value;
      this.change.emit(value);
    }
  }

  onInputChange(value) {
    const valueChanged = value !== this._value;
    if (valueChanged) {
      this.initMultiSelectedValues();
      this._value = value;
      this.onChange(value);
      this.change.emit(value);
    }
  }

  onBlur(value: string) {
    this.writeValue(value);
    this.onTouched();
  }

  registerOnChange(fn: Function) {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function) {
    this.onTouched = fn;
  }

  public _focus() {
    if (!this.searchSelectInput || !this.matSelect.panel) {
      return;
    }
    const panel = this.matSelect.panel.nativeElement;
    const scrollTop = panel.scrollTop;

    this.searchSelectInput.nativeElement.focus();
    panel.scrollTop = scrollTop;
  }

  public _reset(focus?: boolean) {
    if (!this.searchSelectInput) {
      return;
    }
    this.searchSelectInput.nativeElement.value = '';
    this.onInputChange('');
    if (focus) {
      this._focus();
    }
  }

  private setOverlayClass() {
    if (this.overlayClassSet) {
      return;
    }
    const overlayClass = 'cdk-overlay-pane-select-search';

    this.matSelect.openedChange
      .pipe(filter((opened => opened)), takeUntil(this._onDestroy))
      .subscribe(() => {
        const element: HTMLElement = this.searchSelectInput.nativeElement;
        let overlayElement: HTMLElement;
        while (element === element.parentElement) {
          if (element.classList.contains('cdk-overlay-pane')) {
            overlayElement = element;
            break;
          }
        }
        if (overlayElement) {
          overlayElement.classList.add(overlayClass);
        }
      });
    this.overlayClassSet = true;
  }

  private initMultipleHandling() {
    this.matSelect.valueChange
      .pipe(takeUntil(this._onDestroy))
      .subscribe((values) => {

        if (!values || !Array.isArray(values)) {
          values = [];
        }

        this.storeMultipleHandling(values);
      });
  }

  private storeMultipleHandling(values) {
    if (this.matSelect.multiple) {
      let restoreSelectedValues = false;

      if (this._value && this._value.length
        && this.previousSelectedValues && Array.isArray(this.previousSelectedValues)) {

        const optionValues = this.matSelect.options.map(option => option.value);
        this.previousSelectedValues.forEach(previousValue => {
          if (values.indexOf(previousValue) === -1 && optionValues.indexOf(previousValue) === -1) {
            values.push(previousValue);
            restoreSelectedValues = true;
          }
        });
      }

      if (restoreSelectedValues) {
        this.matSelect._onChange(values);
      }

      this.previousSelectedValues = values;
    }
  }

  private getWidth() {
    if (!this.innerSelectSearch || !this.innerSelectSearch.nativeElement) {
      return;
    }
    const element: HTMLElement = this.innerSelectSearch.nativeElement;
    let panelElement: HTMLElement;
    while (element === element.parentElement) {
      if (element.classList.contains('mat-select-panel')) {
        panelElement = element;
        break;
      }
    }
    if (panelElement) {
      this.innerSelectSearch.nativeElement.style.width = panelElement.clientWidth + 'px';
    }
  }

  initMultiSelectedValues() {
    if (this.matSelect.multiple && !this._value) {
      this.previousSelectedValues = this.matSelect.options
        .filter(option => option.selected)
        .map(option => option.value);
    }
  }

}
