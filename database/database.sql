-- ==========================================
-- ACHORARO-SYSTEM: PostgreSQL Database Schema
-- For Gaming Peripherals Store & PC Upgrade Simulator
-- ==========================================

-- Enable general extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create PRODUCTS table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    vendor VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    compare_at_price NUMERIC(10, 2),
    image_url VARCHAR(500) NOT NULL,
    secondary_image_url VARCHAR(500),
    tag VARCHAR(100),
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create LOCATIONS / Peruvian Districts Shipping Rates table
CREATE TABLE IF NOT EXISTS location_shipping (
    id SERIAL PRIMARY KEY,
    district_name VARCHAR(100) NOT NULL UNIQUE,
    delivery_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    estimated_days VARCHAR(50) NOT NULL,
    supported_methods VARCHAR(255)[] NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- 3. Create CPU BENCHMARKS database
CREATE TABLE IF NOT EXISTS cpu_benchmarks (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(150) NOT NULL UNIQUE,
    passmark_score INTEGER NOT NULL,
    details VARCHAR(255) NOT NULL,
    tdp_watts INTEGER NOT NULL DEFAULT 65,
    is_popular BOOLEAN DEFAULT TRUE
);

-- 4. Create GPU BENCHMARKS database
CREATE TABLE IF NOT EXISTS gpu_benchmarks (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(150) NOT NULL UNIQUE,
    passmark_score INTEGER NOT NULL,
    details VARCHAR(255) NOT NULL,
    tdp_watts INTEGER NOT NULL DEFAULT 150,
    vram_gb VARCHAR(50) NOT NULL DEFAULT '8GB',
    is_popular BOOLEAN DEFAULT TRUE
);

-- 5. Create SAVED SIMULATIONS (User PC Upgrades calculations log)
CREATE TABLE IF NOT EXISTS user_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255),
    current_cpu VARCHAR(150) NOT NULL,
    current_gpu VARCHAR(150) NOT NULL,
    target_cpu VARCHAR(150) NOT NULL,
    target_gpu VARCHAR(150) NOT NULL,
    performance_lift_percent INTEGER NOT NULL,
    power_watts_required INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- SEED DATA SETUPS
-- ==========================================

