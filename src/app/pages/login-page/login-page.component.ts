import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

import { User } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';

@Component({
  standalone: true,
  imports: [FontAwesomeModule, AsyncPipe],
  template: `
    <div class="container">
      <h2>Escolha um usuário:</h2>

      <input #inputFile type="file" (change)="onLoadImage($event)">
      
      <ul class="user-list">
        @for (userData of users$ | async; track userData.user.id) {
          <li class="user">
            @if(userData.image) {
              <img class="user-image" [src]="userData.image" alt="Foto {{userData.user.name}}">
            } @else {
              <span class="user-initials">{{userData.user.initials}}</span>
            }
            <h3 class="user-name">{{userData.user.name}}</h3>
            <button (click)="onImageUploadBtnClicked(userData.user, inputFile)" class="img-upload">
              <fa-icon class="icon-camera" [icon]="faCamera" size="2x"/>
            </button>
          </li>
        }
      </ul>
    </div>
  `,
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  private userService = inject(UserService);
  private lastUserClicked: User | undefined;

  protected faCamera = faCamera;
  protected users$ = this.userService.getUsers();

  private refreshUsers() {
    this.users$ = this.userService.getUsers();
  }

  protected onLoadImage(event: Event) {
    const inputFile = event.target as HTMLInputElement;
    const files = inputFile.files;
  
    if(!files || files.length === 0) { return; }
    
    const reader = new FileReader();
    reader.readAsArrayBuffer(files[0]);
    reader.onloadend = () => {
      const image = reader.result as ArrayBuffer;
      if(this.lastUserClicked) {
        this.userService.addUpdateUserImage(this.lastUserClicked.id, image).subscribe(
          () => this.refreshUsers()
        );
      }
    }
  }

  protected onImageUploadBtnClicked(user: User, inputFile: HTMLInputElement) {
    this.lastUserClicked = user;
    inputFile.click();
  }
}
