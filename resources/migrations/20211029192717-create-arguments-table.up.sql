CREATE TABLE arguments(
id SERIAL PRIMARY KEY,
comment text not null,
upvotes int default 0,
topic_id int,
CONSTRAINT fk_topic
    FOREIGN KEY(topic_id)
        REFERENCES topics(id) ON DELETE SET NULL
);