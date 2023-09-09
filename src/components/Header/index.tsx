import Link from "next/link";
import { useState } from "react";

import Label from "@/components/Label";
import useMediaQuery from "@/hooks/useMediaHook";
import { IMediaQuery } from "@/types/IMediaQuery";

type IHeaderLink = {
  name: string;
  url: string;
  isBeta?: boolean;
  hasModal?: boolean;
  modal?: {
    text: string;
  };
};

type IHeaderProps = {
  address: string | undefined;
  onLogin: () => {};
  onDisconnect: () => {};
  linksList: IHeaderLink[];
  // @ts-ignore
  // eslint-disable-next-line react/no-unused-prop-types
  className?: string | undefined;
};

type IConnectBtn = {
  btnText: string;
  onClick: () => {};
};

const delMiddleAddrSubstr = (str: string | undefined) => {
  const numb = 6;
  return (
    // eslint-disable-next-line no-unsafe-optional-chaining
    `${str?.substring(0, numb - 1)}...${str?.substring(str?.length - numb)}`
  );
};

const ConnectBtn = (props: IConnectBtn) => {
  const { btnText, onClick } = props;

  return (
    <button
      type="button"
      className="focus-visible:ring-ring ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-lg px-4 py-2 text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      onClick={onClick}
    >
      {btnText}
    </button>
  );
};

const NavMenu = (
  props: Omit<IHeaderProps, "address" | "onLogin" | "onDisconnect">
) => {
  const { linksList, className } = props;
  return (
    <nav className={`${className}`}>
      <ul className="flex flex-col lg:flex-row lg:space-x-8">
        {linksList?.map((link: IHeaderLink, index) => {
          return (
            <li
              key={`header:${index}`}
              className={`flex items-center gap-3 ${
                link.hasModal ? "has-popup " : ""
              }`}
            >
              <Link
                style={{
                  opacity: !link.isBeta ? "1" : "0.5",
                  textDecoration: link.isBeta ? "none" : "inhherit",
                  cursor: !link.isBeta ? "pointer" : "default",
                }}
                href={!link.isBeta ? link.url : {}}
                className={`focus-visible:ring-ring ring-offset-background text-primary text-md inline-flex h-10 items-center justify-center rounded-lg p-0 font-medium underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${+(link.isBeta
                  ? "disabled:pointer-events-none disabled:opacity-50 "
                  : "")}`}
              >
                {link.name}
              </Link>
              {link.isBeta ? <Label text="BETA" /> : ""}
              {link.hasModal ? (
                <span className="popup bg-secondary rounded-md p-4 text-white">
                  {link.modal?.text}
                </span>
              ) : (
                ""
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

const HeaderLg = (props: IHeaderProps) => {
  const { address, onLogin, onDisconnect, linksList } = props;

  return (
    <header className="sticky top-0 z-10 hidden w-full py-5 lg:block">
      <div className="container flex justify-between gap-8 px-5 ">
        <div className="flex items-center gap-5">
          <h1 className="text-4xl">
            <Link href="/" className="color">
              <strong>ADA</strong> RAFFLES
            </Link>
          </h1>
        </div>
        <NavMenu linksList={linksList} />
        <nav>
          <ul className="flex flex-col gap-3 sm:flex-row">
            <li>
              {address ? (
                <div className="flex flex-row items-center gap-3">
                  {" "}
                  <p>{delMiddleAddrSubstr(address)}</p>
                  <ConnectBtn btnText="Logout" onClick={onDisconnect} />
                </div>
              ) : (
                <ConnectBtn btnText="Connect" onClick={onLogin} />
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

const HeaderMdSm = (props: IHeaderProps) => {
  const { address, onLogin, onDisconnect, linksList } = props;
  const [isOpen, setIsOpen] = useState<string | undefined>("hidden");

  const showMobileMenuHandler = () => {
    if (isOpen === "hidden") {
      setIsOpen("false");
    } else {
      setIsOpen("hidden");
    }
  };

  return (
    <header className="sticky top-0 z-10 w-full py-5 lg:hidden">
      <div className="container flex flex-col justify-between gap-8 px-5 lg:flex-row">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className="flex gap-5">
              <button
                type="button"
                aria-label="Toggle mobile menu"
                onClick={showMobileMenuHandler}
              >
                {isOpen === "hidden" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-menu"
                  >
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-x"
                  >
                    <line x1="18" x2="6" y1="6" y2="18" />
                    <line x1="6" x2="18" y1="6" y2="18" />
                  </svg>
                )}
              </button>
              <h1 className="text-2xl">
                <Link href="/">
                  <strong>Ada</strong> Raffles
                </Link>
              </h1>
            </div>
            <nav>
              <ul className="flex flex-col gap-3 sm:flex-row">
                <li>
                  {address ? (
                    <div className="flex flex-row items-center gap-3">
                      {" "}
                      <p>{delMiddleAddrSubstr(address)}</p>
                      <ConnectBtn btnText="Logout" onClick={onDisconnect} />
                    </div>
                  ) : (
                    <ConnectBtn btnText="Connect" onClick={onLogin} />
                  )}
                </li>
              </ul>
            </nav>
          </div>
          <NavMenu
            className={`mobile-header ${isOpen}`}
            linksList={linksList}
          />
        </div>
      </div>
    </header>
  );
};

const Header = (props: IHeaderProps) => {
  // @ts-ignore
  const isMobile = useMediaQuery<IMediaQuery>({
    width: 1024,
  });

  return !isMobile ? <HeaderLg {...props} /> : <HeaderMdSm {...props} />;
};

export default Header;
