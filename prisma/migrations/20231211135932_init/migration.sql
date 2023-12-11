-- CreateTable
CREATE TABLE `User` (
    `_id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `emailVerified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,
    `hashedPassword` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `_id` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `sesion_state` VARCHAR(191) NULL,

    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Address` (
    `_id` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,
    `label` VARCHAR(30) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `city_district` VARCHAR(100) NOT NULL,
    `district` VARCHAR(50) NOT NULL,
    `city_id` VARCHAR(5) NOT NULL,
    `city` VARCHAR(50) NOT NULL,
    `province_id` VARCHAR(5) NOT NULL,
    `province` VARCHAR(50) NOT NULL,
    `postal_code` VARCHAR(5) NOT NULL,
    `address` VARCHAR(200) NOT NULL,
    `notes` VARCHAR(50) NULL,
    `primary` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `_id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `description` VARCHAR(2000) NOT NULL,
    `images` VARCHAR(191) NOT NULL,
    `price` DECIMAL(9, 0) NOT NULL,
    `condition` VARCHAR(20) NOT NULL,
    `stock` MEDIUMINT UNSIGNED NOT NULL,
    `weight` MEDIUMINT UNSIGNED NOT NULL,
    `length` SMALLINT UNSIGNED NOT NULL,
    `width` SMALLINT UNSIGNED NOT NULL,
    `height` SMALLINT UNSIGNED NOT NULL,
    `warranty` VARCHAR(10) NOT NULL,
    `warranty_detail` SMALLINT UNSIGNED NOT NULL,
    `userId` VARCHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `category` VARCHAR(25) NOT NULL,
    `subcategory` VARCHAR(50) NULL,

    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`_id`) ON DELETE CASCADE ON UPDATE CASCADE;
