-- :name save-topic! :<! :1
-- :doc creates a new topic using the title and description keys
INSERT INTO topics
(author, title, description)
VALUES (:author, :title, :description)
RETURNING *;

-- :name get-topics :? :*
-- :doc selects all available messages
SELECT * from topics;

-- :name delete-topic :! :1
-- :doc deletes selected dopic
DELETE FROM topics WHERE id = :id
RETURNING title;

-- :name delete-comment :! :1
-- :doc deletes selected comment
DELETE FROM comments WHERE id = :id
RETURNING comment;

-- :name delete-argument :! :1
-- :doc deletes selected argument
DELETE FROM arguments WHERE id = :id
RETURNING comment;

-- :name get-topic :? :1
-- :doc get a specific topic
SELECT * FROm topics
WHERE id = :topic_id


-- :name save-argument! :<! :1
-- :doc creates a new argument 
INSERT INTO arguments
(author, topic_id, comment, affirm)
VALUES (:author, :topic_id, :comment, :affirm)
RETURNING *;


-- :name get-arguments-for-debate :? :*
-- :get arguments given a for a specific debate
SELECT * FROM arguments
WHERE topic_id = :topic_id

-- :name save-comment! :<! :1
-- :doc creates a new argument 
INSERT INTO comments
(author, argument_id, comment, topic_id)
VALUES (:author, :argument_id, :comment, :topic_id)
RETURNING *;


-- :name get-comments-for-argument :? :*
-- :get arguments given a for a specific debate
SELECT * FROM comments
WHERE argument_id = :argument_id

-- :name get-comments-for-debate :? :*
-- :get arguments given a for a specific debate
SELECT * FROM comments
WHERE topic_id = :topic_id

-- :name create-user!* :! :n
-- :doc creates a new user with the provided login and hashed password
INSERT INTO users
(login, password)
VALUES (:login, :password)

-- :name get-user-for-auth* :? :1
-- :doc selects a user for authentication
SELECT * FROM users
WHERE login = :login 

-- :name get-topics-by-author :? :*
-- :doc selects all posts made by the author
SELECT id, title FROM topics
WHERE author = :author

-- :name get-arguments-by-author :? :*
-- :doc selects all posts made by the author
SELECT id, comment FROM arguments
WHERE author = :author

-- :name get-comments-by-author :? :*
-- :doc selects all posts made by the author
SELECT id, comment FROM comments
WHERE author = :author