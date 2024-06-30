// const Header = () => {
//   return (
//     <div className="bg-black">
//       <div className="navbar flex px-11 py-[22px]">
//         <div className="navbar-start  ">
//           <div className="dropdown">
//             <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M4 6h16M4 12h8m-8 6h16"
//                 />
//               </svg>
//             </div>
//             <ul
//               tabIndex={0}
//               className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
//             >
//               <li>
//                 <a className="text-white text-xs">PROJECTS</a>
//               </li>
//               <li>
//                 <a className="text-white text-xs">ABOUT</a>
//               </li>
//             </ul>
//           </div>
//           <a className="text-[36px] text-white font-normal">FAHAD K.</a>
//         </div>
//         <div className="navbar-center hidden lg:flex ">
//           <ul className="menu menu-horizontal px-1">
//             <li>
//               <a className="text-white text-xs">PROJECTS</a>
//             </li>
//             <li>
//               <a className="text-white text-xs">ABOUT</a>
//             </li>
//           </ul>
//         </div>
//         <div className="navbar-end ">
//           <div className="border border-white px-3 py-1  rounded-full">
//             <a className="text-white text-xs">AVAILABLE FOR HIRED</a>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Header

import Link from 'next/link'
import { CircleUser, Menu, Package2, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { TextAnimation } from './animation/TextAnimation'

export default function Header() {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4   px-4 md:px-6 bg-black bg-opacity-5 z-50">
      {/* for desktop view */}
      <nav className="hidden flex-col justify-between gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:justify-between md:gap-5 md:text-sm lg:gap-6  w-full">
        <div>
          <Link
            href="#"
            className="text-foreground transition-colors hover:text-foreground"
          >
            <p className="text-[36px] text-white font-normal">FAHAD K.</p>
          </Link>
        </div>
        <div className="flex gap-4  hover:text-black">
          <Link
            href="/projects"
            className="text-foreground transition-colors   px-2 py-[4px] rounded-xl text-white hover:bg-white hover:text-black flex items-center"
          >
            {/* <p className="text-white hover:text-black text-sm">PROJECTS</p> */}
            <TextAnimation text="PROJECTS" size={'sm'} font={'light'} />
          </Link>
          <Link
            href="#"
            className="text-foreground transition-colors hover:text-foreground  px-2 py-[4px] rounded-xl  hover:bg-white text-white"
          >
            {/* <p className="text-white hover:text-black text-sm">ABOUT</p> */}
            <TextAnimation text="ABOUT" size={'sm'} font={'light'} />
          </Link>
        </div>
        <div>
          <Link
            href="#"
            className="text-foreground transition-colors hover:text-foreground "
          >
            <div className="border border-white px-3 py-2  rounded-full text-white hover:bg-white hover:text-black">
              {/* <p className="text-white text-sm">AVAILABLE FOR HIRED</p> */}
              <TextAnimation
                text="AVAILABLE &nbsp;FOR &nbsp;HIRED"
                size={'sm'}
                font={'light'}
              />
            </div>
          </Link>
        </div>
      </nav>

      {/* for mobile view */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <nav className="grid gap-6 text-lg font-medium">
            <Link href="#" className="hover:text-foreground">
              Home
            </Link>
            <Link href="#" className="hover:text-foreground">
              Projects
            </Link>
            <Link href="#" className="hover:text-foreground">
              About
            </Link>
            <Link href="#" className="hover:text-foreground">
              Hire Me
            </Link>
            <hr />
            <div className="flex justify-between ">
              <Link href="#" className="hover:text-foreground">
                GH
              </Link>
              <Link href="#" className="hover:text-foreground">
                LD
              </Link>
              <Link href="#" className="hover:text-foreground">
                FB
              </Link>
              <Link href="#" className="hover:text-foreground">
                EM
              </Link>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}
