import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CLES_ROLES } from '../decorateurs/roles.decorateur';

@Injectable()
export class GardeRoles implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(contexte: ExecutionContext): boolean {
        const rolesRequis = this.reflector.getAllAndOverride<string[]>(CLES_ROLES, [
            contexte.getHandler(),
            contexte.getClass(),
        ]);

        if (!rolesRequis || rolesRequis.length === 0) {
            return true;
        }

        const requete = contexte.switchToHttp().getRequest();
        const utilisateur = requete.user;

        if (!utilisateur) {
            return false;
        }

        return rolesRequis.includes(utilisateur.role);
    }
}
