"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

const targetAmount = 12000000;
const initialAmount = 3840000;
const quickAmounts = [1000, 5000, 10000, 50000];
const rotationFrames = [
  "/porsche-911-cinematic.png",
  "/porsche-911-rotation-front-side.png",
  "/porsche-911-rotation-left.png",
  "/porsche-911-rotation-rear-left.png",
  "/porsche-911-rotation-rear.png",
  "/porsche-911-rotation-rear-right.png",
  "/porsche-911-rotation-right.png",
  "/porsche-911-rotation-front-return.png",
  "/porsche-911-cinematic.png",
];

const pesoFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

function formatPeso(amount: number) {
  return pesoFormatter.format(amount).replace("PHP", "\u20B1").trim();
}

function Header({
  percentage,
  overlay = false,
}: {
  percentage: number;
  overlay?: boolean;
}) {
  return (
    <header className={`${overlay ? "absolute inset-x-0 top-0" : "relative"} z-20 mx-auto flex w-full max-w-[1400px] items-center justify-between px-5 py-6 sm:px-8 lg:px-10 lg:py-8`}>
      <a href="#top" className="text-[0.58rem] font-bold uppercase tracking-[0.38em] text-white sm:text-[0.65rem]">
        Dream 911
      </a>
      <div className="flex items-center gap-3 text-[0.55rem] font-bold uppercase tracking-[0.24em] text-sky-400 sm:gap-4 sm:text-[0.62rem]">
        <span>{Math.round(percentage)}% Funded</span>
        <span className="h-px w-10 bg-sky-400/80 sm:w-16" />
      </div>
    </header>
  );
}

function ShowroomBackground({ percentage, scrollProgress }: { percentage: number; scrollProgress: number }) {
  const framePosition = scrollProgress * (rotationFrames.length - 1);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#05090c]" aria-hidden="true">
      {rotationFrames.map((source, index) => {
        const opacity = Math.max(0, 1 - Math.abs(framePosition - index));

        return (
          <div key={`${source}-${index}`} className="absolute inset-0 transition-opacity duration-75 ease-linear" style={{ opacity, willChange: "opacity" }}>
            <img src={source} alt="" className="h-full w-full object-fill grayscale" />
            <img
              src={source}
              alt=""
              className="absolute inset-0 h-full w-full object-fill saturate-[1.8] contrast-110"
              style={{ clipPath: `inset(0 ${100 - percentage}% 0 0)` }}
            />
            <div className="absolute inset-0 bg-[#0065d8]/65 mix-blend-color" style={{ clipPath: `inset(0 ${100 - percentage}% 0 0)` }} />
            <div className="absolute inset-0 bg-black/35 backdrop-grayscale" style={{ clipPath: `inset(0 0 0 ${percentage}%)` }} />
          </div>
        );
      })}
      <div className="absolute inset-y-0 w-0.5 bg-sky-400 shadow-[0_0_10px_#24afff,0_0_25px_rgba(36,175,255,0.6)] transition-[left] duration-700 ease-out" style={{ left: `${percentage}%` }} />
      <div className="showroom-vignette absolute inset-0" />
    </div>
  );
}

function Hero({ percentage }: { percentage: number }) {
  return (
    <section className="relative z-10 min-h-[100dvh] w-full text-center">
      <Header percentage={percentage} overlay />
      <div className="absolute inset-x-4 top-[22%] mx-auto max-w-4xl text-center sm:top-[20%]">
        <p className="text-[0.5rem] font-medium uppercase tracking-[0.38em] text-[#b2bac0] sm:text-[0.66rem]">
          One peso closer to the keys.
        </p>
        <h1 className="mt-2 text-[clamp(1.9rem,4.4vw,4.15rem)] font-black uppercase leading-[0.9] text-[#f4f6f7]">
          Help Me Buy My
          <br />
          <span className="text-sky-400 [text-shadow:0_0_22px_rgba(25,159,255,0.28)]">Dream Car</span>
        </h1>
        <p className="mt-2 text-[0.48rem] font-medium tracking-[0.12em] text-[#a0a7ad] sm:text-xs">
          Porsche 911 - A dream built through discipline, one step at a time.
        </p>
      </div>
      <div className="absolute inset-x-4 bottom-[7%]">
        <p className="text-[0.58rem] font-semibold uppercase tracking-[0.34em] text-[#b2bac0] sm:text-[0.68rem]">Porsche 911 GT3</p>
        <p className="mt-2 text-[clamp(2rem,3.3vw,3.5rem)] font-bold leading-none tracking-tight text-[#f4f6f7]">{formatPeso(targetAmount)}</p>
      </div>
    </section>
  );
}