-- Seed PRODUCTS Catalog
INSERT INTO products (id, title, vendor, price, compare_at_price, image_url, secondary_image_url, tag, available) VALUES
('1', 'Mouse gamer Gravastar Mercury M1 Pro, inalámbrico, Gradient Black', 'GravaStar', 339.90, 429.90, 'https://www.achorao.com/cdn/shop/files/m1proportada.jpg?v=1763394293', 'https://www.achorao.com/cdn/shop/files/m1pro1.jpg?v=1763394327', 'Ahorra S/.90.00', TRUE),
('2', 'Playseat GearShift Holder PRO soporte de Caja', 'Playseat', 299.90, 600.00, 'https://www.achorao.com/cdn/shop/files/playseat-repuestos-y-accesorios-para-simuladores-default-title-gearshift-holder-pro-soporte-de-caja-8717496871756-39536913416432.jpg?v=1754483006&width=360', 'https://www.achorao.com/cdn/shop/files/playseat-repuestos-y-accesorios-para-simuladores-default-title-gearshift-holder-pro-soporte-de-caja-8717496871756-38399011651824.jpg?v=1754482958&width=360', 'Ahorra 50%', TRUE),
('3', 'Mochila Targus Urban Convertible, 15.6"', 'Targus', 139.90, 189.90, 'https://www.achorao.com/cdn/shop/files/targus-mochila-default-title-mochila-targus-urban-convertible-15-6-tbb595gl-092636346638-46365308354800.jpg?v=1738880689&width=360', NULL, 'Ahorra 26%', TRUE),
('4', 'Placa Madre ASUS TUF Gaming A620M-PLUS WiFi DDR5 para AMD AM5 Matx', 'Asus', 549.90, 649.90, 'https://www.achorao.com/cdn/shop/files/asus-tarjeta-madre-motherboard-default-title-motherboard-asus-tuff-gaming-a620m-plus-wifi-am5-ddr5-197105164260-39065243058416.jpg?v=1754485565&width=360', NULL, 'Ahorra 15%', TRUE),
('5', 'TP Link Archer C80 Router AC1900 WiFi de Doble Banda', 'Tp-Link', 169.90, 194.90, 'https://www.achorao.com/cdn/shop/files/tp-link-computo-default-title-tp-link-archer-c80-router-ac1900-wifi-de-doble-banda-6935364088873-46364852224240.jpg?v=1738879345&width=360', NULL, 'Ahorra 13%', TRUE),
('6', 'Cámara de seguridad TP-Link Tapo C310 Wi-Fi, interior/exterior', 'Tp-Link', 134.90, NULL, 'https://www.achorao.com/cdn/shop/files/tp-link-camaras-default-title-camara-tapo-c310-wi-fi-de-seguridad-para-casa-p163b-6935364010911-46364638675184.jpg?v=1738878477&width=360', NULL, NULL, TRUE),
('7', 'Lámpara portátil Philips Hue Go v2 White & Color Ambiance', 'Philips Hue', 369.90, NULL, 'https://www.achorao.com/cdn/shop/files/philips-hue-smarthome-default-title-lampara-portatil-philips-hue-go-portable-light-zigbee-bluetooth-8718696174036-46364667838704.jpg?v=1738878660&width=360', NULL, 'Agotado', FALSE),
('8', 'Interruptor dimmer inteligente Philips Hue (Dimmer Switch)', 'Philips Hue', 99.90, NULL, 'https://www.achorao.com/cdn/shop/files/philips-hue-smarthome-default-title-philips-hue-interruptor-dimmer-switch-hue-ultimo-modelo-8719514274679-39633522229488.jpg?v=1754483228&width=360', NULL, NULL, TRUE),
('9', 'Barra de luz LED inteligente Philips Hue Play multicolor, pack x1', 'Philips Hue', 259.90, NULL, 'https://www.achorao.com/cdn/shop/files/philips-hue-smarthome-default-title-play-light-and-bar-philips-hue-barra-led-inteligente-multi-color-x1-8718696170731-39633366581488.jpg?v=1754483241&width=360', NULL, NULL, TRUE),
('10', 'Silla gamer Corsair TC500 LUXE', 'CORSAIR', 1449.90, NULL, 'https://www.achorao.com/cdn/shop/files/corsair-silla-gamer-sherwood-silla-gamer-corsair-tc500-luxe-840006678465-38400377454832.jpg?v=1754485024&width=360', NULL, NULL, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Seed Peruvian Districts Delivery Costs and times
INSERT INTO location_shipping (district_name, delivery_cost, estimated_days, supported_methods) VALUES
('Ate', 0.00, 'Entrega en 24 horas', ARRAY['Despacho Express', 'Recojo en Almacén Ate']),
('La Molina', 9.90, 'Entrega express hoy', ARRAY['Moto express', 'Recojo en Almacén Ate']),
('Miraflores', 12.90, 'Entrega en 24-48 horas', ARRAY['Moto express', 'Envio Programado']),
('San Isidro', 12.90, 'Entrega en 24-48 horas', ARRAY['Moto express', 'Envio Programado']),
('Surco', 9.90, 'Entrega en 24 horas', ARRAY['Moto express', 'Envio Programado']),
('San Borja', 9.90, 'Entrega en 24 horas', ARRAY['Moto express', 'Envio Programado']),
('San Miguel', 14.90, 'Entrega en 48 horas', ARRAY['Despacho Común']),
('Los Olivos', 15.90, 'Entrega en 48 horas', ARRAY['Despacho Común']),
('Chorrillos', 14.90, 'Entrega en 24-48 horas', ARRAY['Moto express', 'Envio Programado']),
('Callao (Provincia)', 19.90, 'Entrega en 48-72 horas', ARRAY['Despacho Común']),
('Arequipa (Provincia)', 29.90, 'Entrega en 3 a 5 días útiles', ARRAY['Shalom', 'Olva Courier']),
('Trujillo (Provincia)', 29.90, 'Entrega en 2 a 4 días útiles', ARRAY['Shalom', 'Olva Courier']),
('Cusco (Provincia)', 34.90, 'Entrega en 3 a 5 días útiles', ARRAY['Shalom', 'Olva Courier'])
ON CONFLICT (district_name) DO NOTHING;

-- Seed CPU Benchmarks Info
INSERT INTO cpu_benchmarks (model_name, passmark_score, details, tdp_watts, is_popular) VALUES
('AMD Ryzen 5 5600X', 21900, '6 Cores, 12 Threads @ 3.7GHz', 65, TRUE),
('AMD Ryzen 7 5700X', 26700, '8 Cores, 16 Threads @ 3.4GHz', 65, TRUE),
('AMD Ryzen 7 7800X3D', 34300, '8 Cores, 16 Threads @ 4.2GHz (3D V-Cache)', 120, TRUE),
('AMD Ryzen 9 7950X', 63200, '16 Cores, 32 Threads @ 4.5GHz', 170, TRUE),
('Intel Core i5-12400F', 19500, '6 Cores, 12 Threads @ 2.5GHz', 65, TRUE),
('Intel Core i7-13700K', 46500, '16 Cores, 24 Threads @ 3.4GHz', 125, TRUE),
('Intel Core i9-14900K', 60800, '24 Cores, 32 Threads @ 3.2GHz', 125, TRUE),
('Intel Core i3-12100', 13800, '4 Cores, 8 Threads @ 3.3GHz', 60, TRUE),
('Ryzen 5 3600', 17800, '6 Cores, 12 Threads @ 3.6GHz', 65, FALSE),
('Intel Core i7-7700K', 9700, '4 Cores, 8 Threads @ 4.2GHz', 91, FALSE)
ON CONFLICT (model_name) DO NOTHING;

-- Seed GPU Benchmarks Info
INSERT INTO gpu_benchmarks (model_name, passmark_score, details, tdp_watts, vram_gb, is_popular) VALUES
('NVIDIA GeForce RTX 3060', 17200, 'Ampere Architecture, 3584 CUDA Cores', 170, '12GB', TRUE),
('NVIDIA GeForce RTX 4060', 22800, 'Ada Lovelace Architecture, DLSS 3.0', 115, '8GB', TRUE),
('NVIDIA GeForce RTX 4070 SUPER', 31800, 'High fidelity ray tracing & Tensor cores', 220, '12GB', TRUE),
('NVIDIA GeForce RTX 4090', 39200, 'Ultimate gaming performance GPU', 450, '24GB', TRUE),
('AMD Radeon RX 6600', 14500, 'RDNA 2 Architecture, budget 1080p gaming', 132, '8GB', TRUE),
('AMD Radeon RX 7800 XT', 28100, 'RDNA 3 gaming beast, great value', 263, '16GB', TRUE),
('NVIDIA GTX 1650', 7800, 'Turing core, entry-level display card', 75, '4GB', FALSE),
('NVIDIA GeForce RTX 4080 SUPER', 35400, 'High-tier Ray Tracing & DLSS 3', 320, '16GB', TRUE),
('NVIDIA GTX 1060', 10200, 'Classic Pascal graphics card', 120, '6GB', FALSE)
ON CONFLICT (model_name) DO NOTHING;
