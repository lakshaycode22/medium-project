-- DropForeignKey
ALTER TABLE "LikesOnBlogs" DROP CONSTRAINT "LikesOnBlogs_blogId_fkey";

-- DropForeignKey
ALTER TABLE "LikesOnBlogs" DROP CONSTRAINT "LikesOnBlogs_userId_fkey";

-- AddForeignKey
ALTER TABLE "LikesOnBlogs" ADD CONSTRAINT "LikesOnBlogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikesOnBlogs" ADD CONSTRAINT "LikesOnBlogs_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
