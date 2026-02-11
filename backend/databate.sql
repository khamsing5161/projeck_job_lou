CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name_product VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255),
    description TEXT,
    role VARCHAR(50),
    Gender ENUM('Man', 'Woman') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    cartTotal DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'paid', 'success', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE orders_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    qty INT NOT NULL,
    totalprice DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (order_id) REFERENCES orders(order_id)
        ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE CASCADE
);


CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    slip_image VARCHAR(255),
    status ENUM('pending', 'confirmed', 'rejected') DEFAULT 'pending',
    village VARCHAR(100),
    district VARCHAR(100),
    province VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id) REFERENCES orders(order_id)
        ON DELETE CASCADE
);

CREATE TABLE promotions (
    promotion_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    discount_type ENUM('percent','fixed'),
    discount_value DECIMAL(10,2),
    start_date DATETIME,
    end_date DATETIME,

    active TINYINT(1) DEFAULT 1
);


CREATE TABLE product_promotions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  promo_id INT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
  FOREIGN KEY (promo_id) REFERENCES promotions(promotion_id) ON DELETE CASCADE
);



CREATE TABLE comments_user (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    content_text TEXT NOT NULL,
    popular INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
