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
import { RxHamburgerMenu } from 'react-icons/rx'

export default function Header() {
  return (
    <header className="sticky  top-0 flex h-16 items-center gap-4   px-4 md:px-6 bg-black bg-opacity-5  z-[999] backdrop-blur-sm">
      {/* <div className="w-full h-16 absolute top-0 left-0 bg-black opacity-50  z-[-1]"></div> */}

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
                text="AVAILABLE &nbsp;TO &nbsp;HIRED"
                size={'sm'}
                font={'light'}
              />
            </div>
          </Link>
        </div>
      </nav>

      {/* for mobile view */}
      <Sheet>
        <div className="flex items-center justify-between  w-full md:hidden">
          <div>
            <p className="text-2xl font-medium text-white">AK.</p>
          </div>
          <SheetTrigger asChild>
            {/* <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <RxHamburgerMenu className="text-white" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button> */}
            <RxHamburgerMenu className="text-white w-5 h-5  flex justify-end" />
          </SheetTrigger>
        </div>

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
