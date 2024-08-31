import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function VerifyRequest() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/') // 5分後にホームページにリダイレクト
    }, 300000) // 300000ミリ秒 = 5分

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Verify Your Email</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold mb-6">
          Check your email
        </h1>

        <p className="text-2xl mb-8">
          A sign in link has been sent to your email address.
        </p>

        <div className="max-w-xl">
          <p className="mb-4">
            Click the link in the email to sign in or sign up.
          </p>
          <p className="mb-4">
            If you don't see the email, check other places it might be, like your junk, spam, social, or other folders.
          </p>
          <p>
            You will be redirected to the home page in 5 minutes if you don't verify your email.
          </p>
        </div>
      </main>
    </div>
  )
}
