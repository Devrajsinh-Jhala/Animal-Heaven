import { Button } from "@/components/ui/button";
import prisma from "../lib/db";
import { currentUser } from "@clerk/nextjs";
import { getStripeSession, stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import {
  StripePortal,
  StripeSubscriptionCreationButton,
} from "@/components/SubmitButtonComponents";

export const metadata = {
  title: "Pricing | Animal Haven",
  description: "This is the prcing section of Animal Haven",
};

const featureItems = [
  { name: "Unlimited Access to Premium Content" },
  { name: "Notification about latest releases" },
  { name: "Prefrential bookings on any offline event" },
];

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
      domainUrl:
        process.env.NODE_ENV === "production"
          ? (process.env.PRODUCTION_URL as string)
          : "http://localhost:3000",
      priceId: process.env.STRIPE_PRODUCT_ID as string,
    });

    return redirect(subscriptionUrl);
  }

  async function createSubscriptionPortal() {
    "use server";
    const session = await stripe.billingPortal.sessions.create({
      customer: data?.user.stripeCustomerId as string,
      return_url:
        process.env.NODE_ENV === "production"
          ? (process.env.PRODUCTION_URL as string)
          : "http://localhost:3000",
    });
    return redirect(session.url);
  }

  if (data?.status === "active") {
    return (
      // <section>
      //   <section className="">Subscription Portal</section>
      //   <form action={createSubscriptionPortal}>
      //     <Button>Launch Portal</Button>
      //   </form>
      // </section>
      <div className="flex items-center px-4 lg:px-0 h-[90vh] justify-center">
        <section className="">
          <Card className="max-w-lg mx-auto ">
            <CardHeader>
              <CardTitle>Edit Subscription</CardTitle>
              <CardDescription>
                Click on the button below, this will give you the opportunity to
                change your payment details and view your statement at the same
                time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              Our payments system is powered by stripe which offers a
              subscription management service which you can access by clicking
              the button below. You can manage your subscription details, your
              plans etc. You can also cancel your plan any time.
            </CardContent>
            <CardFooter>
              <form action={createSubscriptionPortal}>
                <StripePortal />
              </form>
            </CardFooter>
          </Card>
        </section>
      </div>
    );
  }

  return (
    // <div>
    //   <h1>Pricing</h1>

    // </div>
    <section className="max-w-md mx-auto my-10">
      <Card className="flex flex-col">
        <CardContent className="py-8">
          <div>
            <h3 className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-primary/10 text-primary">
              Monthly
            </h3>
          </div>

          <div className="mt-4 flex items-baseline text-6xl font-extrabold">
            ₹50
            <span className="ml-1 text-2xl text-muted-foreground">/month</span>
          </div>
          <p className="mt-5 text-md text-muted-foreground">
            Upgrade to the pro plan to get access to the exclusive course
            material that will make your journey smoother.
          </p>
        </CardContent>
        <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-secondary rounded-lg m-1 space-y-6 sm:p-10 sm:pt-6">
          <ul className="space-y-4">
            {featureItems.map((item, index) => (
              <li key={index} className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
                <p className="ml-3 text-base">{item.name}</p>
              </li>
            ))}
          </ul>

          <form className="w-full" action={createSubscription}>
            <StripeSubscriptionCreationButton />
          </form>
        </div>
      </Card>
    </section>
  );
};
export default Pricing;
