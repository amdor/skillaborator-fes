import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    ViewEncapsulation,
  } from '@angular/core';
  
  @Component({
    selector: 'sk-contact-footer',
    templateUrl: './contact-footer.component.html',
    styleUrls: ['./contact-footer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
  })
  export class ContactFooterComponent {
    @HostBinding('class.sk-contact-footer') hostCss = true;
  
  }
  