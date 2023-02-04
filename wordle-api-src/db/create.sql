DROP TABLE game;

CREATE TABLE game (
    id SERIAL PRIMARY KEY,
    uuid character varying(255),
    type character varying(255),
    state text
);

DROP TABLE player;

CREATE TABLE player (
    id SERIAL PRIMARY KEY,
    name character varying(255),
    session_token character varying(255),
    game_id integer
);