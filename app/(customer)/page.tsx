"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { UtensilsCrossed, Bell, Clock, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Herosection from "@/components/landing/Herosection";
import InfoSection from "@/components/landing/InfoSection";
import CardSection from "@/components/landing/CardSection";
import SingleImageSection from "@/components/landing/SingleImageSection";
import DualCardSection from "@/components/landing/DualCardSection";
import TextSection from "@/components/landing/TextSection";
import MenuCardSection from "@/components/landing/MenuCardSection";
import JapaneseTextSection from "@/components/landing/JapaneseTextSection";
import Footer from "@/components/landing/Footer";

const bentoItems = [
  {
    title: "Digital Menu",
    description: "Browse our full menu with photos and descriptions. Order from your table.",
    icon: UtensilsCrossed,
    href: "/menu",
    className: "col-span-2 row-span-2 md:col-span-1 bg-primary/10 dark:bg-primary/20 border-primary/20",
  },
  {
    title: "Request Waiter",
    description: "Need assistance? Request a waiter to come to your table.",
    icon: Bell,
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
    <div className="flex flex-col w-full">
      {/* Hero */}
      <Herosection />
      <InfoSection />
      <CardSection />

      <SingleImageSection image="/BackgroundImage1.jpg" />
      <SingleImageSection image="/BackgroundImage2.jpg" />

      <DualCardSection />

      <TextSection />

      {/* <MenuCardSection /> */}

      <JapaneseTextSection />
      <Footer />

      {/* Bento Grid */}
      <section className="w-full py-16 md:py-24 h-screen flex items-center justify-center px-12">
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
        <div className="w-full px-4 text-center">
          <h2 className="text-2xl font-semibold">Ready to order?</h2>
          <p className="mt-2 text-muted-foreground">
            Open the menu on any device. At your table? Request a waiter anytime.
          </p>
          <Button className="mt-6" size="lg" asChild>
            <Link href="/menu">Open Menu</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
