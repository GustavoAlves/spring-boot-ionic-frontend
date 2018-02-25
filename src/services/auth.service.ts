import { Injectable } from "@angular/core";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../config/api.config";
import { LocalUser } from "../models/local_user";
import { StorageService } from "./storage.service";

@Injectable()
export class AuthService {

    public constructor(public http: HttpClient, public storage: StorageService) {

    }

    public authenticate(creds: CredenciaisDTO) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/login`,
            creds,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }

    public successfulLogin(authorizationValue: string) {
        let tok = authorizationValue.substring(7); // Remove "Bearer "
        let user: LocalUser = {
            token: tok
        }
        this.storage.setLocalUser(user);
    }

    public logout() {
        this.storage.setLocalUser(null);
    }

}