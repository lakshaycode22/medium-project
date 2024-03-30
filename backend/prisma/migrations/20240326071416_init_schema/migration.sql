-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "_likedBlogs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_likedBlogs_AB_unique" ON "_likedBlogs"("A", "B");

-- CreateIndex
CREATE INDEX "_likedBlogs_B_index" ON "_likedBlogs"("B");

-- AddForeignKey
ALTER TABLE "_likedBlogs" ADD CONSTRAINT "_likedBlogs_A_fkey" FOREIGN KEY ("A") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_likedBlogs" ADD CONSTRAINT "_likedBlogs_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
