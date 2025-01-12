"use client"

import { ImageLoaderProps } from "next/image"

export const imageLoader = ({ src, width, quality }: ImageLoaderProps) => {
  if (src[0] === "/") src = src.slice(1)
  const paramsString = `?tr=w-${width}`
  return !!src
    ? process.env.NEXT_PUBLIC_IMAGE_URL + src + paramsString
    : "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
}
