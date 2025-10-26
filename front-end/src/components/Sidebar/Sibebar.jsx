import React, { useContext } from "react";
import { Home, MessageCircle, Heart, Settings, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import { UserContext } from "../../Context/UserProvider";

const Sidebar = () => {
	const location = useLocation();
	const { user } = useContext(UserContext);
	const sidebarItems = [
		{ id: "home", icon: Home, label: "Home", path: "/" },
		{
			id: "messenger",
			icon: MessageCircle,
			label: "Messenger",
			path: "/messenger",
		},
		{ id: "friends", icon: Users, label: "Friends", path: "/friends" },
		{ id: "favorites", icon: Heart, label: "Favorites", path: "/favorites" },
		{ id: "settings", icon: Settings, label: "Settings", path: "/settings" },
	];

	return (
		<div className="sidebar">
			<div className="sidebar-content">
				<div className="logo-section">
					{user && user.isAuthenticated ? (
						<div className="user-profile">
							<Link
								to={`/profile/${user.account.id}`}
								className="profile-button"
							>
								<div className="user-avatar"></div>
								<span>{user?.account?.fullName}</span>
							</Link>
						</div>
					) : null}
				</div>

				<nav className="sidebar-nav">
					{sidebarItems.map((item) => {
						const Icon = item.icon;
						return (
							<Link
								key={item.id}
								to={item.path}
								className={`nav-item ${
									location.pathname === item.path ? "active" : ""
								}`}
							>
								<Icon size={20} />
								<span>{item.label}</span>
							</Link>
						);
					})}
				</nav>
			</div>
		</div>
	);
};

export default Sidebar;
