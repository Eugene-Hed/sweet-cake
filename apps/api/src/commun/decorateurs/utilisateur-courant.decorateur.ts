import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UtilisateurCourant = createParamDecorator(
    (donnee: string, ctx: ExecutionContext) => {
        const requete = ctx.switchToHttp().getRequest();
        const utilisateur = requete.user;
        return donnee ? utilisateur?.[donnee] : utilisateur;
    },
);
