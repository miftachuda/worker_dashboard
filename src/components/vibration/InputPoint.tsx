import React from "react";
import { NumberInput } from "@chakra-ui/react";

export default function InputPoint({ callback, initvalue }) {
  return (
    <NumberInput.Root
      size="sm"
      maxW="24"
      step={0.01}
      min={0}
      max={99}
      defaultValue={String(initvalue ?? 0)} // ⬅ KUNCI: selalu string
      allowMouseWheel
      formatOptions={{
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }}
      onValueChange={(details) => {
        const v = details.value ?? "";
        const safe = v.trim() === "" ? "0.00" : v;
        callback(safe);
      }}
    >
      <NumberInput.Input fontSize="xl" _focus={{ borderColor: "lime" }} />
      <NumberInput.Control>
        <NumberInput.IncrementTrigger />
        <NumberInput.DecrementTrigger />
      </NumberInput.Control>
    </NumberInput.Root>
  );
}
