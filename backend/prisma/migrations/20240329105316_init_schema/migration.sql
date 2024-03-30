/*
  Warnings:

  - You are about to drop the `_likedBlogs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_likedBlogs" DROP CONSTRAINT "_likedBlogs_A_fkey";

-- DropForeignKey
ALTER TABLE "_likedBlogs" DROP CONSTRAINT "_likedBlogs_B_fkey";

-- DropTable
DROP TABLE "_likedBlogs";

-- CreateTable
CREATE TABLE "LikesOnBlogs" (
    "userId" INTEGER NOT NULL,
    "blogId" INTEGER NOT NULL,

    CONSTRAINT "LikesOnBlogs_pkey" PRIMARY KEY ("userId","blogId")
);

-- AddForeignKey
ALTER TABLE "LikesOnBlogs" ADD CONSTRAINT "LikesOnBlogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikesOnBlogs" ADD CONSTRAINT "LikesOnBlogs_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
