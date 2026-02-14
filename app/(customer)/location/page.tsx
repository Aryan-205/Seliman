"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Phone } from "lucide-react";

export default function LocationPage() {
  return (
    <div className="w-full px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-2">Find Us</h1>
        <p className="text-muted-foreground mb-8">
          Visit us in the heart of the city. We can't wait to serve you.
        </p>
        <div className="rounded-xl border bg-card p-6 space-y-6">
          <div className="flex gap-4">
            <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold">Address</h3>
              <p className="text-muted-foreground">
                123 Restaurant Street
                <br />
                City, State 12345
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold">Hours</h3>
              <p className="text-muted-foreground">
                Mon – Fri: 11:00 – 22:00
                <br />
                Sat – Sun: 10:00 – 23:00
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold">Contact</h3>
              <p className="text-muted-foreground">+1 (555) 123-4567</p>
            </div>
          </div>
        </div>
        <div className="mt-8 aspect-video w-full rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
          Map placeholder – integrate Google Maps or Mapbox here
        </div>
      </motion.div>
    </div>
  );
}
