UPDATE people
SET has_pet = true, pet_name = "Franklin", pet_age = 2
WHERE id = 4;
_____________________

-- create new table

DROP DATABASE IF EXISTS programming_db;
-- Create a database called programming_db --
CREATE DATABASE programming_db;

-- Use programming db for the following statements --

CREATE TABLE programming_languages
(
    -- Create a numeric column called "id" which will automatically increment its default value as we create new rows. --
    id INTEGER NOT NULL
    AUTO_INCREMENT,

  -- Create a string column called "language" --
 language VARCHAR
    (100) NOT NULL,
  -- Create an integer column called "rating" --
rating INTEGER;
  -- Create a boolean column called "mastered" which will automatically fill 
  -- with true when a new row is made and the value isn't otherwise defined. --
  mastered BOOLEAN DEFALUT true;
  -- Set the id as this table's primary key
);

    INSERT INTO programming_languages
        (language, rating, mastered)
    VALUES
        ("javaScript", 100, "true");

    PRIMARY Key
    (id);
____________________________





