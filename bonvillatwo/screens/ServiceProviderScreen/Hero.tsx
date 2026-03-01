"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Hero() {
  const isMobile = window.innerWidth < 768;

  const media = [
    "https://plus.unsplash.com/premium_photo-1669675936121-6d3d42244ab5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2Fsb258ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2Fsb258ZW58MHx8MHx8fDA%3D",

    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2Fsb258ZW58MHx8MHx8fDA%3D",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % media.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [media.length]);

  return (
    <main className="relative w-full h-[90vh] md:h-[80vh]">
      <AnimatePresence>
        <motion.div
          key={index} // important
          initial={{ opacity: 0, x: 100, scale: -0.5 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -100, scale: 0.5 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={media[index]}
            alt={`hero image ${index}`}
            fill
            className="object-cover rounded-3xl"
            priority
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex md:flex-row flex-col gap-5 justify-end md:justify-between md:items-end p-4 rounded-3xl text-tertiary-c bg-linear-to-b from-black/50 to-black/90 ">
        <div className=" flex flex-col gap-2 ">
          <h1 className="text-xl md:text-4xl font-bold text-primary-c">
            Jasmyne Naturalle International
          </h1>
          <p className="md:text-lg font-light text-secondary">
            1, Raji Oba Bus Stop, Alimosho, Lagos
          </p>
          <div className="flex gap-2 items-center">
            <div className="flex items-center text-primary-c gap-1">
              <Star />
              <p className="text-lg font-semibold ">4.95</p>
              <p className="text-lg text-nowrap font-light text-tertiary-c">
                (438 Reviews)
              </p>
            </div>
            <Badge className="h-fit" variant={"secondary"}>
              Recommended
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button className="bg-secondary-c text-primary-c">
              Send A Message
            </Button>
            <Button className="bg-secondary-c text-primary-c">
              Book Your Appointment
            </Button>
          </div>
        </div>

        {!isMobile && (
          <div className="flex flex-col md:items-end items-start">
            <p className="text-sm md:text-base">
              Jasmyne Naturalle International is currently open
            </p>
            <Button className="bg-secondary-c text-primary-c">
              Check their Buisness Hours
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
