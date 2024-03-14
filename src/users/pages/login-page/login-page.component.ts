import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { faCamera } from '@fortawesome/free-solid-svg-icons';
@Component({
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <div class="container">
      <h2>Escolha um usuário:</h2>

      <input #inputFile type="file">

      <ul class="user-list">
        <li class="user">
          <img class="user-image" src="" alt="Foto">
          <h3 class="user-name">Nome usuário</h3>
          <button (click)="inputFile.click()" class="img-upload">
            <fa-icon [icon]="faCamera" size="2x"/>
          </button>
        </li>
      </ul>
    </div>
  `,
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  protected faCamera = faCamera;
}