function SavingsProgress({ currentAmount, percentage }: { currentAmount: number; percentage: number }) {
  return (
    <section className="relative z-10 mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-10" aria-label="Savings progress">
      <div className="flex min-w-0 flex-col gap-5 rounded-2xl border border-white/10 bg-[#080d11]/85 px-5 py-5 shadow-[0_22px_70px_rgba(0,0,0,0.28)] sm:px-7 sm:py-6 lg:flex-row lg:items-center lg:gap-8">
        <div className="min-w-0 lg:w-[21%] lg:shrink-0">
          <p className="text-2xl font-bold tabular-nums tracking-tight text-sky-400 sm:text-3xl">{formatPeso(currentAmount)}</p>
          <p className="mt-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-[#606a72]">Collected</p>
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#20272c]" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(percentage)} aria-label="Dream 911 funding progress">
            <div className="h-full rounded-full bg-[linear-gradient(90deg,#138dff,#36b7ff)] shadow-[0_0_16px_rgba(54,183,255,0.65)] transition-[width] duration-700 ease-out" style={{ width: `${percentage}%` }} />
          </div>
          <span className="w-12 text-right text-sm font-bold tabular-nums text-[#f4f6f7]">{Math.round(percentage)}%</span>
        </div>
        <div className="min-w-0 text-left lg:w-[21%] lg:shrink-0 lg:text-right">
          <p className="text-xl font-bold tabular-nums tracking-tight text-[#f4f6f7] sm:text-2xl">{formatPeso(targetAmount)}</p>
          <p className="mt-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-[#606a72]">Goal</p>
        </div>
      </div>
    </section>
  );
}

function AddFunds({ onAddFunds, disabled }: { onAddFunds: (amount: number) => void; disabled: boolean }) {
  const [inputValue, setInputValue] = useState("10000");
  const selectedAmount = () => Number(inputValue.replace(/[^\d]/g, ""));

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = selectedAmount();
    if (amount > 0) {
      onAddFunds(amount);
      setInputValue("10000");
    }
  }

  function handleQuickAmount(amount: number) {
    setInputValue(String(Math.max(selectedAmount(), 0) + amount));
  }

  return (
    <section className="relative z-10 mx-auto mt-16 w-full max-w-[1400px] px-5 sm:mt-20 sm:px-8 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(25rem,34rem)] lg:items-end lg:gap-16">
        <div className="max-w-xl text-left lg:pb-2">
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.32em] text-sky-400">Why this fund matters</p>
          <h2 className="mt-4 max-w-md text-3xl font-bold leading-[1.05] tracking-tight text-[#f4f6f7] sm:text-4xl">A focused plan for the car I&apos;m working toward.</h2>
          <p className="mt-5 max-w-lg text-sm leading-7 text-[#adb6bc] sm:text-base">This fund turns a long-term goal into small, visible commitments. Every peso recorded here makes the Porsche 911 GT3 more intentional, more accountable, and closer to reality.</p>
          <p className="mt-5 border-l border-sky-400/70 pl-4 text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-[#d8e0e4]">Built through discipline, one contribution at a time.</p>
        </div>
        <form onSubmit={handleSubmit} className="w-full rounded-xl border border-white/12 bg-[#080d11]/90 p-5 shadow-[0_22px_70px_rgba(0,0,0,0.32)] backdrop-blur-sm sm:p-6 lg:justify-self-end">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-[#f4f6f7]">Add to My Dream Fund</h2>
              <p className="mt-2 text-xs leading-5 text-[#7d8991]">Choose an amount and log the next step.</p>
            </div>
            <span className="mt-0.5 shrink-0 border border-sky-400/25 bg-sky-400/10 px-2.5 py-1 text-[0.56rem] font-bold uppercase tracking-[0.18em] text-sky-300">Secure</span>
          </div>
          <label className="mt-5 block min-w-0">
            <span className="mb-2 block text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-[#73808a]">Peso amount</span>
            <span className="flex h-11 items-center rounded-lg border border-white/10 bg-black/25 px-3 transition-colors focus-within:border-sky-400">
              <span className="mr-3 text-[#8b949b]">{"\u20B1"}</span>
              <input type="text" inputMode="numeric" pattern="[0-9,]*" value={inputValue} onChange={(event) => setInputValue(event.target.value.replace(/[^\d]/g, ""))} disabled={disabled} className="min-w-0 flex-1 border-0 bg-transparent text-sm font-medium tabular-nums text-white outline-none disabled:text-[#606a72]" aria-describedby="amount-help" />
            </span>
          </label>
          <div className="mt-3 grid min-w-0 grid-cols-4 gap-2">
            {quickAmounts.map((amount) => (
              <button key={amount} type="button" disabled={disabled} onClick={() => handleQuickAmount(amount)} className="h-10 rounded-md border border-white/10 bg-[#10161b] px-2 text-[0.62rem] font-semibold uppercase tracking-[0.06em] text-[#f4f6f7] transition-colors hover:border-sky-400 hover:text-sky-300 disabled:cursor-not-allowed disabled:text-[#606a72]">
                +{formatPeso(amount).replace(",000", "K")}
              </button>
            ))}
          </div>
          <button type="submit" disabled={disabled || selectedAmount() <= 0} className="mt-3 h-11 w-full rounded-lg bg-[#2196ff] px-5 text-xs font-bold uppercase tracking-[0.14em] text-[#04101a] transition-colors hover:bg-[#3aaeff] disabled:cursor-not-allowed disabled:bg-[#20272c] disabled:text-[#606a72]">
            Add Money
          </button>
          <p id="amount-help" className="sr-only">Enter the amount in Philippine pesos to add to the current savings.</p>
        </form>
      </div>
    </section>
  );
}

