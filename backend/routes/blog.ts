import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, sign, verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "@lakshaycode22/medium-common";

const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: String;
  };
}>();

// authentication middleware
blogRouter.use("/*", async (c, next) => {
  const token = c.req.header("authorization") || "";
  const user = await verify(token, c.env.JWT_SECRET);
  if (user) {
    c.set("userId", user.id);
    await next();
  } else {
    c.status(403);
    return c.json({
      message: "You are not logged in. Please login to access this resource",
    });
  }
});

//creating a new blog
blogRouter.post("/", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const { success } = createBlogInput.safeParse(body);
    if (!success) {
      throw new Error("invalid inputs");
    }
    const authorId = c.get("userId");
    const blog = await prisma.blog.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: Number(authorId),
      },
    });
    return c.json({
      message: "blog created successfully",
      id: blog.id,
    });
  } catch (error) {
    c.status(411);
    return c.text("There is an error in this route :" + error);
  }
});

//updating an existing blog
blogRouter.put("/", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const { success } = updateBlogInput.safeParse(body);
    if (!success) {
      throw new Error("invalid inputs");
    }
    const blog = await prisma.blog.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });
    return c.json({
      message: "blog updated successfully",
      id: blog.id,
    });
  } catch (error) {
    c.status(411);
    return c.text("There is an error in this route :" + error);
  }
});

//getting all the blogs
blogRouter.get("/bulk", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const blogs = await prisma.blog.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    return c.json({
      message: "blogs found",
      blogs,
    });
  } catch (error) {
    c.status(411);
    return c.text("There is an error in this route :" + error);
  }
});

//getting a single blog
blogRouter.get("/:id", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const id = Number(c.req.param("id"));
    const blog = await prisma.blog.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        likedBy: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!blog) throw new Error("Blog not found");

    let like = false;
    blog.likedBy.forEach((liked) => {
      if (liked.userId === Number(c.get("userId"))) like = true;
    });

    return c.json({
      message: "blog found",
      blog,
      like,
    });
  } catch (error) {
    c.status(411);
    return c.text("There is an error in this route :" + error);
  }
});

// liking a blog
blogRouter.post("/like/:id", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const id = Number(c.req.param("id"));
    const blog = await prisma.blog.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        likedBy: {
          where: {
            userId: Number(c.get("userId")),
          },
        },
      },
    });

    if (!blog) throw new Error("Blog not found");

    if (blog.likedBy.length === 0) {
      await prisma.likesOnBlogs.create({
        data: {
          userId: Number(c.get("userId")),
          blogId: id,
        },
      });
    }

    return c.json({
      message: "You have liked this blog",
    });
  } catch (error) {
    c.status(411);
    return c.text("There is an error in this route :" + error);
  }
});

// unliking a blog
blogRouter.delete("/unlike/:id", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const id = Number(c.req.param("id"));
    const blog = await prisma.blog.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        likedBy: {
          where: {
            userId: Number(c.get("userId")),
          },
        },
      },
    });

    if (!blog) throw new Error("Blog not found");

    if (blog.likedBy.length !== 0) {
      await prisma.likesOnBlogs.deleteMany({
        where: {
          userId: Number(c.get("userId")),
          blogId: id,
        },
      });
    }

    return c.json({
      message: "You have unliked this blog",
    });
  } catch (error) {
    c.status(411);
    return c.text("There is an error in this route :" + error);
  }
});

//deleting a blog
blogRouter.delete("/delete/:id", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const blogId = Number(c.req.param("id"));
    const userId = Number(c.get("userId"));

    const blog = await prisma.blog.findFirst({
      where: { id: blogId },
    });

    if (!blog) throw new Error("This blog doesn't exist");
    if (blog.authorId !== userId)
      throw new Error("You are not the author of this blog");

    await prisma.blog.delete({
      where: {
        id: blogId,
      },
    });

    return c.json({
      message: "blog deleted successfully",
    });
  } catch (error) {
    c.status(411);
    return c.text("There is an error in this route :" + error);
  }
});

export default blogRouter;
