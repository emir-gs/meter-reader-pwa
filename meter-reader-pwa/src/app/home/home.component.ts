import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent{

  constructor() { }

  examplePush() {
     if (!('Notification' in window)) {
        alert('Dieser Browser unterstützt leider noch keine Push-Benachrichtigungen!');
      } else {
          Notification.requestPermission()
          .then((permission) => {
            console.log(permission);
            // tslint:disable-next-line: no-unused-expression
            new Notification('Monatliche Erfassung', {
              body: 'Du hast noch nicht deine monatliche Zählererfassung durchgeführt. Tippe hier um sie durch zu führen.',
              icon: '../../assets/icons/icon-192x192.png',
            });
          });
      }
  }
}
