import { relations } from 'drizzle-orm';
import { guilds } from './guilds';
import { tags } from './tags';

export const guildsRelations = relations(guilds, (helpers) => ({ tags: helpers.many(tags, { relationName: 'GuildToTag' }) }));