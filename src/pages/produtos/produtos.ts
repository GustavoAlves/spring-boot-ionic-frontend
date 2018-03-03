import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items: ProdutoDTO[] = [];
  page: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public produtoService: ProdutoService,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.loadData();
  }

  public loadData() {
    let categoria_id = this.navParams.get('categoria_id');
    let loader = this.presentLoading();
    let linesPerPage = 10;

    this.produtoService.findByCategoria(categoria_id, this.page, linesPerPage)
      .subscribe(
        response => {
          let start: number = this.items.length;
          this.items = this.items.concat(response['content']);
          let end: number = this.items.length - 1;
          loader.dismiss();
          this.loadImageUrls(start, end);
        },
        error => {
          loader.dismiss();
        }
      );
  }

  public loadImageUrls(start: number, end: number) {
    for (let i = start; i < end; i++) {
      let item = this.items[i];

      this.produtoService.getSmallImageFromBucket(item.id)
        .subscribe(
          response => {
            item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`;
          },
          error => { }
        );
    }
  }

  public showDetail(produto_id: string) {
    this.navCtrl.push('ProdutoDetailPage', { produto_id: produto_id });
  }

  public presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Aguarde..."
    });
    loader.present();

    return loader;
  }

  public doRefresh(refresher) {
    this.page = 0;
    this.items = [];
    this.loadData();

    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  public doInfinite(infiniteScroll) {
    this.page++;
    this.loadData();

    setTimeout(() => {
      infiniteScroll.complete();
    }, 1000);
  }


}
