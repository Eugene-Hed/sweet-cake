import { SetMetadata } from '@nestjs/common';

export const CLES_ROLES = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(CLES_ROLES, roles);
