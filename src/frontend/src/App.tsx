import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useActor } from "./hooks/useActor";

// ─── Types ───────────────────────────────────────────────────────────────────
type Page =
  | "landing"
  | "letter1"
  | "letter2"
  | "memories-cover"
  | "memories-1"
  | "memories-2"
  | "anniversary"
  | "reply";

// ─── Floating Hearts ─────────────────────────────────────────────────────────
interface HeartParticle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

function useFloatingHearts(count = 18): HeartParticle[] {
  const [hearts] = useState<HeartParticle[]>(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 12 + Math.random() * 24,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 10,
      opacity: 0.2 + Math.random() * 0.5,
    })),
  );
  return hearts;
}

function FloatingHearts({ color = "#c9144c" }: { color?: string }) {
  const hearts = useFloatingHearts(16);
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden
    >
      {hearts.map((h) => (
        <span
          key={h.id}
          className="floating-heart"
          style={{
            left: `${h.x}%`,
            bottom: "-40px",
            fontSize: `${h.size}px`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            opacity: h.opacity,
            color,
          }}
        >
          ♥
        </span>
      ))}
    </div>
  );
}

// ─── Page wrapper ─────────────────────────────────────────────────────────────
function PageWrapper({
  children,
  className = "",
}: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={`page-enter relative w-full h-full ${className}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.65, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

// ─── Page 1: Landing ─────────────────────────────────────────────────────────
function LandingPage({ onNext }: { onNext: () => void }) {
  return (
    <PageWrapper>
      <div className="wine-bg w-full h-full flex flex-col items-center justify-center relative">
        <FloatingHearts color="#f2a7b5" />

        {/* Brand */}
        <div className="mb-8 text-center z-10">
          <p
            className="script-font text-5xl md:text-6xl gold-text mb-1"
            aria-label="From the Heart"
          >
            From the Heart
          </p>
          <p
            className="text-lg md:text-xl"
            style={{ color: "oklch(0.78 0.12 80 / 0.75)" }}
          >
            A message from the depths of my soul ❤️
          </p>
        </div>

        {/* Love word */}
        <div className="z-10 mb-8">
          <p
            className="text-center"
            style={{
              fontSize: "clamp(3rem, 10vw, 6rem)",
              color: "oklch(0.88 0.10 85)",
              textShadow: "0 0 40px oklch(0.78 0.12 80 / 0.4)",
              lineHeight: 1.6,
              fontFamily: "'PlayfairDisplay', serif",
              fontWeight: 700,
            }}
          >
            Love
          </p>
        </div>

        {/* Heart Button */}
        <button
          type="button"
          className="heart-pulse z-10 cursor-pointer border-none bg-transparent"
          onClick={onNext}
          aria-label="Open love letter"
          data-ocid="landing.primary_button"
        >
          <HeartSVG />
        </button>

        {/* Hint */}
        <p
          className="mt-8 z-10 text-center text-sm"
          style={{
            color: "oklch(0.78 0.12 80 / 0.55)",
            fontFamily: "'PlayfairDisplay', serif",
          }}
        >
          Click the heart to begin
        </p>

        {/* Next Button */}
        <button
          type="button"
          className="nav-btn z-10 mt-4"
          onClick={onNext}
          data-ocid="landing.next_button"
        >
          Next →
        </button>
      </div>
    </PageWrapper>
  );
}

function HeartSVG() {
  return (
    <svg
      viewBox="0 0 200 180"
      style={{
        width: "clamp(160px, 40vw, 220px)",
        filter: "drop-shadow(0 0 30px oklch(0.55 0.18 12 / 0.7))",
      }}
      role="img"
      aria-label="Heart"
    >
      <title>Heart</title>
      <defs>
        <radialGradient id="heartGrad" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#e8214e" />
          <stop offset="60%" stopColor="#b3122a" />
          <stop offset="100%" stopColor="#7a0e1f" />
        </radialGradient>
      </defs>
      <path
        d="M100,160 C60,130 10,100 10,60 C10,30 30,10 60,10 C78,10 92,20 100,30 C108,20 122,10 140,10 C170,10 190,30 190,60 C190,100 140,130 100,160 Z"
        fill="url(#heartGrad)"
      />
      <text
        x="100"
        y="92"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="26"
        fontFamily="'PlayfairDisplay', serif"
        fontWeight="600"
      >
        Love
      </text>
    </svg>
  );
}

// ─── Page 2 & 3: Love Letter ─────────────────────────────────────────────────
function LetterPage1({
  onNext,
  onPrev,
}: { onNext: () => void; onPrev: () => void }) {
  return (
    <PageWrapper>
      <div
        className="cream-bg w-full h-full flex flex-col items-center justify-center p-4"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 20%, oklch(0.78 0.12 80 / 0.08) 0%, transparent 60%),radial-gradient(ellipse at 80% 80%, oklch(0.55 0.18 12 / 0.06) 0%, transparent 60%)",
        }}
      >
        {/* Paper card */}
        <div
          className="relative w-full max-w-xl mx-auto rounded-2xl overflow-hidden"
          style={{
            background: "oklch(0.98 0.018 85)",
            boxShadow:
              "0 8px 40px oklch(0.22 0.12 15 / 0.18), 0 2px 8px oklch(0.22 0.12 15 / 0.10)",
            border: "1.5px solid oklch(0.78 0.12 80 / 0.30)",
            maxHeight: "88vh",
          }}
        >
          {/* Gold top border */}
          <div
            className="h-1 w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.78 0.12 80), transparent)",
            }}
          />

          <div
            className="p-6 md:p-8 letter-scroll"
            style={{ maxHeight: "82vh" }}
          >
            {/* Title */}
            <div className="text-center mb-6">
              <p
                className="playfair-font font-bold"
                style={{
                  fontSize: "clamp(1.6rem, 5vw, 2.5rem)",
                  color: "oklch(0.22 0.12 15)",
                }}
              >
                My Letter 💌
              </p>
              <div
                className="mx-auto mt-2"
                style={{
                  height: "2px",
                  width: "80px",
                  background:
                    "linear-gradient(90deg, transparent, oklch(0.78 0.12 80), transparent)",
                }}
              />
              <p
                className="mt-1 text-sm"
                style={{
                  color: "oklch(0.78 0.12 80 / 0.7)",
                  fontFamily: "'PlayfairDisplay', serif",
                }}
              >
                Page 1 / 2
              </p>
            </div>

            {/* Letter body */}
            <div
              style={{
                color: "oklch(0.22 0.06 20)",
                fontSize: "clamp(1rem, 3vw, 1.15rem)",
                fontFamily: "'PlayfairDisplay', serif",
                lineHeight: 1.9,
              }}
            >
              <p
                className="mb-5"
                style={{ fontWeight: 600, fontSize: "1.15em" }}
              >
                My dearest,
              </p>
              <p className="mb-5">
                You are the most beautiful reality of my life. Your smile lights
                up my heart, your voice echoes in my ears like the sweetest
                music. Ever since you came into my life, every single moment has
                felt like heaven.
              </p>
              <p className="mb-5">
                Without you, my world is incomplete. You are the dream I saw
                with open eyes, the prayer my heart whispered. Your presence is
                my greatest treasure.
              </p>
              <p className="mb-4">
                Every morning, you are the first thought in my heart. Every
                night, your memories are what lull me to sleep. You are in my
                every breath, in my every dream, in my very soul.
              </p>
            </div>

            {/* Navigation */}
            <div
              className="flex justify-between items-center mt-6 pt-4"
              style={{ borderTop: "1px solid oklch(0.78 0.12 80 / 0.2)" }}
            >
              <button
                type="button"
                className="nav-btn-cream"
                onClick={onPrev}
                data-ocid="letter1.secondary_button"
              >
                ← Back
              </button>
              <span className="text-2xl" aria-hidden>
                💌
              </span>
              <button
                type="button"
                className="nav-btn-cream"
                onClick={onNext}
                data-ocid="letter1.primary_button"
              >
                Next →
              </button>
            </div>
          </div>

          {/* Gold bottom border */}
          <div
            className="h-1 w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.78 0.12 80), transparent)",
            }}
          />
        </div>
      </div>
    </PageWrapper>
  );
}

function LetterPage2({
  onNext,
  onPrev,
}: { onNext: () => void; onPrev: () => void }) {
  return (
    <PageWrapper>
      <div
        className="cream-bg w-full h-full flex flex-col items-center justify-center p-4"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 80% 20%, oklch(0.78 0.12 80 / 0.08) 0%, transparent 60%),radial-gradient(ellipse at 20% 80%, oklch(0.55 0.18 12 / 0.06) 0%, transparent 60%)",
        }}
      >
        <div
          className="relative w-full max-w-xl mx-auto rounded-2xl overflow-hidden"
          style={{
            background: "oklch(0.98 0.018 85)",
            boxShadow:
              "0 8px 40px oklch(0.22 0.12 15 / 0.18), 0 2px 8px oklch(0.22 0.12 15 / 0.10)",
            border: "1.5px solid oklch(0.78 0.12 80 / 0.30)",
            maxHeight: "88vh",
          }}
        >
          <div
            className="h-1 w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.78 0.12 80), transparent)",
            }}
          />

          <div
            className="p-6 md:p-8 letter-scroll"
            style={{ maxHeight: "82vh" }}
          >
            <div className="text-center mb-6">
              <p
                className="playfair-font font-bold"
                style={{
                  fontSize: "clamp(1.6rem, 5vw, 2.5rem)",
                  color: "oklch(0.22 0.12 15)",
                }}
              >
                My Letter 💌
              </p>
              <div
                className="mx-auto mt-2"
                style={{
                  height: "2px",
                  width: "80px",
                  background:
                    "linear-gradient(90deg, transparent, oklch(0.78 0.12 80), transparent)",
                }}
              />
              <p
                className="mt-1 text-sm"
                style={{
                  color: "oklch(0.78 0.12 80 / 0.7)",
                  fontFamily: "'PlayfairDisplay', serif",
                }}
              >
                Page 2 / 2
              </p>
            </div>

            <div
              style={{
                color: "oklch(0.22 0.06 20)",
                fontSize: "clamp(1rem, 3vw, 1.15rem)",
                fontFamily: "'PlayfairDisplay', serif",
                lineHeight: 1.9,
              }}
            >
              <p className="mb-5">
                Loving you is my most beautiful habit. Every day with you is a
                new story, every moment with you is a new joy.
              </p>
              <p className="mb-5">
                You are my heartbeat, the voice of my soul. Without you, I am
                incomplete.
              </p>
              <p className="mb-6">
                As long as this heart keeps beating, it will keep calling your
                name. As long as these eyes can see, they will keep searching
                for you.
              </p>
            </div>

            {/* I LOVE U */}
            <div className="text-center my-6">
              <div
                className="mx-auto mb-3"
                style={{
                  height: "1px",
                  width: "60%",
                  background:
                    "linear-gradient(90deg, transparent, oklch(0.78 0.12 80 / 0.4), transparent)",
                }}
              />
              <p
                className="playfair-font love-gradient-text"
                style={{
                  fontSize: "clamp(2.5rem, 9vw, 4.5rem)",
                  fontWeight: 800,
                  lineHeight: 1.2,
                  textShadow: "none",
                  letterSpacing: "0.02em",
                }}
              >
                I LOVE U
              </p>
              <div
                className="mx-auto mt-3 mb-5"
                style={{
                  height: "1px",
                  width: "60%",
                  background:
                    "linear-gradient(90deg, transparent, oklch(0.78 0.12 80 / 0.4), transparent)",
                }}
              />
              <p
                className="script-font"
                style={{
                  fontSize: "clamp(1.3rem, 4vw, 1.9rem)",
                  color: "oklch(0.35 0.12 15)",
                  letterSpacing: "0.03em",
                }}
              >
                your mrs. Madeeha 💋💋
              </p>
            </div>

            <div
              className="flex justify-between items-center mt-4 pt-4"
              style={{ borderTop: "1px solid oklch(0.78 0.12 80 / 0.2)" }}
            >
              <button
                type="button"
                className="nav-btn-cream"
                onClick={onPrev}
                data-ocid="letter2.secondary_button"
              >
                ← Back
              </button>
              <span className="text-2xl" aria-hidden>
                💕
              </span>
              <button
                type="button"
                className="nav-btn-cream"
                onClick={onNext}
                data-ocid="letter2.primary_button"
              >
                Next →
              </button>
            </div>
          </div>

          <div
            className="h-1 w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.78 0.12 80), transparent)",
            }}
          />
        </div>
      </div>
    </PageWrapper>
  );
}

// ─── Page 4: Memories Cover ───────────────────────────────────────────────────
function MemoriesCover({
  onNext,
  onPrev,
}: { onNext: () => void; onPrev: () => void }) {
  return (
    <PageWrapper>
      <div className="wine-bg w-full h-full flex flex-col items-center justify-between relative overflow-hidden py-6 px-4">
        <FloatingHearts color="oklch(0.78 0.12 80)" />

        {/* Title */}
        <div className="z-10 text-center mb-4">
          <p
            className="playfair-font gold-text"
            style={{
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
              fontWeight: 700,
              lineHeight: 1.5,
              textShadow: "0 0 30px oklch(0.78 0.12 80 / 0.4)",
            }}
          >
            Our Memories 💫
          </p>
          <p
            className="playfair-font tracking-[0.4em] text-sm md:text-base uppercase"
            style={{ color: "oklch(0.78 0.12 80 / 0.7)" }}
          >
            M E M O R I E S
          </p>
        </div>

        {/* Couple Photo */}
        <div
          className="z-10 relative rounded-2xl overflow-hidden vignette"
          style={{
            width: "clamp(260px, 72vw, 420px)",
            height: "clamp(200px, 44vh, 380px)",
            border: "3px solid oklch(0.78 0.12 80 / 0.5)",
            boxShadow:
              "0 0 60px oklch(0.55 0.18 12 / 0.5), 0 8px 30px oklch(0.10 0.05 15 / 0.5)",
          }}
        >
          <img
            src="/assets/snapchat-1349850177-019d5d60-849d-7041-81c8-6a345536e381.jpg"
            alt="Us together"
            className="w-full h-full object-cover"
          />
          {/* Heart overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, oklch(0.22 0.12 15 / 0.4) 0%, transparent 50%)",
            }}
          />
        </div>

        {/* Navigation */}
        <div className="z-10 flex gap-6 pb-2">
          <button
            type="button"
            className="nav-btn"
            onClick={onPrev}
            data-ocid="memories-cover.secondary_button"
          >
            ← Back
          </button>
          <button
            type="button"
            className="nav-btn"
            onClick={onNext}
            data-ocid="memories-cover.primary_button"
          >
            View Photos →
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}

// ─── Polaroid Photo ───────────────────────────────────────────────────────────
interface PolaroidProps {
  src: string;
  alt: string;
  rotation: number;
  style?: React.CSSProperties;
}

function Polaroid({ src, alt, rotation, style }: PolaroidProps) {
  return (
    <div
      className="polaroid"
      style={{
        transform: `rotate(${rotation}deg)`,
        position: "relative",
        zIndex: 1,
        ...style,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        loading="lazy"
      />
    </div>
  );
}

// ─── Page 5: Memories Gallery 1 ──────────────────────────────────────────────
const gallery1Photos = [
  {
    src: "/assets/snapchat-553234792-019d5d60-8317-7504-ac3a-ea27d41ca34a.jpg",
    alt: "Memory 1",
  },
  {
    src: "/assets/snapchat-1538854795-019d5d60-8629-7710-b9b8-0bb2ce0822a0.jpg",
    alt: "Memory 2",
  },
  {
    src: "/assets/snapchat-709210118-019d5d60-83f6-7299-b2f7-ef60d035b95b.jpg",
    alt: "Memory 3",
  },
  {
    src: "/assets/snapchat-1313570921-019d5d60-84a7-7400-be27-08c9fc704ac9.jpg",
    alt: "Memory 4",
  },
  {
    src: "/assets/snapchat-1569331156-019d5d60-81a2-724c-b510-ebf92fdccc9c.jpg",
    alt: "Memory 5",
  },
  {
    src: "/assets/snapchat-1216204633-019d5d60-85ba-7783-9910-6f0746e182f2.jpg",
    alt: "Memory 6",
  },
];

// Romantic masonry layout configs
const gallery1Layout = [
  { w: "38%", h: "200px", top: "2%", left: "2%", rot: -3 },
  { w: "32%", h: "170px", top: "0%", left: "44%", rot: 2 },
  { w: "20%", h: "180px", top: "1%", right: "2%", rot: -1.5 },
  { w: "30%", h: "190px", top: "44%", left: "4%", rot: 2.5 },
  { w: "36%", h: "195px", top: "42%", left: "38%", rot: -2 },
  { w: "22%", h: "175px", top: "46%", right: "2%", rot: 1.5 },
];

function MemoriesGallery1({
  onNext,
  onPrev,
}: { onNext: () => void; onPrev: () => void }) {
  return (
    <PageWrapper>
      <div className="wine-bg w-full h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div
          className="flex-shrink-0 text-center py-3 px-4 z-20 relative"
          style={{ borderBottom: "1px solid oklch(0.78 0.12 80 / 0.2)" }}
        >
          <p
            className="playfair-font gold-text"
            style={{
              fontSize: "clamp(1.4rem, 4vw, 2.2rem)",
              fontWeight: 700,
              lineHeight: 1.6,
            }}
          >
            Our Memories 💫
          </p>
          <p
            className="text-xs tracking-widest uppercase"
            style={{ color: "oklch(0.78 0.12 80 / 0.5)" }}
          >
            Our Memories · 1 / 2
          </p>
        </div>

        {/* Gallery */}
        <div className="flex-1 relative overflow-hidden">
          {gallery1Photos.map((photo, i) => {
            const l = gallery1Layout[i];
            const style: React.CSSProperties = {
              position: "absolute",
              width: l.w,
              height: l.h,
              top: l.top,
              left: "left" in l ? l.left : undefined,
              right: "right" in l ? (l as { right?: string }).right : undefined,
              zIndex: i + 1,
            };
            return (
              <div key={photo.src} style={style}>
                <Polaroid
                  src={photo.src}
                  alt={photo.alt}
                  rotation={l.rot}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div
          className="flex-shrink-0 flex justify-between items-center px-6 py-3 z-20"
          style={{ borderTop: "1px solid oklch(0.78 0.12 80 / 0.2)" }}
        >
          <button
            type="button"
            className="nav-btn"
            onClick={onPrev}
            data-ocid="gallery1.secondary_button"
          >
            ← Back
          </button>
          <span
            aria-hidden
            style={{ color: "oklch(0.78 0.12 80 / 0.5)", fontSize: "1.5rem" }}
          >
            ♥
          </span>
          <button
            type="button"
            className="nav-btn"
            onClick={onNext}
            data-ocid="gallery1.primary_button"
          >
            Next →
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}

// ─── Page 6: Memories Gallery 2 ──────────────────────────────────────────────
const gallery2Photos = [
  {
    src: "/assets/snapchat-1025556586-019d5d60-85be-7055-921c-9d0de94a7b9e.jpg",
    alt: "Memory 7",
  },
  {
    src: "/assets/snapchat-702733322-019d5d60-85d9-74d6-a3cc-faacf340e8e5.jpg",
    alt: "Memory 8",
  },
  {
    src: "/assets/snapchat-1763693125-019d5d60-85cd-71db-bcd1-6a6efc828ed9.jpg",
    alt: "Memory 9",
  },
  {
    src: "/assets/snapchat-2081899715-019d5d60-83e8-7541-9eee-bdac0f233cc3.jpg",
    alt: "Memory 10",
  },
  {
    src: "/assets/snapchat-2097446663-019d5d60-85a3-72fb-b05c-521f101b6919.jpg",
    alt: "Memory 11",
  },
  {
    src: "/assets/snapchat-855750337-019d5d60-87be-77ec-896d-d8408aecbaf1.jpg",
    alt: "Memory 12",
  },
];

const gallery2Layout = [
  { w: "28%", h: "175px", top: "1%", left: "1%", rot: 2 },
  { w: "40%", h: "210px", top: "0%", left: "31%", rot: -2.5 },
  { w: "26%", h: "185px", top: "2%", right: "1%", rot: 1.5 },
  { w: "34%", h: "195px", top: "44%", left: "3%", rot: -1.5 },
  { w: "28%", h: "180px", top: "45%", left: "39%", rot: 3 },
  { w: "25%", h: "190px", top: "43%", right: "2%", rot: -2 },
];

function MemoriesGallery2({
  onNext,
  onPrev,
}: { onNext: () => void; onPrev: () => void }) {
  return (
    <PageWrapper>
      <div className="wine-bg w-full h-full flex flex-col overflow-hidden">
        <div
          className="flex-shrink-0 text-center py-3 px-4 z-20 relative"
          style={{ borderBottom: "1px solid oklch(0.78 0.12 80 / 0.2)" }}
        >
          <p
            className="playfair-font gold-text"
            style={{
              fontSize: "clamp(1.4rem, 4vw, 2.2rem)",
              fontWeight: 700,
              lineHeight: 1.6,
            }}
          >
            Our Memories 💫
          </p>
          <p
            className="text-xs tracking-widest uppercase"
            style={{ color: "oklch(0.78 0.12 80 / 0.5)" }}
          >
            Our Memories · 2 / 2
          </p>
        </div>

        <div className="flex-1 relative overflow-hidden">
          {gallery2Photos.map((photo, i) => {
            const l = gallery2Layout[i];
            const style: React.CSSProperties = {
              position: "absolute",
              width: l.w,
              height: l.h,
              top: l.top,
              left: "left" in l ? l.left : undefined,
              right: "right" in l ? (l as { right?: string }).right : undefined,
              zIndex: i + 1,
            };
            return (
              <div key={photo.src} style={style}>
                <Polaroid
                  src={photo.src}
                  alt={photo.alt}
                  rotation={l.rot}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            );
          })}
        </div>

        <div
          className="flex-shrink-0 flex justify-between items-center px-6 py-3 z-20"
          style={{ borderTop: "1px solid oklch(0.78 0.12 80 / 0.2)" }}
        >
          <button
            type="button"
            className="nav-btn"
            onClick={onPrev}
            data-ocid="gallery2.secondary_button"
          >
            ← Back
          </button>
          <span
            aria-hidden
            style={{ color: "oklch(0.78 0.12 80 / 0.5)", fontSize: "1.5rem" }}
          >
            ♥
          </span>
          <button
            type="button"
            className="nav-btn"
            onClick={onNext}
            data-ocid="gallery2.primary_button"
          >
            Next →
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}

// ─── Page 7: Anniversary Love Message ────────────────────────────────────────
function AnniversaryPage({
  onNext,
  onPrev,
}: { onNext: () => void; onPrev: () => void }) {
  return (
    <PageWrapper>
      <div className="wine-bg w-full h-full flex flex-col items-center justify-center relative p-4 overflow-hidden">
        <FloatingHearts color="#f2a7b5" />

        <div
          className="relative z-10 w-full max-w-lg mx-auto rounded-2xl overflow-hidden"
          style={{
            background: "oklch(0.18 0.10 15 / 0.85)",
            backdropFilter: "blur(12px)",
            border: "1.5px solid oklch(0.78 0.12 80 / 0.35)",
            boxShadow: "0 0 50px oklch(0.55 0.18 12 / 0.3)",
            maxHeight: "88vh",
          }}
        >
          <div
            className="h-1 w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.78 0.12 80), transparent)",
            }}
          />

          <div
            className="p-6 md:p-8 letter-scroll"
            style={{ maxHeight: "82vh" }}
          >
            {/* Title */}
            <div className="text-center mb-6">
              <p
                className="playfair-font gold-text"
                style={{
                  fontSize: "clamp(2rem, 7vw, 3.5rem)",
                  fontWeight: 700,
                  lineHeight: 1.5,
                }}
              >
                Three Years 🎉
              </p>
              <div
                className="mx-auto mt-2"
                style={{
                  height: "2px",
                  width: "80px",
                  background:
                    "linear-gradient(90deg, transparent, oklch(0.78 0.12 80), transparent)",
                }}
              />
              <p
                className="playfair-font text-xs tracking-widest mt-1 uppercase"
                style={{ color: "oklch(0.78 0.12 80 / 0.6)" }}
              >
                Three Beautiful Years
              </p>
            </div>

            {/* Message */}
            <div
              style={{
                color: "oklch(0.92 0.02 80)",
                fontSize: "clamp(0.95rem, 2.8vw, 1.1rem)",
                fontFamily: "'PlayfairDisplay', serif",
                lineHeight: 1.9,
              }}
            >
              <p
                className="mb-4"
                style={{
                  fontWeight: 600,
                  fontSize: "1.1em",
                  color: "oklch(0.88 0.10 85)",
                }}
              >
                My love,
              </p>
              <p className="mb-4">
                Three years... So much has happened in this time. Together, we
                have created so many memories that will last a lifetime.
              </p>
              <p className="mb-4">
                I could not even imagine this journey without you. You have made
                my life so meaningful and so beautiful.
              </p>
              <p className="mb-6">
                I love you so much, and that love only grows deeper every single
                day. ❤️
              </p>
            </div>

            {/* I love u so much */}
            <div className="text-center mt-2 mb-2">
              <div
                className="mx-auto mb-4"
                style={{
                  height: "1px",
                  width: "70%",
                  background:
                    "linear-gradient(90deg, transparent, oklch(0.78 0.12 80 / 0.4), transparent)",
                }}
              />
              <p
                className="script-font rose-gold-text"
                style={{
                  fontSize: "clamp(2rem, 7vw, 3.2rem)",
                  lineHeight: 1.4,
                }}
              >
                I love u so much ❤️
              </p>
            </div>

            <div
              className="flex justify-between items-center mt-6 pt-4"
              style={{ borderTop: "1px solid oklch(0.78 0.12 80 / 0.2)" }}
            >
              <button
                type="button"
                className="nav-btn"
                onClick={onPrev}
                data-ocid="anniversary.secondary_button"
              >
                ← Back
              </button>
              <span aria-hidden className="text-xl">
                💕
              </span>
              <button
                type="button"
                className="nav-btn"
                onClick={onNext}
                data-ocid="anniversary.primary_button"
              >
                Reply →
              </button>
            </div>
          </div>

          <div
            className="h-1 w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.78 0.12 80), transparent)",
            }}
          />
        </div>
      </div>
    </PageWrapper>
  );
}

// ─── Page 8: Reply Box ────────────────────────────────────────────────────────
function ReplyPage({ onPrev }: { onPrev: () => void }) {
  const { actor } = useActor();
  const [message, setMessage] = useState("");
  const [msgError, setMsgError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: async ({ msgVal }: { msgVal: string }) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.submitReply({ message: msgVal });
    },
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      let valid = true;
      setMsgError("");

      if (!message.trim() || message.trim().length < 10) {
        setMsgError("Please write something (at least 10 characters)");
        valid = false;
      }

      if (valid) {
        mutation.mutate({ msgVal: message.trim() });
      }
    },
    [message, mutation],
  );

  return (
    <PageWrapper>
      <div
        className="cream-bg w-full h-full flex flex-col items-center justify-center p-4"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 30% 30%, oklch(0.55 0.18 12 / 0.07) 0%, transparent 50%),radial-gradient(ellipse at 70% 70%, oklch(0.78 0.12 80 / 0.07) 0%, transparent 50%)",
        }}
      >
        {submitted ? (
          <motion.div
            className="text-center max-w-sm mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            data-ocid="reply.success_state"
          >
            <div className="text-7xl mb-6" aria-hidden>
              💕
            </div>
            <p
              style={{
                fontSize: "clamp(1.5rem, 5vw, 2.2rem)",
                color: "oklch(0.22 0.12 15)",
                fontWeight: 600,
                lineHeight: 1.8,
                fontFamily: "'PlayfairDisplay', serif",
              }}
            >
              Your reply was received! 💕
            </p>
            <p
              style={{
                color: "oklch(0.45 0.05 20)",
                fontSize: "1.1rem",
                lineHeight: 1.8,
                fontFamily: "'PlayfairDisplay', serif",
              }}
            >
              Thank you so much 💕
            </p>
            <p
              className="script-font mt-4"
              style={{ fontSize: "1.8rem", color: "oklch(0.40 0.15 12)" }}
            >
              Thank you, my love ❤️
            </p>
          </motion.div>
        ) : (
          <div
            className="w-full max-w-md mx-auto rounded-2xl overflow-hidden"
            style={{
              background: "oklch(0.98 0.018 85)",
              boxShadow:
                "0 8px 40px oklch(0.22 0.12 15 / 0.15), 0 2px 8px oklch(0.22 0.12 15 / 0.08)",
              border: "1.5px solid oklch(0.78 0.12 80 / 0.30)",
            }}
          >
            <div
              className="h-1 w-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.78 0.12 80), transparent)",
              }}
            />

            <div className="p-6 md:p-8">
              {/* Title */}
              <div className="text-center mb-6">
                <div className="text-4xl mb-2" aria-hidden>
                  💌
                </div>
                <p
                  className="playfair-font font-bold"
                  style={{
                    fontSize: "clamp(1.5rem, 5vw, 2.2rem)",
                    color: "oklch(0.22 0.12 15)",
                  }}
                >
                  Send Your Reply 💌
                </p>
                <p
                  className="mt-1"
                  style={{
                    color: "oklch(0.45 0.05 20)",
                    fontSize: "0.95rem",
                    lineHeight: 1.8,
                    fontFamily: "'PlayfairDisplay', serif",
                  }}
                >
                  I am waiting for your reply...
                </p>
                <div
                  className="mx-auto mt-2"
                  style={{
                    height: "2px",
                    width: "60px",
                    background:
                      "linear-gradient(90deg, transparent, oklch(0.78 0.12 80), transparent)",
                  }}
                />
              </div>

              <form onSubmit={handleSubmit} noValidate>
                {/* Message textarea */}
                <div className="mb-5">
                  <label
                    htmlFor="reply-message"
                    className="block mb-1"
                    style={{
                      color: "oklch(0.28 0.10 15)",
                      fontSize: "1rem",
                      lineHeight: 1.8,
                      fontFamily: "'PlayfairDisplay', serif",
                    }}
                  >
                    Your Reply
                  </label>
                  <textarea
                    id="reply-message"
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (msgError) setMsgError("");
                    }}
                    placeholder="Write your reply here..."
                    rows={4}
                    className="w-full rounded-xl px-4 py-3 text-base resize-none"
                    style={{
                      border: msgError
                        ? "1.5px solid oklch(0.55 0.22 20)"
                        : "1.5px solid oklch(0.78 0.12 80 / 0.4)",
                      background: "oklch(0.96 0.02 80)",
                      color: "oklch(0.22 0.06 20)",
                      outline: "none",
                      fontSize: "16px",
                      fontFamily: "'PlayfairDisplay', serif",
                    }}
                    data-ocid="reply.textarea"
                  />
                  {msgError && (
                    <p
                      className="mt-1"
                      style={{
                        color: "oklch(0.55 0.22 20)",
                        fontSize: "0.85rem",
                        lineHeight: 1.8,
                        fontFamily: "'PlayfairDisplay', serif",
                      }}
                      data-ocid="reply.error_state"
                    >
                      {msgError}
                    </p>
                  )}
                </div>

                {/* Backend error */}
                {mutation.isError && (
                  <p
                    className="mb-4 text-center"
                    style={{
                      color: "oklch(0.55 0.22 20)",
                      fontSize: "0.9rem",
                      lineHeight: 1.8,
                      fontFamily: "'PlayfairDisplay', serif",
                    }}
                    data-ocid="reply.error_state"
                  >
                    Something went wrong, please try again
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full rounded-xl py-3 font-semibold transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.28 0.12 15), oklch(0.38 0.14 15))",
                    color: "oklch(0.88 0.10 85)",
                    border: "1.5px solid oklch(0.78 0.12 80 / 0.4)",
                    fontSize: "1.1rem",
                    cursor: mutation.isPending ? "not-allowed" : "pointer",
                    opacity: mutation.isPending ? 0.7 : 1,
                    fontFamily: "'PlayfairDisplay', serif",
                  }}
                  data-ocid="reply.submit_button"
                >
                  {mutation.isPending ? "Sending..." : "Send 💕"}
                </button>
              </form>

              <div
                className="flex justify-start mt-4 pt-4"
                style={{ borderTop: "1px solid oklch(0.78 0.12 80 / 0.2)" }}
              >
                <button
                  type="button"
                  className="nav-btn-cream"
                  onClick={onPrev}
                  data-ocid="reply.secondary_button"
                >
                  ← Back
                </button>
              </div>
            </div>

            <div
              className="h-1 w-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.78 0.12 80), transparent)",
              }}
            />
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

// ─── Progress Dots ────────────────────────────────────────────────────────────
const PAGE_ORDER: Page[] = [
  "landing",
  "letter1",
  "letter2",
  "memories-cover",
  "memories-1",
  "memories-2",
  "anniversary",
  "reply",
];

function ProgressDots({ current }: { current: Page }) {
  const idx = PAGE_ORDER.indexOf(current);
  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50"
      aria-label="Page progress"
      style={{ pointerEvents: "none" }}
    >
      {PAGE_ORDER.map((p, i) => (
        <div
          key={p}
          style={{
            width: i === idx ? "20px" : "6px",
            height: "6px",
            borderRadius: "99px",
            background:
              i === idx
                ? "oklch(0.78 0.12 80)"
                : i < idx
                  ? "oklch(0.78 0.12 80 / 0.5)"
                  : "oklch(0.78 0.12 80 / 0.2)",
            transition: "all 0.4s ease",
          }}
        />
      ))}
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();
  return (
    <div
      className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 text-center whitespace-nowrap"
      style={{ pointerEvents: "none" }}
    >
      <p
        style={{
          fontSize: "10px",
          color: "oklch(0.78 0.12 80 / 0.3)",
          fontFamily: "'PlayfairDisplay', serif",
          letterSpacing: "0.05em",
        }}
      >
        © {year}. Built with{" "}
        <span style={{ pointerEvents: "auto" }}>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "oklch(0.78 0.12 80 / 0.45)",
              textDecoration: "none",
            }}
          >
            caffeine.ai
          </a>
        </span>
      </p>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("landing");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("lang", "en");
    html.setAttribute("dir", "ltr");
  }, []);

  const goTo = useCallback((p: Page) => {
    setPage(p);
    if (containerRef.current) {
      containerRef.current.scrollTo(0, 0);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
    >
      <AnimatePresence mode="wait">
        {page === "landing" && (
          <div key="landing" className="absolute inset-0">
            <LandingPage onNext={() => goTo("letter1")} />
          </div>
        )}
        {page === "letter1" && (
          <div key="letter1" className="absolute inset-0">
            <LetterPage1
              onNext={() => goTo("letter2")}
              onPrev={() => goTo("landing")}
            />
          </div>
        )}
        {page === "letter2" && (
          <div key="letter2" className="absolute inset-0">
            <LetterPage2
              onNext={() => goTo("memories-cover")}
              onPrev={() => goTo("letter1")}
            />
          </div>
        )}
        {page === "memories-cover" && (
          <div key="memories-cover" className="absolute inset-0">
            <MemoriesCover
              onNext={() => goTo("memories-1")}
              onPrev={() => goTo("letter2")}
            />
          </div>
        )}
        {page === "memories-1" && (
          <div key="memories-1" className="absolute inset-0">
            <MemoriesGallery1
              onNext={() => goTo("memories-2")}
              onPrev={() => goTo("memories-cover")}
            />
          </div>
        )}
        {page === "memories-2" && (
          <div key="memories-2" className="absolute inset-0">
            <MemoriesGallery2
              onNext={() => goTo("anniversary")}
              onPrev={() => goTo("memories-1")}
            />
          </div>
        )}
        {page === "anniversary" && (
          <div key="anniversary" className="absolute inset-0">
            <AnniversaryPage
              onNext={() => goTo("reply")}
              onPrev={() => goTo("memories-2")}
            />
          </div>
        )}
        {page === "reply" && (
          <div key="reply" className="absolute inset-0">
            <ReplyPage onPrev={() => goTo("anniversary")} />
          </div>
        )}
      </AnimatePresence>

      <ProgressDots current={page} />
      <Footer />
    </div>
  );
}
