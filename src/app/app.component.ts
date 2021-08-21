import { Component, HostBinding } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'sk-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @HostBinding('class.sk-app') hostCss = true;

  constructor(matIconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    matIconRegistry
      .addSvgIcon(
        'close',
        sanitizer.bypassSecurityTrustResourceUrl('./assets/close.svg')
      )
      .addSvgIcon(
        'done',
        sanitizer.bypassSecurityTrustResourceUrl('./assets/done.svg')
      )
      .addSvgIcon(
        'remove',
        sanitizer.bypassSecurityTrustResourceUrl('./assets/remove.svg')
      );
  }
}
