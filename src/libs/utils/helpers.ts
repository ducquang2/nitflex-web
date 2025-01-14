import _ from 'lodash'

import modules from 'src/routes'

import { Module, MovieInfo } from './types'

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
export function splitToSmallChunks(array: Array<MovieInfo>, n: number) {
  // Handle edge cases
  if (n <= 0) return []
  if (n >= array.length) return [array]

  const result: Array<Array<MovieInfo>> = []
  for (let i = 0; i < n; i++) {
    result.push([])
  }

  array.forEach((item, index) => {
    result[index % n].push(item)
  })

  // Ensure the result is split into 4 columns
  while (result.length < 4) {
    result.push([])
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
  if (!image || image === 'https://image.tmdb.org/t/p/w500') {
    return 'https://dummyimage.com/600x1400/000/fff.png&text=no_image'
  }

  if (image.startsWith('https')) {
    return image
  }

  return `https://image.tmdb.org/t/p/w500${image}`
}

/**
 * Parses a numeric gender representation into a string.
 *
 * @param gender - The numeric representation of gender.
 *                 If `2`, it returns 'Male'.
 *                 If any other number, it returns 'Female'.
 *                 If not provided or `undefined`, it returns 'Unknown'.
 * @returns A string representing the gender: 'Male', 'Female', or 'Unknown'.
 */
export function parseGender(gender?: number) {
  if (!gender) {
    return 'Unknown'
  }

  return gender === 2 ? 'Male' : 'Female'
}

/**
 * Parses a string into a YouTube link.
 *
 * @param key - The YouTube key.
 * @returns The YouTube link if the key is provided, otherwise `undefined`.
 */
export function parseYoutubeLink(key?: string): string | undefined {
  if (!key) {
    return undefined
  }

  return `https://www.youtube.com/watch?v=${key}`
}
