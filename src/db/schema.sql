CREATE TABLE IF NOT EXISTS "agent_types" (
	"id"	TEXT NOT NULL UNIQUE,
	"name"	TEXT NOT NULL UNIQUE,
	"default_props" JSON,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "resource_types" (
	"id"	TEXT NOT NULL UNIQUE,
	"name"	TEXT NOT NULL UNIQUE,
	"default_props" JSON,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "event_types" (
	"id" TEXT NOT NULL UNIQUE,
	"default_props" JSON,
	"agent_types_id" TEXT NOT NULL,
	"verb" TEXT NOT NULL,
	"resource_types_id"	TEXT NOT NULL,
	"previous_event_types_id" TEXT REFERENCES event_types,
	FOREIGN KEY("agent_types_id") REFERENCES "agent_types"("id"),
	FOREIGN KEY("resource_types_id") REFERENCES "resource_types"("id"),
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "agents" (
	"id"	TEXT NOT NULL UNIQUE,
	"agent_types_id"	TEXT NOT NULL,
	"props" JSON,
	FOREIGN KEY("agent_types_id") REFERENCES "agent_types"("id"),
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "events" (
	"id"	TEXT NOT NULL UNIQUE,
	"props" JSON,
	"event_types_id"	TEXT NOT NULL,
	"agents_id" TEXT NOT NULL,
	"resources_id" TEXT NOT NULL,
	FOREIGN KEY("agents_id") REFERENCES "agents"("id"),
	FOREIGN KEY("resources_id") REFERENCES "resources"("id"),
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "resources" (
	"id"	TEXT NOT NULL UNIQUE,
	"props" JSON,
	"resource_types_id"	TEXT NOT NULL,
	FOREIGN KEY("resource_types_id") REFERENCES "resource_types"("id"),
	PRIMARY KEY("id")
);
