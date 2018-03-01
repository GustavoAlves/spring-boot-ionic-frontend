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

    public removeProduto(produto: ProdutoDTO): Cart {
        let cart: Cart = this.getCart();
        let position = cart.items.findIndex(x => x.produto.id == produto.id);

        if (position >= 0) {
            cart.items.splice(position, 1);
        }

        this.storage.setCart(cart);

        return cart;
    }

    public increaseQuantity(produto: ProdutoDTO): Cart {
        let cart: Cart = this.getCart();
        let position = cart.items.findIndex(x => x.produto.id == produto.id);

        if (position >= 0) {
            cart.items[position].quantidade++;
        }

        this.storage.setCart(cart);

        return cart;
    }

    public decreaseQuantity(produto: ProdutoDTO): Cart {
        let cart: Cart = this.getCart();
        let position = cart.items.findIndex(x => x.produto.id == produto.id);

        if (position >= 0) {
            if (cart.items[position].quantidade > 1) {
                cart.items[position].quantidade--;
            } else {
                cart.items.splice(position, 1);
            }
        }

        this.storage.setCart(cart);

        return cart;
    }

    public total(): number {
        let cart: Cart = this.getCart();
        let sum: number = 0;

        for (let i = 0; i < cart.items.length; i++) {
            sum += cart.items[i].produto.preco * cart.items[i].quantidade;
        }

        return sum;
    }

}