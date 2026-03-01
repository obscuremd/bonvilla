"use client";

import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export default function TimeScale() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  // Generate time labels 00:00 → 23:30
  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hours = Math.floor(i / 2);
    const mins = i % 2 === 0 ? "00" : "30";
    return `${String(hours).padStart(2, "0")}:${mins}`;
  });

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="mx-auto w-full max-w-sm">
      <Carousel
        setApi={setApi}
        className="w-full max-w-sm"
        opts={{ loop: true }}
      >
        <CarouselContent className="py-3 flex items-center">
          {timeSlots.map((label, index) => (
            <CarouselItem key={index} className="basis-[25%] items-center">
              <Button
                size={index !== current - 1 ? "sm" : "default"}
                className={cn(
                  "transition-transform duration-500",
                  index !== current - 1
                    ? " text-lg bg-muted text-muted-foreground"
                    : "  text-xl bg-secondary-c text-primary-c"
                )}
              >
                {label}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
