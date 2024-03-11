import { currentUser } from "@clerk/nextjs";
import prisma from "../lib/db";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { groq } from "next-sanity";
import { sanityClient } from "@/sanity";
import CoursePostComponent from "@/components/CoursePostComponent";

type Props = {};

export const metadata = {
  title: "Courses | Animal Haven",
  description:
    "This is the courses section of Animal Haven where you can access all our premium courses.",
};

async function getData(userId: string) {
  noStore();
  const data = await prisma.subscription.findUnique({
    where: {
      userId: userId,
    },
    select: {
      status: true,
    },
  });

  if (!(data?.status === "active")) {
    return redirect("/pending");
  }
}

const allPostsQuery = groq`
*[_type == 'course']{
  ...,
  author->,
  categories[]->
} | order(_createdAt desc)
`;

const Courses = async (props: Props) => {
  const user = await currentUser();
  await getData(user?.id as string);
  const allPosts = await sanityClient.fetch(allPostsQuery);

  return (
    <section className="max-w-4xl mx-auto">
      <section className="my-10 px-10">
        <div className="my-5">
          <p className="sm:text-4xl text-3xl font-bold">
            Premium Courses to cater all your needs
          </p>
          <p className="text-sm max-w-[750px] mt-2">
            Our passion for pets drives us to provide top-notch training and
            care courses for pet owners like you! Whether you&apos;re a
            first-time pet parent or a seasoned enthusiast, our courses are
            designed to empower you with the knowledge and skills needed to
            foster a strong and loving bond with your furry companions.
          </p>
        </div>
        <CoursePostComponent posts={allPosts} />
      </section>
    </section>
  );
};
export default Courses;
