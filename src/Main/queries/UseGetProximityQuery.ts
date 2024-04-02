import { useQuery } from "@tanstack/react-query"

export type DistanceResult = Record<string, {distance: string, duration: string}>

type Element = {
  distance: {
    text: string,
    value: number
  },
  duration: {
    text: string,
    value: number
  }
}

export const useGetDistanceBetweenAddressQuery = (origin: string, destinations: string[]) => {
  const apiKey = process.env.GOOGLE_API_KEY
  return useQuery({
    queryKey: ['distance', origin, ...destinations],
    queryFn: async() => {
      try {
        const url = `http://localhost:3001/distance?origin=${origin}&destinations=${destinations.join('|')}&apiKey=${apiKey}`;
        const response = await fetch(url)
        const data = await response.json()
        const elements = data.rows[0].elements
        const result: DistanceResult = {}
        elements.forEach((ele: Element, index: number) => {
          result[destinations[index]] = {
            distance: ele.distance.text,
            duration: ele.duration.text
          }
        })
        return result
      } catch (error) {
        console.error(error)
      }
    },
    enabled: Boolean(origin) && destinations.length > 0
  })
}
