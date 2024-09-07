import { Session } from "next-auth"

export default function UserInfo({ session }: { session: Session | null }) {
  if (!session) {
    return null
  }

  return (
    <div className="text-sm">
      <p>ようこそ,{session.user?.name || 'User'}さん!</p>
    </div>
  )
}
