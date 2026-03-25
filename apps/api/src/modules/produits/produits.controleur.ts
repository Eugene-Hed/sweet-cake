import { Controller, Get, Post, Patch, Delete, Param, Body, Query, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProduitsService } from './produits.service';
import { CreerProduitDto, MettreAJourProduitDto, FiltreProduitsDto } from './dto/produit.dto';
import { PaginationDto } from '../../commun/dto/pagination.dto';
import { Roles } from '../../commun/decorateurs/roles.decorateur';
import { Public } from '../../commun/decorateurs/public.decorateur';

@ApiTags('Produits')
@Controller('produits')
export class ProduitsControleur {
    constructor(private readonly produitsService: ProduitsService) { }

    @Public()
    @Get()
    @ApiOperation({ summary: 'Lister les produits avec filtres' })
    async listerTous(@Query() dto: FiltreProduitsDto) {
        return this.produitsService.listerTous(dto, dto);
    }

    @Public()
    @Get(':id')
    @ApiOperation({ summary: 'Consulter un produit' })
    async trouverParId(@Param('id', ParseIntPipe) id: number) {
        return this.produitsService.trouverParId(id);
    }

    @Post()
    @ApiBearerAuth()
    @Roles('administrateur')
    @ApiOperation({ summary: 'Créer un produit' })
    async creer(@Body() dto: CreerProduitDto) {
        return this.produitsService.creer(dto);
    }

    @Patch(':id')
    @ApiBearerAuth()
    @Roles('administrateur')
    @ApiOperation({ summary: 'Modifier un produit' })
    async mettreAJour(@Param('id', ParseIntPipe) id: number, @Body() dto: MettreAJourProduitDto) {
        return this.produitsService.mettreAJour(id, dto);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @Roles('administrateur')
    @ApiOperation({ summary: 'Supprimer un produit (soft delete)' })
    async supprimer(@Param('id', ParseIntPipe) id: number) {
        return this.produitsService.supprimer(id);
    }

    @Post('upload')
    @ApiBearerAuth()
    @Roles('administrateur')
    @ApiOperation({ summary: 'Télécharger une image de produit' })
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads/produits',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
                return cb(new Error('Format d\'image non supporté'), false);
            }
            cb(null, true);
        },
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }))
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        return {
            message: 'Image téléchargée avec succès',
            donnees: {
                image_url: `/uploads/produits/${file.filename}`
            }
        };
    }
}

