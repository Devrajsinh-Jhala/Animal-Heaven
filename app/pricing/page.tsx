import { Button } from "@/components/ui/button";
import prisma from "../lib/db";
import { currentUser } from "@clerk/nextjs";
import { getStripeSession, stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";

type Props = {};
async function getData2({
  email,
  id,
  firstName,
  lastName,
}: {
  email: string;
  id: string;
  firstName: string;
  lastName: string;
}) {
  noStore();
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      stripeCustomerId: true,
    },
  });

  if (!user) {
    const name = `${firstName} ${lastName}`;
    await prisma.user.create({
      data: {
        id: id,
        email: email,
        name: name,
      },
    });
  }

  if (!user?.stripeCustomerId) {
    const data = await stripe.customers.create({
      email: email,
    });
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        stripeCustomerId: data.id,
      },
    });
  }
}

async function getData(userId: string) {
  noStore();
  const data = await prisma.subscription.findUnique({
    where: {
      userId: userId,
    },
    select: {
      status: true,
      user: {
        select: {
          stripeCustomerId: true,
        },
      },
    },
  });
  return data;
}
const Pricing = async (props: Props) => {
  const user = await currentUser();
  await getData2({
    email: user?.emailAddresses[0].emailAddress as string,
    firstName: user?.firstName as string,
    lastName: user?.lastName as string,
    id: user?.id as string,
  });
  const data = await getData(user?.id as string);

  async function createSubscription() {
    "use server";
    const dbUser = await prisma.user.findUnique({
      where: {
        id: user?.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    if (!dbUser?.stripeCustomerId) {
      throw new Error("Unable to get stripe customer");
    }
    const subscriptionUrl = await getStripeSession({
      customerId: dbUser.stripeCustomerId,
      domainUrl: "http://localhost:3000",
      priceId: process.env.STRIPE_PRODUCT_ID as string,
    });

    return redirect(subscriptionUrl);
  }

  async function createSubscriptionPortal() {
    "use server";
    const session = await stripe.billingPortal.sessions.create({
      customer: data?.user.stripeCustomerId as string,
      return_url: "http://localhost:3000/",
    });
    return redirect(session.url);
  }

  if (data?.status === "active") {
    return (
      <section>
        <section className="">Subscription Portal</section>
        <form action={createSubscriptionPortal}>
          <Button>Launch Portal</Button>
        </form>
      </section>
    );
  }

  return (
    <div>
      <h1>Pricing</h1>
      <form action={createSubscription}>
        <Button type="submit">Subscribe Now</Button>
      </form>
    </div>
  );
};
export default Pricing;
