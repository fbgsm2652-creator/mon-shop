import { createImageUrlBuilder } from '@sanity/image-url'
// On importe le type directement depuis la racine du paquet
import type { SanityImageSource } from "@sanity/image-url";

import { dataset, projectId } from '../env'

const builder = createImageUrlBuilder({ 
  projectId: projectId || '', 
  dataset: dataset || '' 
})

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}