import type { ImgHTMLAttributes } from 'react';
import imageManifest from '@/data/image-manifest.json';

interface ImageAsset {
  src: string;
  srcSet: string;
  width: number;
  height: number;
}

interface StaticImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'width' | 'height'> {
  src: string;
  alt: string;
  width?: number;
  fill?: boolean;
  priority?: boolean;
  mobileSrc?: string;
}

const images: Record<string, ImageAsset> = imageManifest;

/** Pre-generated responsive files: no image server is available on GitHub Pages. */
export default function StaticImage({
  src, alt, width, fill, priority = false, mobileSrc, sizes,
  style, loading, ...props
}: StaticImageProps) {
  const asset = images[src];
  if (!asset) throw new Error(`Missing static image: ${src}. Run npm run images:optimize after registering the source.`);
  const mobile = mobileSrc ? images[mobileSrc] : undefined;
  if (mobileSrc && !mobile) throw new Error(`Missing mobile image: ${mobileSrc}`);
  const renderedWidth = width ?? asset.width;
  const imageSizes = sizes ?? (fill ? '100vw' : `${renderedWidth}px`);
  const renderedStyle = fill ? { position: 'absolute' as const, inset: 0, width: '100%', height: '100%', ...style } : style;
  // Explicit srcset widths match actual decoded files; preserve the source aspect ratio.
  const image = (
    // eslint-disable-next-line @next/next/no-img-element -- Static, pre-encoded srcset for the GitHub Pages export.
    <img
      {...props}
      src={asset.src}
      srcSet={asset.srcSet}
      sizes={imageSizes}
      alt={alt}
      width={fill ? undefined : renderedWidth}
      height={fill ? undefined : Math.round(renderedWidth * asset.height / asset.width)}
      style={renderedStyle}
      loading={priority ? 'eager' : loading ?? 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
    />
  );
  return mobile ? (
    <picture>
      <source media="(max-width: 767px)" srcSet={mobile.srcSet} sizes={imageSizes} width={mobile.width} height={mobile.height} />
      {image}
    </picture>
  ) : image;
}
