-- CreateTable
CREATE TABLE "image_requests" (
    "id" UUID NOT NULL,
    "url" VARCHAR(512) NOT NULL,
    "project_id" UUID NOT NULL,
    "route_id" UUID NOT NULL,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "image_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "image_requests_requested_at_idx" ON "image_requests"("requested_at");

-- CreateIndex
CREATE INDEX "image_requests_project_id_idx" ON "image_requests"("project_id");

-- CreateIndex
CREATE INDEX "image_requests_route_id_idx" ON "image_requests"("route_id");

-- AddForeignKey
ALTER TABLE "image_requests" ADD CONSTRAINT "image_requests_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image_requests" ADD CONSTRAINT "image_requests_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "routes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
