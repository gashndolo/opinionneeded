ALTER TABLE arguments
    ADD COLUMN author TEXT
    REFERENCES users(login)
    ON DELETE SET NULL
    ON UPDATE CASCADE;