import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class FiltreExceptionsGlobal implements ExceptionFilter {
    private readonly logger = new Logger(FiltreExceptionsGlobal.name);

    catch(exception: unknown, hote: ArgumentsHost): void {
        const ctx = hote.switchToHttp();
        const reponse = ctx.getResponse<Response>();
        const requete = ctx.getRequest<Request>();

        let statut = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Erreur interne du serveur';
        let codeMetier: string | undefined;
        let details: Record<string, unknown>[] | undefined;

        if (exception instanceof HttpException) {
            statut = exception.getStatus();
            const reponseException = exception.getResponse();

            if (typeof reponseException === 'string') {
                message = reponseException;
            } else if (typeof reponseException === 'object') {
                const rep = reponseException as Record<string, unknown>;
                message = (rep.message as string) || message;
                codeMetier = rep.code_metier as string;

                // Gestion des erreurs de validation class-validator
                if (Array.isArray(rep.message)) {
                    details = (rep.message as string[]).map((msg) => ({ message: msg }));
                    message = 'Erreur de validation';
                }
            }
        } else if (exception instanceof Error) {
            message = exception.message;
        }

        // Log de l'erreur
        if (statut >= 500) {
            this.logger.error(
                `[${requete.method}] ${requete.url} - ${statut} - ${message}`,
                exception instanceof Error ? exception.stack : undefined,
            );
        } else {
            this.logger.warn(`[${requete.method}] ${requete.url} - ${statut} - ${message}`);
        }

        const corpsErreur = {
            succes: false,
            message,
            ...(codeMetier && { code_metier: codeMetier }),
            ...(details && { details }),
            horodatage: new Date().toISOString(),
            chemin: requete.url,
        };

        reponse.status(statut).json(corpsErreur);
    }
}
