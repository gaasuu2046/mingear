'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function RefreshOnRedirect() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    if (searchParams.get('status') === '201') {
      router.refresh()
      // クエリパラメータを削除
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [searchParams, router])

  return null
}
