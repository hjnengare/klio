"use client";

import Image from "next/image";
import React, { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star } from "react-feather";

interface ImageCarouselProps {
    images: string[];
    altBase: string;
    rating: number;
    metrics: { label: string; value: number; color: "sage" | "coral" }[];
}

export function ImageCarousel({
    images,
    altBase,
    rating,
    metrics,
}: ImageCarouselProps) {
    const [index, setIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const total = images.length;

    const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
    const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);

    const openModal = useCallback(() => setIsModalOpen(true), []);
    const closeModal = useCallback(() => setIsModalOpen(false), []);

    // Keyboard navigation for modal
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isModalOpen) return;

        switch (e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                prev();
                break;
            case 'ArrowRight':
                e.preventDefault();
                next();
                break;
        }
    }, [isModalOpen, closeModal, prev, next]);

    // Add keyboard event listener when modal is open
    React.useEffect(() => {
        if (isModalOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen, handleKeyDown]);

    return (
        <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-[10px] border border-sage/10 bg-off-white">
            {/* Slides */}
            <div
                className="relative aspect-[16/9] overflow-hidden cursor-pointer group"
                onClick={openModal}
            >
                {images.map((src, i) => (
                    <div
                        key={src}
                        className={`absolute inset-0 transition-opacity duration-300 ${
                            i === index ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <Image
                            src={src}
                            alt={`${altBase} image ${i + 1}`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 768px"
                            priority={i === 0}
                            loading={i === 0 ? "eager" : "lazy"}
                        />

                        {/* Zoom overlay on hover */}
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                                <svg className="w-6 h-6 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Caption overlay: rating + metrics */}
            <div className="pointer-events-none absolute left-0 right-0 bottom-0 p-3 sm:p-4">
                <div className="mx-auto max-w-none">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 rounded-[12px] border border-white/40 bg-off-white backdrop-blur-md px-3 sm:px-4 py-2 shadow-sm">
                        {/* Rating badge */}
                        <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 px-3 py-1 text-white text-sm font-semibold shadow">
                            <Star className="h-4 w-4" />
                            {rating.toFixed(1)}
                        </span>

                        {/* Divider dot */}
                        <span className="hidden sm:inline text-charcoal/30">•</span>

                        {/* Metrics chips */}
                        <div className="flex flex-wrap items-center gap-2">
                            {metrics.map((m) => (
                                <span
                                    key={m.label}
                                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${m.color === "sage"
                                            ? "border-sage/25 text-sage bg-sage/10"
                                            : "border-coral/25 text-coral bg-coral/10"
                                        }`}
                                >
                                    {m.label}: {m.value}%
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <button
                aria-label="Previous image"
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-off-white/80 hover:bg-off-white p-2 shadow-sm border border-black/5"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <button
                aria-label="Next image"
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-off-white/80 hover:bg-off-white p-2 shadow-sm border border-black/5"
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            {/* Image Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={closeModal}
                >
                    <div
                        className="relative max-w-4xl max-h-[90vh] w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                            aria-label="Close modal"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Modal Image */}
                        <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                            <Image
                                src={images[index]}
                                alt={`${altBase} image ${index + 1}`}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, 80vw"
                                priority
                            />
                        </div>

                        {/* Modal Navigation */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        prev();
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        next();
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}

                        {/* Image Counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {index + 1} / {images.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
