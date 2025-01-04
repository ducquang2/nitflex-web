import _ from 'lodash'

import modules from 'src/routes'

import { Module, Movie } from './types'

type RoutesType = {
  public: Array<Module>
  private: Array<Module>
}

export function getRoutes(): RoutesType {
  return {
    public: _.chain(modules.public).value(),
    private: _.chain(modules.private).value(),
  }
}

/**
 * @description Splits an array into N chunks.
 *
 * @param array - The array to be split.
 * @param n - The number of chunks to split the array into.
 * @returns - An array containing the split chunks.
 */
export function splitToSmallChunks(array: Array<Movie>, n: number) {
  // Handle edge cases
  if (n <= 0) return []
  if (n >= array.length) return [array]

  const result: Array<Array<Movie>> = []
  for (let i = n; i > 0; i--) {
    result.push(array.splice(0, Math.ceil(array.length / i)))
  }
  return result
}

/**
 * @description Adds image prefix to the image path.
 *
 * @param image - The image path.
 * @returns - The image path with the prefix.
 */
export function addImagePrefix(image?: string) {
  if (!image) {
    return 'https://dummyimage.com/600x1400/000/fff.png&text=no_image'
  }
  if (image.startsWith('http')) {
    return image
  }

  return `https://image.tmdb.org/t/p/w500${image}`
}
