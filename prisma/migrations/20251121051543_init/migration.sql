-- CreateEnum
CREATE TYPE "Role" AS ENUM ('superadmin', 'admin', 'staff');

-- Create sequence for Product IDs
CREATE SEQUENCE IF NOT EXISTS product_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- CreateTable users
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'staff',
    "refreshToken" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable products with custom prefixed ID
CREATE TABLE "products" (
    "id" TEXT NOT NULL DEFAULT 'PRD-' || LPAD(nextval('product_seq')::TEXT, 5, '0'),
    "name" VARCHAR(255) NOT NULL,
    "category" VARCHAR(100) NOT NULL DEFAULT 'general',
    "stock_quantity" INTEGER NOT NULL DEFAULT 0,
    "stock_threshold" INTEGER NOT NULL DEFAULT 30,
    "cost_price" DECIMAL(10,2) NOT NULL,
    "selling_price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- Make the sequence owned by the id column (good practice, optional but recommended)
ALTER SEQUENCE product_seq OWNED BY "products"."id";

-- CreateTable sales
CREATE TABLE "sales" (
    "id" SERIAL NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "total_cost" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

CREATE INDEX "products_id_idx" ON "products"("id");
CREATE INDEX "products_name_idx" ON "products"("name");

CREATE INDEX "sales_product_id_idx" ON "sales"("product_id");
CREATE INDEX "sales_created_at_idx" ON "sales"("created_at");

-- Foreign Key
ALTER TABLE "sales" ADD CONSTRAINT "sales_product_id_fkey"
    FOREIGN KEY ("product_id") REFERENCES "products"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
