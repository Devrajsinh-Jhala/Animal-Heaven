import { Button } from "@/components/ui/button";
import Link from "next/link";

import LandingSections from "@/components/HomePage";
import { Dog, PawPrint } from "lucide-react";

export default async function Home() {
  return (
    <section className="flex max-w-6xl mx-auto flex-col items-center justify-center bg-background overflow-y-auto">
      <div className="flex px-10 flex-col items-center justify-center space-y-5 h-[90vh]">
        <h1 className="text-3xl font-extrabold tracking-tight lg:text-6xl">
          Welcome to Animal Heaven
        </h1>
        <p className="max-w-2xl mx-auto text-center">
          Explore our courses, delve into captivating blogs, and join our
          vibrant community. Expand your knowledge, connect with like-minded
          individuals, and make a positive impact on the lives of animals.
        </p>
        <Button variant={"default"} asChild size={"lg"}>
          <Link
            href={"/pricing"}
            className="flex items-center justify-center gap-4"
          >
            <Dog />
            <p>Subscribe Now</p>
          </Link>
        </Button>
      </div>

      <section className=" mb-10  w-full ">
        <LandingSections />
      </section>
    </section>
  );
}
