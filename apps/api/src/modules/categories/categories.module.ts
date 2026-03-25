import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesControleur } from './categories.controleur';

@Module({
    controllers: [CategoriesControleur],
    providers: [CategoriesService],
    exports: [CategoriesService],
})
export class CategoriesModule { }
