-- CreateTable
CREATE TABLE "store_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "storeName" VARCHAR(255) NOT NULL DEFAULT 'Suvidha Store',
    "address" VARCHAR(255) NOT NULL DEFAULT '123, Suvidha Lane, Suvidha City',
    "currency" VARCHAR(10) NOT NULL DEFAULT 'INR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_settings_pkey" PRIMARY KEY ("id")
);
