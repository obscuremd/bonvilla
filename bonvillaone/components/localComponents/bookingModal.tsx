"use client";
import { useState, useEffect } from "react";
import { DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import TimeScale from "./timeScale";
import { Input } from "../ui/input";
import { CheckCheck } from "lucide-react";

export function BookingModal({
  title,
  description,
  price,
  time,
  closeModal,
}: {
  title: string;
  description: string;
  price: number;
  time: number;
  closeModal: () => void;
}) {
  const [step, setStep] = useState(0);

  function handleFinish() {
    console.log("FINISHED FLOW");
    setStep(0);
    closeModal();
  }

  return (
    <DialogContent className="flex flex-col gap-12 items-center w-full">
      {step === 0 && <Step1 title={title} description={description} />}
      {step === 1 && <Step2 />}
      {step === 2 && <Step3 />}

      {step !== 2 && (
        <FooterBar
          price={price}
          time={time}
          leftAction={step > 0 ? () => setStep(step - 1) : undefined}
          rightAction={() => setStep(step + 1)}
          rightText="Continue"
          leftText="Back"
        />
      )}

      {step === 2 && (
        <Button
          onClick={handleFinish}
          className="w-full bg-secondary-c text-primary-c"
        >
          Done
        </Button>
      )}
    </DialogContent>
  );
}

function Step1({ title, description }: { title: string; description: string }) {
  return (
    <>
      <p>Let’s Schedule You in . . .</p>
      <TimeScale />
      <div className="bg-muted p-3 rounded-3xl">
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-sm">{description}</p>
      </div>
    </>
  );
}

function Step2() {
  return (
    <>
      <p>Let’s Schedule You in . . .</p>
      <p>You don’t have an account with us yet…</p>
      <Input placeholder="Full Name" />
      <Input placeholder="Phone Number" />
      <Input placeholder="Email" />
    </>
  );
}

function Step3() {
  return (
    <>
      <CheckCheck className="w-[200px] h-[200px] text-primary-c" />
      <p>Appointment Set</p>
      <p>Your appointment has been scheduled.</p>
    </>
  );
}

function FooterBar({
  price,
  time,
  leftAction,
  rightAction,
  rightText,
  leftText,
}: {
  price: number;
  time: number;
  leftAction?: () => void;
  rightAction: () => void;
  leftText?: string;
  rightText: string;
}) {
  return (
    <div className="bg-muted p-3 rounded-3xl w-full flex flex-col items-end gap-3">
      <p className="text-sm flex items-center gap-2">
        Total: <span className="text-lg font-semibold">{price}</span>
      </p>
      <p className="text-sm">11:30 - 12:15</p>

      <div className="flex gap-2 w-full">
        {leftAction && (
          <Button
            onClick={leftAction}
            className="flex-1 bg-gray-300 text-black"
          >
            {leftText}
          </Button>
        )}
        <Button onClick={rightAction} className="flex-1 bg-secondary-c">
          {rightText}
        </Button>
      </div>
    </div>
  );
}
