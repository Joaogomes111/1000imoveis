"use client";

import { useRef, type MouseEvent, type PointerEvent } from "react";

import { PropertyCard } from "@/components/PropertyCard";
import type { Imovel, SiteConfig } from "@/types/content";

type PropertyGridProps = {
  imoveis: Imovel[];
  config: SiteConfig;
};

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  scrollLeft: number;
  startIndex: number;
  mode: "horizontal" | "vertical" | null;
  didDrag: boolean;
};

export function PropertyGrid({ imoveis, config }: PropertyGridProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<DragState | null>(null);
  const animationFrame = useRef<number | null>(null);
  const suppressClick = useRef(false);

  if (!imoveis.length) {
    return (
      <div className="rounded-[8px] border border-dashed border-neutral-300 bg-white p-10 text-center">
        <h3 className="text-xl font-bold text-neutral-950">Nenhum imóvel encontrado</h3>
        <p className="mt-2 text-neutral-600">Fale com a equipe para encontrar uma opção sob medida.</p>
      </div>
    );
  }

  function getSnapPositions(carousel: HTMLDivElement) {
    const cards = Array.from(carousel.querySelectorAll<HTMLElement>(".property-card"));
    const firstCard = cards[0];

    if (!firstCard) {
      return [0];
    }

    const firstLeft = firstCard.offsetLeft;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;

    return cards.map((card) => Math.max(0, Math.min(maxScroll, card.offsetLeft - firstLeft)));
  }

  function getClosestSnapIndex(positions: number[], scrollLeft: number) {
    return positions.reduce((closestIndex, position, index) => {
      const closestDistance = Math.abs(positions[closestIndex] - scrollLeft);
      const distance = Math.abs(position - scrollLeft);
      return distance < closestDistance ? index : closestIndex;
    }, 0);
  }

  function stopCarouselAnimation() {
    if (animationFrame.current) {
      window.cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
  }

  function animateCarouselTo(carousel: HTMLDivElement, target: number) {
    stopCarouselAnimation();

    const start = carousel.scrollLeft;
    const distance = target - start;

    if (Math.abs(distance) < 1) {
      carousel.scrollLeft = target;
      return;
    }

    const duration = Math.min(360, Math.max(190, Math.abs(distance) * 0.85));
    const startedAt = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      carousel.scrollLeft = start + distance * eased;

      if (progress < 1) {
        animationFrame.current = window.requestAnimationFrame(tick);
      } else {
        carousel.scrollLeft = target;
        animationFrame.current = null;
      }
    }

    animationFrame.current = window.requestAnimationFrame(tick);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    const carousel = carouselRef.current;

    if (!carousel || event.pointerType === "mouse" || window.matchMedia("(min-width: 768px)").matches) {
      return;
    }

    stopCarouselAnimation();
    const positions = getSnapPositions(carousel);

    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: carousel.scrollLeft,
      startIndex: getClosestSnapIndex(positions, carousel.scrollLeft),
      mode: null,
      didDrag: false,
    };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const state = dragState.current;
    const carousel = carouselRef.current;

    if (!state || !carousel || state.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - state.startX;
    const deltaY = event.clientY - state.startY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (!state.mode && Math.max(absX, absY) > 12) {
      if (absX > absY * 1.35) {
        state.mode = "horizontal";
        carousel.classList.add("is-dragging");
        carousel.setPointerCapture(event.pointerId);
      } else {
        state.mode = "vertical";
      }
    }

    if (state.mode !== "horizontal") {
      return;
    }

    state.didDrag = true;
    carousel.scrollLeft = state.scrollLeft - deltaX;
    event.preventDefault();
  }

  function finishPointerDrag(event: PointerEvent<HTMLDivElement>) {
    const state = dragState.current;
    const carousel = carouselRef.current;

    if (!state || !carousel || state.pointerId !== event.pointerId) {
      return;
    }

    carousel.classList.remove("is-dragging");

    if (state.mode === "horizontal" && carousel.hasPointerCapture(event.pointerId)) {
      carousel.releasePointerCapture(event.pointerId);
    }

    if (state.didDrag) {
      const positions = getSnapPositions(carousel);
      const dragDistance = state.startX - event.clientX;
      const currentIndex = getClosestSnapIndex(positions, carousel.scrollLeft);
      const averageStep = positions[1] ? positions[1] - positions[0] : carousel.clientWidth * 0.82;
      const traveledCards = Math.max(1, Math.round(Math.abs(carousel.scrollLeft - state.scrollLeft) / averageStep));
      const direction = dragDistance > 0 ? 1 : -1;
      const shouldAdvance = Math.abs(dragDistance) > 34;
      const targetIndex = shouldAdvance
        ? Math.max(0, Math.min(positions.length - 1, state.startIndex + direction * traveledCards))
        : currentIndex;

      animateCarouselTo(carousel, positions[targetIndex]);

      suppressClick.current = true;
      window.setTimeout(() => {
        suppressClick.current = false;
      }, 80);
    }

    dragState.current = null;
  }

  function handleClickCapture(event: MouseEvent<HTMLDivElement>) {
    if (!suppressClick.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <div
      ref={carouselRef}
      className="property-carousel -mx-4 flex gap-4 overflow-x-auto px-4 pb-3 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-3"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishPointerDrag}
      onPointerCancel={finishPointerDrag}
      onClickCapture={handleClickCapture}
    >
      {imoveis.map((imovel, index) => (
        <PropertyCard key={imovel.id} imovel={imovel} config={config} index={index} />
      ))}
    </div>
  );
}
