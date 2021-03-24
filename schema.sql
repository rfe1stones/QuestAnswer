CREATE DATABASE questions;

\c questions;

CREATE TABLE IF NOT EXISTS questions (
  question_id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  question_body VARCHAR NOT NULL,
  question_date DATE,
  asker_name VARCHAR(60),
  asker_email VARCHAR(50) NOT NULL,
  question_helpfulness INTEGER DEFAULT 0,
  reported BOOLEAN DEFAULT 'f',

  UNIQUE (product_id, question_body)
);

CREATE TABLE IF NOT EXISTS answers (
  id SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL,
  body VARCHAR NOT NULL,
  date DATE,
  answerer_name VARCHAR(60),
  answerer_email VARCHAR(50) NOT NULL,
  helpfulness INTEGER DEFAULT 0,
  reported BOOLEAN DEFAULT 'f',

  FOREIGN KEY (question_id) REFERENCES questions (question_id)
);

CREATE TABLE IF NOT EXISTS answer_photos (
  id SERIAL PRIMARY KEY,
  url VARCHAR NOT NULL,
  answers_id INTEGER NOT NULL,

  FOREIGN KEY (answers_id) REFERENCES answers (id)
);