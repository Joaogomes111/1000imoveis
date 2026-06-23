"use client";

import Image from "next/image";
import { useState } from "react";

type PropertyGalleryProps = {
  images: string[];
  title: string;
};

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="grid gap-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[8px] bg-neutral-200">
        <Image src={selectedImage} alt={title} fill priority sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setSelectedImage(image)}
            className={`focus-ring relative aspect-[4/3] overflow-hidden rounded-[8px] border ${
              selectedImage === image ? "border-brand-gold" : "border-transparent"
            }`}
            aria-label={`Ver foto ${index + 1}`}
          >
            <Image src={image} alt={`${title} - foto ${index + 1}`} fill sizes="180px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
