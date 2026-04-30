-- Create schemas inside G2KK db 
CREATE SCHEMA users;
CREATE SCHEMA geo;
CREATE SCHEMA business;

--Create tables
CREATE TABLE users.users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE users.orders (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    price INT NOT NULL,
    order_date TIMESTAMP NOT NULL,
    status TEXT DEFAULT 'pending',
    
    -- This links the order to the specific user
    CONSTRAINT fk_user 
        FOREIGN KEY(user_id) 
        REFERENCES users.users(id) 
        ON DELETE CASCADE
);

CREATE TABLE geo.tourist_places (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    location  GEOGRAPHY(POINT, 4326),
    img_src TEXT,
    timing TEXT,
    fee TEXT,
    description TEXT
);

CREATE TABLE business.hotels (
    id SERIAL PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    img_src TEXT,
    fee TEXT,
    available_rooms INT
);

CREATE TABLE business.shop (
    id SERIAL PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    price INT NOT NULL,
    quantity INT,
    img_src TEXT NOT NULL
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