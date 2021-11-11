CREATE TABLE topics
(id SERIAL PRIMARY KEY,
title text not null,
description text not null,
upvotes int default 0,
timestamp TIMESTAMP not null DEFAULT now());