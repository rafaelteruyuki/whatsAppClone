import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { Subscription, take } from 'rxjs';

import { UserService } from '../../services/user.service';

@Component({
  standalone: true,
  imports: [FontAwesomeModule, AsyncPipe],
  template: `
    <div class="container">
      <h2>Escolha um usuário:</h2>

      <input #inputFile type="file">
      
      <ul class="user-list">
        @for (user of users$ | async; track user.id) {
          <li class="user">
            <img class="user-image" src="" alt="Foto">
            <h3 class="user-name">{{user.name}}</h3>
            <button (click)="inputFile.click()" class="img-upload">
              <fa-icon [icon]="faCamera" size="2x"/>
            </button>
          </li>
        }
      </ul>
    </div>
  `,
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnDestroy {
  private userService = inject(UserService);

  protected faCamera = faCamera;
  protected users$ = this.userService.getUsers();

  private subscription = new Subscription();

  constructor() {
    this.users$
      .pipe(take(1)) //mata o subscribe após a quantidade de emissões passadas no take()
      .subscribe(
        users => {
          console.log('Users do subscribe com o take(1)', users)
        }
      );
    
    //Outra forma de matar o subscribe
    const subscription = this.users$.subscribe(users => {
      console.log('Users do subscribe com a subscription capturada', users)
    });

    this.subscription.add(subscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