function RemainingBalance({ funded, remainingAmount }: { funded: boolean; remainingAmount: number }) {
  return (
    <section className="relative z-10 mx-auto w-full max-w-[1400px] px-5 pb-14 pt-5 sm:px-8 sm:pb-20 sm:pt-6 lg:px-10">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#080d11]/75 px-5 py-5 sm:px-7 sm:py-6">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.025),transparent)]" />
        <div className="relative grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="flex items-center gap-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-sky-400/25 bg-sky-400/10 text-sm font-bold text-sky-400" aria-hidden="true">$</div>
            <div>
              <p className="text-xl font-bold tabular-nums tracking-tight text-[#f4f6f7] sm:text-2xl">{funded ? "The 911 is fully funded." : formatPeso(remainingAmount)}</p>
              <p className="mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-[#606a72]">{funded ? "Goal reached" : "Still to go"}</p>
            </div>
          </div>
          <div className="text-left sm:max-w-56 sm:text-right">
            <p className="text-[0.56rem] font-semibold uppercase leading-relaxed tracking-[0.2em] text-[#8b949b]">Big dreams are just small steps done consistently.</p>
            <span className="mt-2 ml-0 block h-px w-10 bg-sky-400 sm:ml-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [currentAmount, setCurrentAmount] = useState(initialAmount);
  const [scrollProgress, setScrollProgress] = useState(0);
  const progressPercentage = useMemo(() => Math.min((currentAmount / targetAmount) * 100, 100), [currentAmount]);
  const remainingAmount = Math.max(targetAmount - currentAmount, 0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let animationFrame = 0;
    const updateScrollProgress = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        setScrollProgress(maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0);
      });
    };

    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", updateScrollProgress);
    };
  }, []);

  function addFunds(amount: number) {
    setCurrentAmount((current) => Math.min(current + amount, targetAmount));
  }

  return (
    <main id="top" className="showroom-shell relative min-h-screen overflow-x-hidden text-[#f4f6f7]">
      <ShowroomBackground percentage={progressPercentage} scrollProgress={scrollProgress} />
      <Hero percentage={progressPercentage} />
      <SavingsProgress currentAmount={currentAmount} percentage={progressPercentage} />
      <AddFunds onAddFunds={addFunds} disabled={currentAmount >= targetAmount} />
      <RemainingBalance funded={currentAmount >= targetAmount} remainingAmount={remainingAmount} />
    </main>
  );
}
