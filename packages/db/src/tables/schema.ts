import * as users from './users';
import * as members from './members';
import * as guilds from './guilds';
import * as tags from './tags';
import * as usersRelations from './users-relations';
import * as membersRelations from './members-relations';
import * as guildsRelations from './guilds-relations';
import * as tagsRelations from './tags-relations';

export const schema = { ...users, ...members, ...guilds, ...tags, ...usersRelations, ...membersRelations, ...guildsRelations, ...tagsRelations };