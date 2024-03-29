import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Smile } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Payment Pending",
};

export default function Pending() {
  return (
    <section className="w-full min-h-[80vh] flex items-center justify-center">
      <Card className="w-[400px]">
        <div className="p-6">
          <div className="w-full flex justify-center">
            <Smile className="w-12 h-12 rounded-full bg-blue-500/30 text-blue-500 p-2" />
          </div>

          <div className="mt-3 text-center sm:mt-5 w-full">
            <h3 className="text-lg leading-6 font-medium">Payment Pending</h3>
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">
                In order to access our premium courses, please subscribe to
                premium. It costs less than a pizza
              </p>
            </div>
            <div className="mt-5 sm:mt-6 w-full">
              <Button className="w-full" asChild>
                <Link href={"/pricing"}>Subscribe Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
