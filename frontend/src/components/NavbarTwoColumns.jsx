import Link from 'next/link';
// import { ReactNode } from 'react';


const NavbarTwoColumns = (props) => (
  <div className="flex items-center justify-between">
    <div>
      <Link href="/">{props.logo}</Link>
    </div>

    <nav>
      <ul className="navbar flex items-center text-xl font-medium text-gray-800">
        {props.children}
      </ul>
    </nav>

    <style jsx>
      {`
        .navbar :global(li:not(:first-child)) {
          @apply mt-0;
        }

        .navbar :global(li:not(:last-child)) {
          @apply mr-5;
        }
      `}
    </style>
  </div>
);

export default NavbarTwoColumns;
