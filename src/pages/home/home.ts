import { Component } from '@angular/core';
import { NavController, IonicPage, MenuController } from 'ionic-angular';
import { CredenciaisDTO } from '../../models/credenciais.dto';
import { AuthService } from '../../services/auth.service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  creds: CredenciaisDTO = {
    email: '',
    senha: ''
  }

  public constructor(
    public navCtrl: NavController,
    public menu: MenuController,
    public auth: AuthService) {

  }

  public ionViewWillEnter() {
    this.menu.swipeEnable(false);
  }

  public ionViewDidLeave() {
    this.menu.swipeEnable(true);
  }

  public login() {
    this.auth.authenticate(this.creds)
      .subscribe(
        response => {
          this.auth.successfulLogin(response.headers.get('Authorization'));
          this.navCtrl.setRoot('CategoriasPage');
        },
        error => { }
      );
  }

}
