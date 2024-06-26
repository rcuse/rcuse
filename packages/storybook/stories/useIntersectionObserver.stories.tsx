import React, { useEffect, useRef } from 'react'
import { Alert, Button, Card } from '@arco-design/web-react'
import { useIntersectionObserver } from '@rcuse/core'
import { cn } from './utils'

export default { title: 'UI And Dom/useIntersectionObserver' }

export function Basic() {
  const ref = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const intersection = useIntersectionObserver({
    root: ref.current,
    threshold: 1,
  })

  useEffect(() => {
    btnRef.current && intersection.ref(btnRef.current)
  }, [btnRef])

  return (
    <>
      <Alert className={cn('mb-2 w-60')} content={`目标元素是否可见: ${intersection.isIntersecting.toString()}`} />
      <div
        className={cn('relative h-72 w-60 p-2 rounded-md border overflow-y-auto')}
        ref={ref}
      >
        {Array.from({ length: 50 }).map((_, index) => {
          return (
            <Card className={cn('h-10 mb-2')} key={index}>
              {index + 1}
            </Card>
          )
        })}

        <Button ref={btnRef}>
          目标元素
        </Button>
      </div>
    </>
  )
}
