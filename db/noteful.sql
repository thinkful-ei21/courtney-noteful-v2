DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS folders;


CREATE TABLE folders (
    id serial PRIMARY KEY,
    name text NOT NULL
);

ALTER SEQUENCE folders_id_seq RESTART WITH 100;

INSERT INTO folders (name) VALUES
  ('Archive'),
  ('Drafts'),
  ('Personal'),
  ('Work');

SELECT * FROM folders;


CREATE TABLE notes (
	id serial PRIMARY KEY,
	title text NOT NULL,
	content text,
	created timestamp DEFAULT now(),
	folder_id int REFERENCES folders(id) ON DELETE SET NULL
);


-- CREATE TABLE notes_tags (
-- 	note_id INTEGER NOT NULL REFERENCES notes ON DELETE CASCADE,
-- 	tag_id INTEGER NOT NULL REFERENCES tags ON DELETE CASCADE
-- );


ALTER SEQUENCE notes_id_seq RESTART WITH 1000;

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










