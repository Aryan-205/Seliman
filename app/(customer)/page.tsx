"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { UtensilsCrossed, QrCode, Clock, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const bentoItems = [
  {
    title: "Digital Menu",
    description: "Browse our full menu with photos and descriptions. Order from your table.",
    icon: UtensilsCrossed,
    href: "/menu",
    className: "col-span-2 row-span-2 md:col-span-1 bg-primary/10 dark:bg-primary/20 border-primary/20",
  },
  {
    title: "Scan & Order",
    description: "Scan the QR code at your table to order. No app download required.",
    icon: QrCode,
    href: "/menu",
    className: "col-span-2 md:col-span-1 bg-muted/50",
  },
  {
    title: "Reserve a Table",
    description: "Book your spot for lunch or dinner. We look forward to serving you.",
    icon: Clock,
    href: "/booking",
    className: "col-span-2 md:col-span-1 bg-muted/50",
  },
  {
    title: "Find Us",
    description: "Visit us in the heart of the city. Ample parking available.",
    icon: MapPin,
    href: "/location",
    className: "col-span-2 bg-card border",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10" />
        <div className="container relative px-4 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Order from your table.
              <span className="text-primary"> No wait.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Scan the QR code, browse our menu, and send your order to the kitchen. 
              Fresh food, seamless experience.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/menu">
                  View Menu
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/booking">Book a Table</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="container px-4 py-16 md:py-24">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6"
        >
          {bentoItems.map((bento) => (
            <motion.div
              key={bento.title}
              variants={item}
              className={cn(
                "group rounded-2xl p-6 transition-colors",
                bento.className
              )}
            >
              <Link href={bento.href} className="block h-full">
                <bento.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg">{bento.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {bento.description}
                </p>
                <span className="mt-4 inline-flex items-center text-sm font-medium text-primary group-hover:underline">
                  Learn more
                  <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/30 py-16">
        <div className="container px-4 text-center">
          <h2 className="text-2xl font-semibold">Ready to order?</h2>
          <p className="mt-2 text-muted-foreground">
            Scan the QR code at your table or open the menu on any device.
          </p>
          <Button className="mt-6" size="lg" asChild>
            <Link href="/menu">Open Menu</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
