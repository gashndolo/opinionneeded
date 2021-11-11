CREATE TABLE comments(
id SERIAL PRIMARY KEY,
comment text not null,
upvotes int default 0,
argument_id int,
CONSTRAINT fk_argument
    FOREIGN KEY(argument_id)
        REFERENCES arguments(id) ON DELETE SET NULL
);