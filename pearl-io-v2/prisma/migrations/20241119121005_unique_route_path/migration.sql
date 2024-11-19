/*
  Warnings:

  - A unique constraint covering the columns `[project_id,path]` on the table `routes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "routes_project_id_path_key" ON "routes"("project_id", "path");
