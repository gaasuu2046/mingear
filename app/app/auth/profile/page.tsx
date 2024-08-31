// app/auth/profile/page.tsx

import { getServerSession } from 'next-auth/next'

import DeleteAccountButton from '../components/DeleteAccountButton'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return <div>Please log in to view your profile.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">プロフィール</h1>
      <p>Name: {session.user.name}</p>
      <p>Email: {session.user.email}</p>
      {/* その他のプロフィール情報 */}
      
      <div className="mt-8">
        <DeleteAccountButton />
      </div>
    </div>
  )
}
