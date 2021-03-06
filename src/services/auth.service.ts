import { Injectable } from "@angular/core";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../config/api.config";
import { LocalUser } from "../models/local_user";
import { StorageService } from "./storage.service";
import { JwtHelper } from "angular2-jwt";
import { CartService } from "./domain/cart.service";

@Injectable()
export class AuthService {

    jwtHelper: JwtHelper = new JwtHelper();

    public constructor(
        public http: HttpClient,
        public storage: StorageService,
        public cartService: CartService) {

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

    public refreshToken(creds: CredenciaisDTO) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/auth/refresh_token`,
            {},
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }

    public successfulLogin(authorizationValue: string) {
        let tok = authorizationValue.substring(7); // Remove "Bearer "
        let user: LocalUser = {
            token: tok,
            email: this.jwtHelper.decodeToken(tok).sub
        }
        this.storage.setLocalUser(user);
        this.cartService.createOrClearCart();
    }

    public logout() {
        this.storage.setLocalUser(null);
    }

}