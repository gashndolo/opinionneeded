ALTER TABLE comments
    ADD COLUMN topic_id INT
    REFERENCES topics(id)
    ON DELETE SET NULL;