import { SetMetadata } from '@nestjs/common';

export const CLE_PUBLIQUE = 'estPublic';
export const Public = () => SetMetadata(CLE_PUBLIQUE, true);
