-- backEnd/crud.sql
SET NAMES utf8mb4;

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS crud_angular_mysql
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE crud_angular_mysql;

-- Crear la tabla de productos
CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar algunos datos de ejemplo
INSERT INTO productos (nombre, descripcion, precio, stock) VALUES
  ('Laptop Dell XPS 13', 'Laptop de alta gama con pantalla 4K', 1299.99, 15),
  ('iPhone 15 Pro', 'Último modelo con cámara avanzada', 999.99, 25),
  ('Monitor LG UltraWide', 'Monitor de 34 pulgadas curvo', 499.99, 10),
  ('Teclado Mecánico Logitech', 'Teclado con switches Cherry MX', 129.99, 30),
  ('Auriculares Sony WH-1000XM5', 'Cancelación de ruido premium', 349.99, 20);