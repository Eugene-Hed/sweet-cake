import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface FormatReponse<T> {
    succes: boolean;
    message: string;
    donnees?: T;
    meta?: Record<string, unknown>;
}

@Injectable()
export class ReponseIntercepteur<T> implements NestInterceptor<T, FormatReponse<T>> {
    intercept(
        contexte: ExecutionContext,
        suivant: CallHandler,
    ): Observable<FormatReponse<T>> {
        return suivant.handle().pipe(
            map((donnees) => {
                // Si la réponse est déjà formatée, la retourner telle quelle
                if (donnees && typeof donnees === 'object' && 'succes' in donnees) {
                    return donnees;
                }

                // Extraire les méta-données et le message si présents
                if (donnees && typeof donnees === 'object' && 'donnees' in donnees) {
                    return {
                        succes: true,
                        message: donnees.message || 'Opération réussie',
                        donnees: donnees.donnees,
                        ...(donnees.meta && { meta: donnees.meta }),
                    };
                }

                return {
                    succes: true,
                    message: 'Opération réussie',
                    donnees,
                };
            }),
        );
    }
}
