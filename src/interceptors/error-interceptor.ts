import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Rx'; // IMPORTANTE: IMPORT ATUALIZADO
import { StorageService } from '../services/storage.service';
import { AlertController } from 'ionic-angular';
import { FieldMessage } from '../models/field-message';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    public constructor(
        public storage: StorageService,
        public alertController: AlertController) {
    }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
            .catch((error, caught) => {
                let errorObj = error.error ? error.error : error;

                if (!errorObj.status) {
                    errorObj = JSON.parse(errorObj);
                }

                console.log("Erro detectado pelo interceptor:");
                console.log(errorObj);

                switch (errorObj.status) {
                    case 401:
                        this.handle401();
                        break;
                    case 403:
                        this.handle403();
                        break;
                    case 422:
                        this.handle422(errorObj);
                        break;
                    default:
                        this.handleDefaultError(errorObj);
                        break;
                }

                return Observable.throw(errorObj);
            }) as any;
    }

    public handle401() {
        let alert = this.alertController.create({
            title: 'Erro 401: falha de autenticação',
            message: 'Email ou senha incorretos',
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });

        alert.present();
    }

    public handle403() {
        this.storage.setLocalUser(null);
    }

    public handle422(errorObj) {
        let alert = this.alertController.create({
            title: 'Erro 422: Validação',
            message: this.listErrors(errorObj.errors),
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });

        alert.present();
    }

    public handleDefaultError(errorObj) {
        let alert = this.alertController.create({
            title: 'Erro ' + errorObj.status + ': ' + errorObj.error,
            message: errorObj.message,
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });

        alert.present();
    }

    private listErrors(messages: FieldMessage[]): string {
        let s: string = '';

        for (let i = 0; i < messages.length; i++) {
            s += '<p><strong>' + messages[i].fieldName + '</strong>: ' + messages[i].message + '</p>';
        }

        return s;
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
};