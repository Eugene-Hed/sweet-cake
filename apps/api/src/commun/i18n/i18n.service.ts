import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import * as fr from './traductions/fr.json';
import * as en from './traductions/en.json';

type TraductionsType = typeof fr;

const traductions: Record<string, TraductionsType> = { fr, en };

@Injectable({ scope: Scope.REQUEST })
export class I18nService {
    private langue: string;

    constructor(@Inject(REQUEST) private readonly requete: Request) {
        this.langue = this.detecterLangue();
    }

    private detecterLangue(): string {
        // 1. En-tête Accept-Language
        const acceptLanguage = this.requete?.headers?.['accept-language'];
        if (acceptLanguage) {
            const langue = acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase();
            if (langue && traductions[langue]) {
                return langue;
            }
        }

        // 2. Paramètre de requête ?lang=
        const langParam = this.requete?.query?.lang as string;
        if (langParam && traductions[langParam]) {
            return langParam;
        }

        // 3. Repli sur le français
        return 'fr';
    }

    /**
     * Traduit une clé avec interpolation optionnelle
     * Exemple: traduire('erreurs.produit_indisponible', { nom: 'Croissant' })
     */
    traduire(cle: string, params?: Record<string, string>): string {
        const parties = cle.split('.');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let valeur: any = traductions[this.langue];

        for (const partie of parties) {
            valeur = valeur?.[partie];
        }

        // Repli sur le français si traduction manquante
        if (!valeur) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let valeurRepli: any = traductions['fr'];
            for (const partie of parties) {
                valeurRepli = valeurRepli?.[partie];
            }
            valeur = valeurRepli || cle;
        }

        // Interpolation des paramètres
        if (typeof valeur === 'string' && params) {
            return Object.entries(params).reduce(
                (resultat, [param, val]) => resultat.replace(new RegExp(`\\{${param}\\}`, 'g'), val),
                valeur,
            );
        }

        return valeur || cle;
    }

    /** Raccourci pour les messages d'erreur */
    erreur(cle: string, params?: Record<string, string>): string {
        return this.traduire(`erreurs.${cle}`, params);
    }

    /** Raccourci pour les messages système */
    message(cle: string, params?: Record<string, string>): string {
        return this.traduire(`messages.${cle}`, params);
    }

    getLangue(): string {
        return this.langue;
    }
}
