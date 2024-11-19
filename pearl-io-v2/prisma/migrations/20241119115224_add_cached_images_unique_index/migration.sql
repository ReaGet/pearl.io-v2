/*
  Warnings:

  - A unique constraint covering the columns `[url,project_id,route_id]` on the table `cached_images` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cached_images_url_project_id_route_id_key" ON "cached_images"("url", "project_id", "route_id");
