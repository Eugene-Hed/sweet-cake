import { Module, Global } from '@nestjs/common';
import { JournauxAuditService } from './journaux-audit.service';
import { JournauxAuditControleur } from './journaux-audit.controleur';

@Global()
@Module({
    controllers: [JournauxAuditControleur],
    providers: [JournauxAuditService],
    exports: [JournauxAuditService],
})
export class JournauxAuditModule { }
