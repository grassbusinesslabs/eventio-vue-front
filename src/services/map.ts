import tt, {
   AnimationOptions,
   LngLatLike,
   Map,
   MapOptions,
   Marker
} from '@tomtom-international/web-sdk-maps'

import ttServices, {
   Address,
   AddressCountrySubdivisionCodeMixin,
   AddressPostalNameMixin,
   FuzzySearchOptions,
   FuzzySearchResponse,
   FuzzySearchResult
} from '@tomtom-international/web-sdk-services'

import mapMarker from '@/assets/map-marker.svg'

export type SearchAddress = Address & AddressCountrySubdivisionCodeMixin & AddressPostalNameMixin

export interface AddressItem {
   address: string
   details: FuzzySearchResult
}

export interface CityItem {
   city: string
   details: FuzzySearchResult
}

export interface CreateMarkerOptions {
   element?: HTMLElement
   anchor?: string
   offset?: tt.PointLike
   rotation?: number
   pitchAlignment?: string
   rotationAlignment?: string
   color?: string
   width?: string
   height?: string
   draggable?: boolean
   clickTolerance?: number
}


let map: Map | null = null
let markers: { [key in string]: Marker } = {}

export const mapService = () => {
 const mapKey: string = 'drm2YOnCEjo2NZYyED481bHiiZSPaZyG'
 
 

   const defaultFuzzySearchOptions: FuzzySearchOptions = {
      key: mapKey,
      limit: 5,
      typeahead: true,
      language: 'uk-UA', 
      countrySet: 'UA' 
   }

   const defaultMapOptions: MapOptions = {
      key: mapKey,
      zoom: 4,
      language: 'uk-UA',
      stylesVisibility: {
         map: true,
         poi: true,
         trafficFlow: false,
         trafficIncidents: false
      }
   } as MapOptions

   async function createMap(container: HTMLElement, options?: Partial<MapOptions>): Promise<Map> {
      const combineOptions: MapOptions = {
         ...defaultMapOptions,
         ...options,
         container
      }

      const map = tt.map(combineOptions)

      map.addControl(new tt.FullscreenControl({
         container
      }))

      const navControl = new tt.NavigationControl({
         showZoom: true,
         showPitch: true,
         showExtendedPitchControls: true,
         showCompass: true,
         showExtendedRotationControls: true
      })

      map.addControl(navControl, 'top-left')
      
      return map
}

   function getMap(): Map | null {
      return map
   }

   function destroyMap(): void {
      map = null
   }

   function setMapCenter(coords: LngLatLike, options?: Partial<AnimationOptions>): void {
      const animationOptions: AnimationOptions = {
         duration: 500,
         ...options
      }

      map!.panTo(coords, animationOptions)
   }

   function setZoom(zoom: number = defaultMapOptions.zoom || 4, options?: Partial<AnimationOptions>): void {
      const animationOptions: AnimationOptions = {
        duration: 500,
        ...options
      }
    
      map!.zoomTo(zoom, animationOptions)
    }

   function getMapZoom(): number {
      return map!.getZoom()
   }

   function createMarker(id: string, coords: LngLatLike, options?: Partial<CreateMarkerOptions>): Marker | null {
      if (markers[id]) {
         changeMarkerLocation(id, coords)
         return null
      }

      const markerElement: HTMLDivElement = document.createElement('div')
      markerElement.setAttribute('id', id)
      markerElement.classList.add('map-marker', `map-marker_${id}`)
      markerElement.style.setProperty('background-image', `url('${mapMarker}')`)

      const marker: Marker = new tt.Marker({
         element: markerElement,
         ...options
      })

      marker.setLngLat(coords)

      markers[id] = marker
      return marker
   }

   function addMarkerToMap(marker: Marker): void {
      marker.addTo(map!)
   }

   function changeMarkerLocation(markerId: string, coords: LngLatLike): void {
      const marker: Marker = markers[markerId]

      if (marker) {
         marker.setLngLat(coords)
      }
   }

   function removeMarkerFromMap(markerId: string): void {
      const marker: Marker = markers[markerId]

      if (marker) {
         marker.remove()
      }

      delete markers[markerId]
   }

   function removeAllMarkers(): void {
      for (const marker of Object.keys(markers)) {
         removeMarkerFromMap(marker)
      }

      markers = {}
   }

   async function fuzzySearch(text: string, options?: Partial<FuzzySearchOptions>): Promise<FuzzySearchResponse> {
      const combineOptions: FuzzySearchOptions = {
         ...defaultFuzzySearchOptions,
         ...options
      }

      combineOptions.query = text

      return ttServices.services.fuzzySearch(combineOptions)
   }
  

   async function searchAddresses(text: string, options?: Partial<FuzzySearchOptions>): Promise<AddressItem[]> {
      const response: FuzzySearchResponse = await fuzzySearch(text, {
        ...options,
        idxSet: 'PAD,Addr'
      })
     
      return (response.results || []).map((el: FuzzySearchResult) => ({
        address: generateAddressStr(el.address as SearchAddress), 
        details: el
      }))
     }

   
   async function searchCities(text: string, options?: Partial<FuzzySearchOptions>): Promise<CityItem[]> {
      const response: FuzzySearchResponse = await fuzzySearch(text, {
        ...options,
        entityTypeSet: 'MunicipalitySubdivision'
      })
    
      return (response.results || []).map((el: FuzzySearchResult) => ({
        city: generateCityStr(el.address),
        details: el
      }))
   }

   function generateAddressStr(searchResult: SearchAddress): string {
      const segments: string[] = []

      if (searchResult?.streetName) {
         segments.push(searchResult.streetName)
      }

      if (searchResult?.streetNumber) {
         segments.push(searchResult.streetNumber)
      }

      if (searchResult?.municipalitySubdivision) {
         segments.push(searchResult.municipalitySubdivision)
      } else if (searchResult?.municipality) {
         segments.push(searchResult.municipality)
      }

      // if (searchResult?.country) {
      //    segments.push(searchResult.country)
      // }

      return segments.join(', ')
   }

   function generateCityStr(searchResult: SearchAddress | undefined): string {
      if (!searchResult) {
        return ''
      }
    
      const segments: string[] = []
    
      if (searchResult.municipalitySubdivision) {
        segments.push(searchResult.municipalitySubdivision)
      } else if (searchResult.municipality) {
        segments.push(searchResult.municipality)
      }
    
      if (searchResult.countrySubdivision) {
        segments.push(searchResult.countrySubdivision)
      }
    
      return segments.join(', ')
    }
   return {
      searchAddresses,
      searchCities,
      createMap,
      getMap,
      destroyMap,
      setMapCenter,
      setZoom,
      getMapZoom,
      createMarker,
      addMarkerToMap,
      changeMarkerLocation,
      removeMarkerFromMap,
      removeAllMarkers,
      mapService
   }
}
