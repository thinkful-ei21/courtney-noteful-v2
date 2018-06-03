DROP TABLE IF EXISTS notes_tags;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS folders;


CREATE TABLE folders (
    id serial PRIMARY KEY,
    name text NOT NULL
);

ALTER SEQUENCE folders_id_seq RESTART WITH 100;


CREATE TABLE notes (
	id serial PRIMARY KEY,
	title text NOT NULL,
	content text,
	created timestamp DEFAULT now(),
	folder_id int REFERENCES folders(id) ON DELETE SET NULL
);

ALTER SEQUENCE notes_id_seq RESTART WITH 1000;

ALTER TABLE notes ADD COLUMN folder_id int REFERENCES folders(id) ON DELETE SET NULL;

CREATE TABLE tags (
	id serial PRIMARY KEY,
	name text NOT NULL
);


CREATE TABLE notes_tags (
	note_id INTEGER NOT NULL REFERENCES notes ON DELETE CASCADE,
	tag_id INTEGER NOT NULL REFERENCES tags ON DELETE CASCADE
);


INSERT INTO folders (name) VALUES
  ('Archive'),
  ('Drafts'),
  ('Personal'),
  ('Work');


INSERT INTO notes (title, content, folder_id) VALUES 
	(
		'Spaceman Eats Cheese And Saves The World', 
		'Lorem ipsum dolor sit amet,',
		100
	),
	(
		'Blah Blah Blah', 
		'Lorem ipsum dolor sit amet,',
		101
	),
	(
		'Cats Take Over The World...Again', 
		'Lorem ipsum dolor sit amet,',
		102
	),
	(
		'Turtles: All You Need To Know', 
		'Lorem ipsum dolor sit amet,',
		103
	),
	(
		'Spaaaccceeeee', 
		'Lorem ipsum dolor sit amet,',
		100
	),
	(
		'Blah', 
		'Lorem ipsum dolor sit amet,',
		101
	),
	(
		'Cats', 
		'Lorem ipsum dolor sit amet,',
		102
	),
	(
		'Turtles', 
		'Lorem ipsum dolor sit amet,',
		103
	);


-- SELECT * 
-- FROM notes INNER JOIN folders 
-- ON notes.folder_id = folders.id;

-- SELECT *
-- FROM notes LEFT JOIN folders 
-- ON notes.folder_id = folders.id;

-- SELECT *
-- FROM notes LEFT JOIN folders 
-- ON notes.folder_id = folders.id
-- WHERE notes.id = 1005;

INSERT INTO tags (name) VALUES
	('cats'),
	('remember'),
	('important'),
	('fun');


INSERT INTO notes_tags (note_id, tag_id) VALUES
	(1000, 2), (1000, 4),
	(1001, 2), (1001, 3),
	(1002, 1), (1002, 3),
	(1003, 3), (1003, 4),
	(1004, 2),
	(1005, 3),
	(1006, 1), (1006, 4),
	(1007, 2), (1007, 4);


-- SELECT title, tags.name, folders.name FROM notes
-- 	LEFT JOIN folders ON notes.folder_id = folders.id
-- 	LEFT JOIN notes_tags ON notes.id = notes_tags.note_id
-- 	LEFT JOIN tags ON notes_tags.tag_id = tags.id;






