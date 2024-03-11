import { currentUser } from "@clerk/nextjs";
import prisma from "../lib/db";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";

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

const Courses = async (props: Props) => {
  const user = await currentUser();
  await getData(user?.id as string);

  return <div>Courses</div>;
};
export default Courses;
