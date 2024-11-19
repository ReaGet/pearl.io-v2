-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "url" VARCHAR(512) NOT NULL,
    "favicon" VARCHAR(512),
    "cacheDuration" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routes" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "path" VARCHAR(512) NOT NULL,
    "return_type" VARCHAR(50) NOT NULL,
    "cache_duration" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cached_images" (
    "id" UUID NOT NULL,
    "url" VARCHAR(512) NOT NULL,
    "project_id" UUID NOT NULL,
    "route_id" UUID NOT NULL,
    "storage_path" VARCHAR(512) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cached_images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "routes" ADD CONSTRAINT "routes_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cached_images" ADD CONSTRAINT "cached_images_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cached_images" ADD CONSTRAINT "cached_images_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "routes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
