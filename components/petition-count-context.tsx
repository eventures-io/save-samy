"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type PetitionCountContextValue = {
  count: number;
  goal: number;
  increment: () => void;
};

const PetitionCountContext = createContext<PetitionCountContextValue | null>(
  null,
);

export function PetitionCountProvider({
  initialCount,
  goal,
  children,
}: {
  initialCount: number;
  goal: number;
  children: ReactNode;
}) {
  const [count, setCount] = useState(initialCount);
  const increment = useCallback(() => setCount((c) => c + 1), []);

  return (
    <PetitionCountContext.Provider value={{ count, goal, increment }}>
      {children}
    </PetitionCountContext.Provider>
  );
}

export function usePetitionCount() {
  const ctx = useContext(PetitionCountContext);
  if (!ctx) {
    throw new Error("usePetitionCount must be used within PetitionCountProvider");
  }
  return ctx;
}
