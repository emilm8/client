import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, Menu, MenuButton, MenuItem, MenuItems, TransitionChild, } from '@headlessui/react'
import { Bars3Icon, BellIcon, DocumentDuplicateIcon, FolderIcon, HomeIcon, UsersIcon, XMarkIcon, } from '@heroicons/react/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { IoIosLogOut } from "react-icons/io";
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Cookies } from 'react-cookie';
import configObj from '../../config/config';
import Logo from "../../../public/caffecino.png"
import { BiLogOut } from 'react-icons/bi';    

const navigation = [
    { name: 'Ana Səhifə', href: '/admin', icon: HomeIcon, current: true },
    { name: 'Məhsullar', href: 'products', icon: UsersIcon, current: false },
    { name: 'Kateqoriyalar', href: 'category', icon: FolderIcon, current: false },
    { name: 'Subkateqoriya', href: 'subcategory', icon: DocumentDuplicateIcon, current: false },
]

const teams = [
    { id: 1, name: 'Alt Başlıqlar', href: '#', initial: 'A', current: false },
    { id: 2, name: 'Alt Başlıqlar', href: '#', initial: 'B', current: false },
    { id: 3, name: 'Alt Başlıqlar', href: '#', initial: 'C', current: false },
]

const userNavigation = [
    { name: 'Cıxış', href: '#' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const cooki = new Cookies()

export default function AdminHeader() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const navigate = useNavigate()
    async function handleLogOut() {
        await cooki.remove(configObj.token);
        await cooki.remove("username");
        location.href = "/"
    }

    const url = window.location.href.split("/").pop()

    return (
        <>

            <div>
                <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lp:hidden">
                    <DialogBackdrop
                        transition
                        className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
                    />

                    <div className="fixed inset-0 flex">
                        <DialogPanel
                            transition
                            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
                        >
                            <TransitionChild>
                                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                                    <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                                        <span className="sr-only">Close sidebar</span>
                                        <XMarkIcon aria-hidden="true" className="h-6 w-6 text-white" />
                                    </button>
                                </div>
                            </TransitionChild>
                            {/* Sidebar component, swap this element with another sidebar if you like */}
                            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                                <div className="flex h-16 shrink-0 items-center">
                                    <img
                                        alt="Your Company"
                                        src={Logo}
                                        className="h-8 w-auto"
                                    />
                                </div>
                                <nav className="flex flex-1 flex-col">
                                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                        <li>
                                            <ul role="list" className="-mx-2 space-y-1 adminHeader">
                                                {navigation.map((item) => (
                                                    <li key={item.name}>
                                                        <NavLink
                                                            onClick={() => setSidebarOpen(!sidebarOpen)}
                                                            to={item.href}
                                                            className={classNames(item.current
                                                                ? 'anasehife'
                                                                : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                                                                'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                                                            )}
                                                        >
                                                            <item.icon
                                                                aria-hidden="true"
                                                                className={classNames('text-gray-400 group-hover:text-indigo-600',
                                                                    'h-6 w-6 shrink-0',
                                                                )}
                                                            />
                                                            {item.name}
                                                        </NavLink>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                        <li>
                                            <div className="text-xs font-semibold leading-6 text-gray-400">İrəlidə əlavə olunacaq!</div>
                                            <ul role="list" className="-mx-2 mt-2 space-y-1">
                                                {teams.map((team) => (
                                                    <li key={`c${team.id}`}>
                                                        <Link
                                                            to={team.href}
                                                            className={classNames(
                                                                team.current
                                                                    ? 'bg-gray-50 text-indigo-600'
                                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                                                                'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                                                            )}
                                                        >
                                                            <span
                                                                className={classNames(
                                                                    team.current
                                                                        ? 'border-indigo-600 text-indigo-600'
                                                                        : 'border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600',
                                                                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium',
                                                                )}
                                                            >
                                                                {team.initial}
                                                            </span>
                                                            <span className="truncate">{team.name}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                        <li className="mt-auto">
                                            <div
                                                onClick={handleLogOut}
                                                className="cursor-pointer group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                            >
                                                <BiLogOut
                                                    aria-hidden="true"
                                                    className="rotate-180 h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                                                />
                                                Çıxış et
                                            </div>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>

                {/* Static sidebar for desktop */}
                <div className="hidden lp:fixed lp:inset-y-0 lp:z-50 lp:flex lp:w-72 lp:flex-col">
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
                        <div className="flex h-16 shrink-0 items-center">
                            <img
                                alt="Your Company"
                                src={Logo}
                                className="h-8 w-auto"
                            />
                        </div>
                        <nav className="flex flex-1 flex-col">
                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                <li>
                                    <ul role="list" className="-mx-2 space-y-1 adminHeader">

                                        <li>
                                            <NavLink
                                                to={"/admin"}
                                                className={classNames(url !== "admin" && "noActive", 'hover:bg-gray-50 hover:text-indigo-600', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',)}
                                            >
                                                <HomeIcon
                                                    aria-hidden="true"
                                                    className={classNames(' group-hover:text-indigo-600', 'h-6 w-6 shrink-0',)}
                                                />
                                                Ana Səhifə
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to={"products"}
                                                className={classNames(' text-gray-700 hover:bg-gray-50 hover:text-indigo-600', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',)}
                                            >
                                                <UsersIcon
                                                    aria-hidden="true"
                                                    className={classNames(' group-hover:text-indigo-600', 'h-6 w-6 shrink-0',)}
                                                />
                                                Məhsullar
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to={"category"}
                                                className={classNames(' text-gray-700 hover:bg-gray-50 hover:text-indigo-600', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',)}
                                            >
                                                <FolderIcon
                                                    aria-hidden="true"
                                                    className={classNames(' group-hover:text-indigo-600', 'h-6 w-6 shrink-0',)}
                                                />
                                                Kateqoriyalar
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to={"subcategory"}
                                                className={classNames(' text-gray-700 hover:bg-gray-50 hover:text-indigo-600', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',)}
                                            >
                                                <DocumentDuplicateIcon
                                                    aria-hidden="true"
                                                    className={classNames(' group-hover:text-indigo-600', 'h-6 w-6 shrink-0',)}
                                                />
                                                Subkateqoriya
                                            </NavLink>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <div className="text-xs font-semibold leading-6 text-gray-400">İrəlidə əlavə olunacaq!</div>
                                    <ul role="list" className="-mx-2 mt-2 space-y-1">
                                        {teams.map((team) => (
                                            <li key={`ca${team.id}`}>
                                                <a
                                                    href={team.href}
                                                    className={classNames(
                                                        team.current
                                                            ? 'bg-gray-50 text-indigo-600'
                                                            : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                                                        'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                                                    )}
                                                >
                                                    <span
                                                        className={classNames(
                                                            team.current
                                                                ? 'border-indigo-600 text-indigo-600'
                                                                : 'border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600',
                                                            'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium',
                                                        )}
                                                    >
                                                        {team.initial}
                                                    </span>
                                                    <span className="truncate">{team.name}</span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                                <li className="mt-auto">
                                    <div
                                        onClick={handleLogOut}
                                        className="cursor-pointer group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                    >
                                        <BiLogOut
                                            aria-hidden="true"
                                            className="rotate-180 h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                                        />
                                        Çıxış et
                                    </div>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className="lp:pl-72">
                    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lp:px-8">
                        <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-gray-700 lp:hidden">
                            <span className="sr-only">Open sidebar</span>
                            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
                        </button>

                        {/* Separator */}
                        <div aria-hidden="true" className="h-6 w-px bg-gray-200 lp:hidden" />

                        <div className="flex flex-1 gap-x-4 self-stretch lp:gap-x-6">
                            <form action="#" method="GET" className="relative flex flex-1">
                                <label htmlFor="search-field" className="sr-only">
                                    Search
                                </label>
                                <MagnifyingGlassIcon
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                                />
                                <input
                                    id="search-field"
                                    name="search"
                                    type="search"
                                    placeholder="Search..."
                                    className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                />
                            </form>
                            <div className="flex items-center gap-x-4 lp:gap-x-6">
                                <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                                    <span className="sr-only">View notifications</span>
                                    <BellIcon aria-hidden="true" className="h-6 w-6" />
                                </button>

                                {/* Separator */}
                                <div aria-hidden="true" className="hidden lp:block lp:h-6 lp:w-px lp:bg-gray-200" />

                                {/* Profile dropdown */}
                                <Menu as="div" className="relative">
                                    <MenuButton className="-m-1.5 flex items-center p-1.5">
                                        <span className="sr-only">Open user menu</span>
                                        <img
                                            alt=""
                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                            className="h-8 w-8 rounded-full bg-gray-50"
                                        />
                                        <span className="hidden lp:flex lp:items-center">
                                            <span aria-hidden="true" className="ml-4 text-sm font-semibold leading-6 capitalize text-gray-900">
                                                {cooki.get("username")}
                                            </span>
                                            <ChevronDownIcon aria-hidden="true" className="ml-2 h-5 w-5 text-gray-400" />
                                        </span>
                                    </MenuButton>
                                    <MenuItems
                                        transition
                                        className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                    >
                                        {userNavigation.map((item) => (
                                            <MenuItem key={item.name}>
                                                <div
                                                    onClick={handleLogOut}
                                                    className=" cursor-pointer flex items-center gap-2 px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
                                                >
                                                    <IoIosLogOut className='text-[red]' />
                                                    {item.name}
                                                </div>
                                            </MenuItem>
                                        ))}
                                    </MenuItems>
                                </Menu>
                            </div>
                        </div>
                    </div>

                    <main className="py-10">
                        <div className="px-4 sm:px-6 lp:px-8">

                            <Outlet />

                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}