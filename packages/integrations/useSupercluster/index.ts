import { useRef, useState } from 'react'
import Supercluster from 'supercluster'
import { isEqual, useDeepCompareEffect } from '@rcuse/core'

import type { BBox, GeoJsonProperties } from 'geojson'

export interface UseSuperclusterOptions<P, C> {
  points: Array<Supercluster.PointFeature<P>>
  bounds?: BBox
  zoom: number
  options?: Supercluster.Options<P, C>
  disableRefresh?: boolean
}

export function useSupercluster<
  P extends GeoJsonProperties = Supercluster.AnyProps,
  C extends GeoJsonProperties = Supercluster.AnyProps,
>({
  points,
  bounds,
  zoom,
  options,
  disableRefresh,
}: UseSuperclusterOptions<P, C>) {
  const superclusterRef = useRef<Supercluster<P, C>>()
  const pointsRef = useRef<Array<Supercluster.PointFeature<P>>>()
  const [clusters, setClusters] = useState<
    Array<Supercluster.ClusterFeature<C> | Supercluster.PointFeature<P>>
  >([])
  const zoomInt = Math.round(zoom)

  useDeepCompareEffect(
    () => {
      if (disableRefresh === true)
        return

      if (
        !superclusterRef.current
        || !isEqual(pointsRef.current, points)
        || !isEqual(
          (superclusterRef.current as typeof superclusterRef.current & {
            options: typeof options
          }).options,
          options,
        )
      ) {
        superclusterRef.current = new Supercluster(options)
        superclusterRef.current.load(points)
      }

      if (bounds)
        setClusters(superclusterRef.current.getClusters(bounds, zoomInt))

      pointsRef.current = points
    },
    [points, bounds, zoomInt, options, disableRefresh],
  )

  return { clusters, supercluster: superclusterRef.current }
}
