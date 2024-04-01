import { useQuery } from "@tanstack/react-query"

type AddressInfo = {
  formattedAddress: string,
  long: number;
  lat: number;
}

export const useGetAddressQuery = (address?: string) => {
  return useQuery({
    queryKey: ["address", address],
    queryFn: async() => {
      try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address!)}&key=${process.env.GOOGLE_API_KEY}`)
        const responseData = await response.json()
        const data = responseData.results[0]
        const addressInfo: AddressInfo = {
          formattedAddress: data.formatted_address,
          long: data.geometry.location.lng,
          lat: data.geometry.location.lat,
        }
        return addressInfo
      } catch (error) {
        throw new Error()
      } 
    },
    enabled: Boolean(address),
    staleTime: 10 * 60 * 1000
  })
}