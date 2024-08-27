import { Session } from "next-auth"

export default function UserInfo({ session }: { session: Session | null }) {
  console.log(session)
  if (!session) {
    return null
  }

  return (
    <div className="text-sm">
      <p>Welcome, {session.user?.name || 'User'}さん!</p>
      <p>{session.user?.email}</p>
    </div>
  )
}
