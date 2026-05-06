-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: ism_crm
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `status` varchar(20) NOT NULL,
  `source` varchar(50) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `notes` text,
  `last_contact` date DEFAULT NULL,
  `next_follow_up` date DEFAULT NULL,
  `estimated_value` decimal(12,2) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_customers_created_by` (`created_by`),
  CONSTRAINT `fk_customers_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'Tôn Quang Duy','quangduy37@gmail.com','0988888777','Interested','Facebook Ads','Thu Duc, Ho Chi Minh City','Customer is interested in bulk purchase and asked about discount options.','2026-03-26','2026-03-28',12500000.00,1,'2025-11-08 09:15:00'),(2,'Le Minh Trang','trang.le@email.com','0938998889','Contacted','Website Form','Binh Thanh, Ho Chi Minh City','Customer requested a detailed quote before making decision.','2026-03-25','2026-03-29',8300000.00,1,'2025-12-03 10:20:00'),(3,'Tran Gia Huy','huy.tran@email.com','0987741258','New','Zalo','District 7, Ho Chi Minh City','New lead asking for latest catalog and delivery fee.','2026-03-24','2026-03-27',4500000.00,2,'2025-12-18 14:45:00'),(16,'Mai Hung','abc@gmail.com','0889774232','New','Facebook Ads',NULL,NULL,'2026-03-24','2026-03-31',NULL,NULL,'2026-03-30 18:00:00'),(17,'Lê Phú An','an123@gmail.com','0912475784','New','Email Campaign',NULL,NULL,'2026-03-31','2026-04-15',NULL,NULL,'2026-04-01 09:00:00');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `interactions`
--

DROP TABLE IF EXISTS `interactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `type` varchar(50) NOT NULL,
  `content` text,
  `interaction_date` date NOT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_interactions_customer` (`customer_id`),
  KEY `fk_interactions_created_by` (`created_by`),
  CONSTRAINT `fk_interactions_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_interactions_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interactions`
--

LOCK TABLES `interactions` WRITE;
/*!40000 ALTER TABLE `interactions` DISABLE KEYS */;
INSERT INTO `interactions` VALUES (1,1,'Phone Call','Discussed pricing and delivery timeline.','2026-03-26',1,'2026-03-28 14:21:30'),(2,1,'Zalo Message','Sent product catalog and sample photos.','2026-03-25',1,'2026-03-28 14:21:30'),(3,2,'Email','Sent quote and product comparison.','2026-03-25',1,'2026-03-28 14:21:30'),(4,3,'Zalo Message','Customer asked for product list and shipping fee.','2026-03-24',2,'2026-03-28 14:21:30'),(5,1,'Call','Customer asked about pricing details','2026-03-29',1,'2026-03-28 19:51:33'),(6,1,'Call','Day 37 test interaction','2026-03-29',1,'2026-03-28 20:09:40'),(8,1,'Call','call for jobs','2026-03-29',1,'2026-03-29 00:13:49'),(9,1,'Call','ask about his job','2026-03-30',1,'2026-03-30 18:51:19'),(11,17,'Call','123','2026-04-06',1,'2026-04-06 11:49:44');
/*!40000 ALTER TABLE `interactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text,
  `stage` varchar(30) NOT NULL,
  `due_date` date DEFAULT NULL,
  `assigned_to` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_tasks_customer` (`customer_id`),
  KEY `fk_tasks_assigned_to` (`assigned_to`),
  CONSTRAINT `fk_tasks_assigned_to` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_tasks_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (1,1,'Call Nguyen Van An','Confirm final quotation and delivery schedule.','Done','2026-03-28',1,'2026-03-28 14:21:30'),(2,2,'Follow-up Le Minh Trang','Check whether the customer reviewed the quote.','In Progress','2026-03-29',1,'2026-03-28 14:21:30'),(3,3,'Send catalog to Tran Gia Huy','Send updated product list via Zalo.','Done','2026-03-27',2,'2026-03-28 14:21:30'),(4,1,'meeting room','','Done','2026-03-31',NULL,'2026-03-30 19:17:12'),(7,3,'meeting room','','To Do','2026-03-31',NULL,'2026-03-30 19:33:50'),(8,3,'meeting 2','','Done','2026-03-27',NULL,'2026-03-30 19:34:14'),(9,16,'meeting room','','Done','2026-03-31',NULL,'2026-03-31 15:00:48'),(11,17,'meeting room','','Done','2026-03-31',NULL,'2026-04-06 11:49:33');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Pho Admin','admin@ismcrm.com','123456','admin','2026-03-28 14:21:30'),(2,'Nguyen Staff','staff@ismcrm.com','123456','staff','2026-03-28 14:21:30');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-25 20:54:04
