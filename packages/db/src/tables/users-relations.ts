import { relations } from 'drizzle-orm';
import { users } from './users';
import { members } from './members';

export const usersRelations = relations(users, (helpers) => ({ member: helpers.many(members, { relationName: 'MemberToUser' }) }));