-- Create schemas inside G2KK db 
CREATE SCHEMA users;
CREATE SCHEMA geo;
CREATE SCHEMA business;

--Create tables
CREATE TABLE users.users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT UNIQUE
);

CREATE TABLE geo.tourist_places (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    location  GEOGRAPHY(POINT, 4326)
);

CREATE TABLE business.hotels (
    id SERIAL PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    location GEOGRAPHY(POINT, 4326) NOT NULL
);

CREATE TABLE users.feedbacks (
    id SERIAL PRIMARY KEY,
    user_id INT,
    place_id INT,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users.users(id),
    FOREIGN KEY (place_id) REFERENCES geo.tourist_places(id)
);