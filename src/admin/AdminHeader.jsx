import { Link } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { siteConfig } from '../siteConfig'
import AdminNav from './AdminNav'

export default function AdminHeader() {
  const { user } = useAuth()

  return (
    <header className="bg-sage-dark text-cream">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-xl truncate">{siteConfig.shopName} — Dashboard</h1>
          <p className="text-xs text-cream-dark/70 truncate">{user?.email}</p>
        </div>
        <div className="flex items-center gap-4 text-sm shrink-0">
          <Link to="/" className="hover:underline hidden sm:inline">
            View Site
          </Link>
          <button
            onClick={() => signOut(auth)}
            className="border border-cream-dark/40 hover:border-cream px-3 py-1.5 rounded-full"
          >
            Sign Out
          </button>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-3">
        <AdminNav />
      </div>
    </header>
  )
}
