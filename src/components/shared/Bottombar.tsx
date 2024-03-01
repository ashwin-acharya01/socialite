import { BottombarLinks } from "@/constants";
import { NavLink, useLocation } from "react-router-dom";

const Bottombar = () => {
  const { pathname } = useLocation();
  return (
    <section className="bottom-bar">
      {BottombarLinks.map((link) => {
        const isActive = link.route === pathname;
        return (
          <NavLink to={link.route}
            className={`flex flex-col gap-1 items-center p-3 cursor-pointer transition ${
              isActive && `bg-primary-500 rounded-md`
            }`}
            key={link.label}
          >
            {link.icons}
            <p className="tiny-medium">{link.label}</p>
            </NavLink>
        );
      })}
    </section>
  );
};

export default Bottombar;
