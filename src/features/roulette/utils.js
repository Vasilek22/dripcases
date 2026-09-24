import { RARITY_WEIGHTS } from '../../entities/item/model'
/**
 * Взвешенный случайный выбор вещи по редкости.
 */
export function getRandomItem(items) {
  if (!items || items.length === 0) return null
  if (items.length === 1) return items[0]

  // Считаем общий вес
  const totalWeight = items.reduce(
    (sum, item) => sum + (RARITY_WEIGHTS[item.rarity] || 1),
    0
  )

  // Кидаем случайное число
  let random = Math.random() * totalWeight

  // Идём по списку
  for (const item of items) {
    random -= RARITY_WEIGHTS[item.rarity] || 1
    if (random <= 0) return item
  }

  // Fallback (на всякий) — случайный из items
  return items[Math.floor(Math.random() * items.length)]
}

/**
 * Строим длинную ленту для визуальной рулетки.
 */
export function buildRouletteTrack(items, repeats = 8) {
  if (!items || items.length === 0) return []
  const track = []
  for (let r = 0; r < repeats; r++) {
    items.forEach((item) => track.push(item))
  }
  return track
}