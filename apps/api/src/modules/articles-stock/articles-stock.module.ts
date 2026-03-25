import { Module } from '@nestjs/common';
import { ArticlesStockService } from './articles-stock.service';
import { ArticlesStockControleur } from './articles-stock.controleur';

@Module({
    controllers: [ArticlesStockControleur],
    providers: [ArticlesStockService],
    exports: [ArticlesStockService],
})
export class ArticlesStockModule { }
