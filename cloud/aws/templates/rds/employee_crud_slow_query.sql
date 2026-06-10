-- --------------------------------------------------------
-- SQL Template for AWS RDS Hands-on Lab
-- Description: Basic CRUD operations and Slow Query simulation
-- --------------------------------------------------------

-- 1. Create and use database
CREATE DATABASE IF NOT EXISTS company;
USE company;

-- 2. Create employees table
CREATE TABLE IF NOT EXISTS employees (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    salary INT(10) NOT NULL
);

-- 3. Insert sample data (Create)
INSERT INTO employees (name, address, salary) VALUES
('Linh', 'Quan 12, TPHCM', 5000000),
('Chien', 'Quan 1, TPHCM', 1000000),
('Thong', 'Quan 9, TPHCM', 20000000),
('Hai Huy', 'Quan 13, TPHCM', 5000000);

-- 4. Retrieve data (Read)
SELECT * FROM employees;

-- 5. Update data (Update)
UPDATE employees SET salary = 30000000 WHERE id = 3;

-- 6. Delete data (Delete)
DELETE FROM employees WHERE id = 2;

-- 7. Query to verify changes
SELECT * FROM employees;

-- --------------------------------------------------------
-- 8. Simulate Slow Query using Custom Function
-- --------------------------------------------------------
DELIMITER $$
DROP FUNCTION IF EXISTS `iterateSleep` $$
CREATE FUNCTION `iterateSleep` (iterations INT)
RETURNS INT DETERMINISTIC
BEGIN
    DECLARE remainder INT;

    SET remainder = iterations;

    read_loop: LOOP     
        IF remainder = 0 THEN
            LEAVE read_loop;
        END IF;

        SELECT SLEEP(2) INTO @test;
        SET remainder = remainder - 1;          
    END LOOP;

    RETURN iterations;
END $$
DELIMITER ;

-- Test out the slow query function (simulates a query taking ~4 seconds)
SELECT iterateSleep(2);
