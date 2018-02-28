import { Injectable } from "@angular/core";
import { StorageService } from "../storage.service";
import { Cart } from "../../models/cart";
import { ProdutoDTO } from "../../models/produto.dto";

@Injectable()
export class CartService {

    constructor(public storage: StorageService) {

    }

    public createOrClearCart(): Cart {
        let cart: Cart = { items: [] };
        this.storage.setCart(cart);

        return cart;
    }

    public getCart(): Cart {
        let cart: Cart = this.storage.getCart();

        if (cart == null) {
            cart = this.createOrClearCart();
        }

        return cart;
    }

    public addProduto(produto: ProdutoDTO): Cart {
        let cart: Cart = this.getCart();
        let position = cart.items.findIndex(x => x.produto.id == produto.id);

        if (position >= 0) {
            cart.items[position].quantidade++;
        } else {
            cart.items.push({ quantidade: 1, produto: produto });
        }

        this.storage.setCart(cart);

        return cart;
    }

}