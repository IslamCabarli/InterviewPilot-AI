import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";

const navItems = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/interview", label: "Interviews" },
    { to: "/profile", label: "Profile" },
    { to: "/settings", label: "Settings" }
]

export default function Layout() {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    return(

        <div className="flex min-h-screen bg-bg font-body text-text-primary">
            <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-surface">
                <div className="border-b border-border px-6 py-5">
                    <span className="font-display text-lg font-semibold tracking-tight">
                        InterviewPilot
                    </span>
                </div>

                <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `relative rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive
                                    ? 'bg-bg text-text-primary'
                                    : 'text-text-secondary hover:text-text-primary'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 bg-accent" />
                                    )}
                                    {item.label}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="border-t border-border px-4 py-4">
                    <p className="truncate text-sm font-medium">{user?.name}</p>
                    <button
                        onClick={handleLogout}
                        className="mt-1 text-xs font-medium text-text-secondary hover:text-accent"
                    >
                        Çıxış
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    )
}