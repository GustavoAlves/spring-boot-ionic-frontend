import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CategoriaService } from '../services/domain/categoria.service';
import { ErrorInterceptorProvider } from '../interceptors/error-interceptor';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { ClienteService } from '../services/domain/cliente.service';
import { AuthInterceptorProvider } from '../interceptors/auth-interceptor';
import { ProdutoService } from '../services/domain/produto.service';
import { CartService } from '../services/domain/cart.service';
import { ImageUtilService } from '../services/image-util.service';

export function HttpLoaderFactory(http: HttpClient) {
  //return new TranslateHttpLoader(http);
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  }) 
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    CategoriaService,
    AuthInterceptorProvider,
    ErrorInterceptorProvider,
    AuthService,
    StorageService,
    ClienteService,
    ProdutoService,
    CartService,
    ImageUtilService
  ]
})
export class AppModule { }
