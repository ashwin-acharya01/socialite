import { BiImageAdd, BiSolidHome } from "react-icons/bi";
import { LuGalleryVerticalEnd } from "react-icons/lu";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaRegStar } from "react-icons/fa6";

interface SidebarLinksTypes {
    icons: JSX.Element;
    route: string;
    label: string;
}

export const SidebarLinks: SidebarLinksTypes[] = [
    {
        icons: <BiSolidHome className="group-hover:invert-white size-6" />,
        route: '/',
        label: "Home"
    },
    {
        icons: <LuGalleryVerticalEnd className="group-hover:invert-white size-6" />,
        route: '/explore',
        label: "Explore"
    },
    {
        icons: <BsFillPeopleFill className="group-hover:invert-white size-6" />,
        route: '/all-user',
        label: "People"
    },
    {
        icons: <FaRegStar className="group-hover:invert-white size-6" />,
        route: '/saved',
        label: "Saved"
    },
    {
        icons: <BiImageAdd className="group-hover:invert-white size-6" />,
        route: '/create-post',
        label: "Create Posts"
    },
];

export const BottombarLinks: SidebarLinksTypes[] = [
    {
        icons: <BiSolidHome className="group-hover:invert-white size-4" />,
        route: '/',
        label: "Home"
    },
    {
        icons: <LuGalleryVerticalEnd className="group-hover:invert-white size-4" />,
        route: '/explore',
        label: "Explore"
    },
    {
        icons: <FaRegStar className="group-hover:invert-white size-4" />,
        route: '/saved',
        label: "Saved"
    },
    {
        icons: <FaRegStar className="group-hover:invert-white size-4" />,
        route: '/create-post',
        label: "Create Posts"
    },
];