"use client";

import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function BookingPage() {
  return (
    <div className="container px-4 py-12 max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Reserve a Table</h1>
        <p className="text-muted-foreground mb-8">
          Book your spot for lunch or dinner. We'll confirm via email.
        </p>
        <form className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Date
              </label>
              <Input type="date" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" /> Time
              </label>
              <Input type="time" required />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Party size</label>
            <Input type="number" min={1} max={20} placeholder="2" defaultValue={2} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input placeholder="Your name" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" placeholder="you@example.com" required />
          </div>
          <Button type="submit" className="w-full" size="lg">
            Request reservation
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
