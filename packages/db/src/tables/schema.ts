import * as users from "./users";
import * as guilds from "./guilds";
import * as tags from "./tags";
import * as usersRelations from "./users-relations";
import * as guildsRelations from "./guilds-relations";
import * as tagsRelations from "./tags-relations";

export const schema = {
	...users,
	...guilds,
	...tags,
	...usersRelations,
	...guildsRelations,
	...tagsRelations,
};
