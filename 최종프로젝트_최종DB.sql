-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema hpmdb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema hpmdb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `hpmdb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `hpmdb` ;

-- -----------------------------------------------------
-- Table `hpmdb`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hpmdb`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `nickname` VARCHAR(45) NOT NULL,
  `user_id` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `birth` DATE NULL DEFAULT NULL,
  `phone_number` VARCHAR(45) NULL DEFAULT NULL,
  `email` VARCHAR(45) NULL DEFAULT NULL,
  `address` VARCHAR(255) NULL DEFAULT NULL,
  `register_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC) VISIBLE,
  UNIQUE INDEX `nickname_UNIQUE` (`nickname` ASC) VISIBLE,
  UNIQUE INDEX `phone_number_UNIQUE` (`phone_number` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 33
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hpmdb`.`clubs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hpmdb`.`clubs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL DEFAULT NULL,
  `url` VARCHAR(255) NULL DEFAULT NULL,
  `title` VARCHAR(255) NULL DEFAULT NULL,
  `content` TEXT NULL DEFAULT NULL,
  `update_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `views` INT NULL DEFAULT '0',
  `users_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_clubs_users1_idx` (`users_id` ASC) VISIBLE,
  CONSTRAINT `fk_clubs_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `hpmdb`.`users` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hpmdb`.`club_comments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hpmdb`.`club_comments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `content` TEXT NOT NULL,
  `update_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `clubs_id` INT NOT NULL,
  `users_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_club_comments_clubs1_idx` (`clubs_id` ASC) VISIBLE,
  INDEX `fk_club_comments_users1_idx` (`users_id` ASC) VISIBLE,
  CONSTRAINT `fk_club_comments_clubs1`
    FOREIGN KEY (`clubs_id`)
    REFERENCES `hpmdb`.`clubs` (`id`),
  CONSTRAINT `fk_club_comments_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `hpmdb`.`users` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hpmdb`.`communities`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hpmdb`.`communities` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NULL DEFAULT NULL,
  `content` TEXT NULL DEFAULT NULL,
  `update_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `users_id` INT NOT NULL,
  `views` INT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_communities_users1_idx` (`users_id` ASC) VISIBLE,
  CONSTRAINT `fk_communities_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `hpmdb`.`users` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 187
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hpmdb`.`community_comments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hpmdb`.`community_comments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `content` TEXT NOT NULL,
  `update_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `communities_id` INT NOT NULL,
  `users_id` INT NOT NULL,
  `parent_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_community_comments_communities1_idx` (`communities_id` ASC) VISIBLE,
  INDEX `fk_community_comments_users1_idx` (`users_id` ASC) VISIBLE,
  CONSTRAINT `fk_community_comments_communities1`
    FOREIGN KEY (`communities_id`)
    REFERENCES `hpmdb`.`communities` (`id`),
  CONSTRAINT `fk_community_comments_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `hpmdb`.`users` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 53
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hpmdb`.`community_photos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hpmdb`.`community_photos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `file_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `update_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `communities_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_community_photos_communities1_idx` (`communities_id` ASC) VISIBLE,
  CONSTRAINT `fk_community_photos_communities1`
    FOREIGN KEY (`communities_id`)
    REFERENCES `hpmdb`.`communities` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hpmdb`.`mountains`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hpmdb`.`mountains` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `location` VARCHAR(45) NULL DEFAULT NULL,
  `longitude` VARCHAR(45) NULL DEFAULT NULL,
  `latitude` VARCHAR(45) NULL DEFAULT NULL,
  `height` VARCHAR(45) NULL DEFAULT NULL,
  `selection_reason` TEXT NULL DEFAULT NULL,
  `transportation_info` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `mountain_id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hpmdb`.`mountain_courses`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hpmdb`.`mountain_courses` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `course_name` VARCHAR(45) NOT NULL,
  `difficulty_level` VARCHAR(45) NULL DEFAULT NULL,
  `course_time` VARCHAR(45) NULL DEFAULT NULL,
  `course_length` VARCHAR(45) NULL DEFAULT NULL,
  `mountains_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`course_name` ASC) VISIBLE,
  INDEX `fk_mountain_courses_mountains1_idx` (`mountains_id` ASC) VISIBLE,
  CONSTRAINT `fk_mountain_courses_mountains1`
    FOREIGN KEY (`mountains_id`)
    REFERENCES `hpmdb`.`mountains` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hpmdb`.`mountain_images`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hpmdb`.`mountain_images` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `image_url` VARCHAR(512) NOT NULL,
  `mountains_id` INT NOT NULL,
  `is_representative` TINYINT(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  INDEX `fk_mountain_images_mountains1_idx` (`mountains_id` ASC) VISIBLE,
  CONSTRAINT `fk_mountain_images_mountains1`
    FOREIGN KEY (`mountains_id`)
    REFERENCES `hpmdb`.`mountains` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hpmdb`.`mountain_photos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hpmdb`.`mountain_photos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `file_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `update_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `mountains_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_mountain_photos_mountains1_idx` (`mountains_id` ASC) VISIBLE,
  CONSTRAINT `fk_mountain_photos_mountains1`
    FOREIGN KEY (`mountains_id`)
    REFERENCES `hpmdb`.`mountains` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hpmdb`.`restaurants`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hpmdb`.`restaurants` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  `location` TEXT NULL DEFAULT NULL,
  `rate` VARCHAR(45) NULL DEFAULT NULL,
  `title` VARCHAR(255) NULL DEFAULT NULL,
  `content` TEXT NULL DEFAULT NULL,
  `update_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `users_id` INT NOT NULL,
  `views` INT NULL DEFAULT '0',
  `mountains_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_restaurants_users1_idx` (`users_id` ASC) VISIBLE,
  INDEX `fk_restaurants_mountains1_idx` (`mountains_id` ASC) VISIBLE,
  CONSTRAINT `fk_restaurants_mountains1`
    FOREIGN KEY (`mountains_id`)
    REFERENCES `hpmdb`.`mountains` (`id`),
  CONSTRAINT `fk_restaurants_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `hpmdb`.`users` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hpmdb`.`restaurant_comments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hpmdb`.`restaurant_comments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `content` TEXT NOT NULL,
  `update_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `restaurants_id` INT NOT NULL,
  `users_id` INT NOT NULL,
  `parent_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_restaurant_comments_restaurants1_idx` (`restaurants_id` ASC) VISIBLE,
  INDEX `fk_restaurant_comments_users1_idx` (`users_id` ASC) VISIBLE,
  CONSTRAINT `fk_restaurant_comments_restaurants1`
    FOREIGN KEY (`restaurants_id`)
    REFERENCES `hpmdb`.`restaurants` (`id`),
  CONSTRAINT `fk_restaurant_comments_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `hpmdb`.`users` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hpmdb`.`restaurant_likes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hpmdb`.`restaurant_likes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `users_id` INT NOT NULL,
  `restaurants_id` INT NOT NULL,
  `is_like` TINYINT(1) NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `unique_like` (`users_id` ASC, `restaurants_id` ASC) VISIBLE,
  INDEX `restaurants_id` (`restaurants_id` ASC) VISIBLE,
  CONSTRAINT `restaurant_likes_ibfk_1`
    FOREIGN KEY (`users_id`)
    REFERENCES `hpmdb`.`users` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `restaurant_likes_ibfk_2`
    FOREIGN KEY (`restaurants_id`)
    REFERENCES `hpmdb`.`restaurants` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hpmdb`.`restaurant_photos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hpmdb`.`restaurant_photos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `file_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `update_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `restaurants_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_restaurant_photos_restaurants1_idx` (`restaurants_id` ASC) VISIBLE,
  CONSTRAINT `fk_restaurant_photos_restaurants1`
    FOREIGN KEY (`restaurants_id`)
    REFERENCES `hpmdb`.`restaurants` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hpmdb`.`reviews`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hpmdb`.`reviews` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NULL DEFAULT NULL,
  `content` TEXT NULL DEFAULT NULL,
  `update_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `users_id` INT NOT NULL,
  `mountains_id` INT NOT NULL,
  `views` INT NULL DEFAULT '0',
  `mountain_courses_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_reviews_users1_idx` (`users_id` ASC) VISIBLE,
  INDEX `fk_reviews_mountains1_idx` (`mountains_id` ASC) VISIBLE,
  INDEX `fk_reviews_mountain_courses1_idx` (`mountain_courses_id` ASC) VISIBLE,
  CONSTRAINT `fk_reviews_mountain_courses1`
    FOREIGN KEY (`mountain_courses_id`)
    REFERENCES `hpmdb`.`mountain_courses` (`id`),
  CONSTRAINT `fk_reviews_mountains1`
    FOREIGN KEY (`mountains_id`)
    REFERENCES `hpmdb`.`mountains` (`id`),
  CONSTRAINT `fk_reviews_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `hpmdb`.`users` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 12
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hpmdb`.`review_comments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hpmdb`.`review_comments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `content` TEXT NOT NULL,
  `update_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `reviews_id` INT NOT NULL,
  `users_id` INT NOT NULL,
  `parent_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_review_comments_reviews1_idx` (`reviews_id` ASC) VISIBLE,
  INDEX `fk_review_comments_users1_idx` (`users_id` ASC) VISIBLE,
  CONSTRAINT `fk_review_comments_reviews1`
    FOREIGN KEY (`reviews_id`)
    REFERENCES `hpmdb`.`reviews` (`id`),
  CONSTRAINT `fk_review_comments_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `hpmdb`.`users` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hpmdb`.`review_likes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hpmdb`.`review_likes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `users_id` INT NOT NULL,
  `reviews_id` INT NOT NULL,
  `is_like` TINYINT(1) NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `unique_like` (`users_id` ASC, `reviews_id` ASC) VISIBLE,
  INDEX `reviews_id` (`reviews_id` ASC) VISIBLE,
  CONSTRAINT `review_likes_ibfk_1`
    FOREIGN KEY (`users_id`)
    REFERENCES `hpmdb`.`users` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `review_likes_ibfk_2`
    FOREIGN KEY (`reviews_id`)
    REFERENCES `hpmdb`.`reviews` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hpmdb`.`review_photos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hpmdb`.`review_photos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `file_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `update_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `reviews_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_review_photos_reviews1_idx` (`reviews_id` ASC) VISIBLE,
  CONSTRAINT `fk_review_photos_reviews1`
    FOREIGN KEY (`reviews_id`)
    REFERENCES `hpmdb`.`reviews` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hpmdb`.`user_photos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hpmdb`.`user_photos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `file_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `update_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `users_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uk_users_id` (`users_id` ASC) VISIBLE,
  INDEX `fk_users_photos_users1_idx` (`users_id` ASC) VISIBLE,
  CONSTRAINT `fk_users_photos_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `hpmdb`.`users` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
