import * as guilds from "./guilds";
import * as guildsRelations from "./guilds-relations";
import * as tags from "./tags";
import * as tagsRelations from "./tags-relations";
import * as users from "./users";
import * as usersRelations from "./users-relations";

export const schema = {
	...users,
	...guilds,
	...tags,
	...usersRelations,
	...guildsRelations,
	...tagsRelations,
};
