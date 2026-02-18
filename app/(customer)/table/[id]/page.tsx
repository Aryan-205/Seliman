"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCartStore } from "@/store";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TablePage() {
  const params = useParams();
  const router = useRouter();
  const tableId = params.id as string;
  const setTableNumber = useCartStore((s) => s.setTableNumber);

  useEffect(() => {
    setTableNumber(tableId);
  }, [tableId, setTableNumber]);

  return (
    <div 
      className="w-full flex flex-col items-center justify-center h-screen px-4"
      style={{
        backgroundImage: "url('/KissoJapaneseRestaurantatTheWestinGrandeSukhumvit1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <p className="text-white mb-2 backdrop-blur-sm">You're at</p>
        <h1 className="text-4xl font-bold text-[#A00000] mb-2 backdrop-blur-sm">Table {tableId}</h1>
        <p className="text-white mb-8 font-medium backdrop-blur-sm">
          Your table number is saved. Open the menu to start ordering.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/menu">Open Menu</Link>
          </Button>
          <Button size="lg" variant="outline" onClick={() => router.back()}>
            Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
