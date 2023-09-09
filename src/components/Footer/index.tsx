import Link from "next/link";

import CustomGoogleForm from "@/components/Forms/CustomGoogleForm";
import Label from "@/components/Label";

const Footer = () => {
  return (
    <footer className="footer-bg mt-20 mt-auto bg-white py-8 text-lg">
      <h2 className="sr-only">Footer</h2>
      <div className="container grid gap-10 px-5 md:grid-cols-2">
        <div>
          <h3 className="mb-3 font-bold text-white">Stay Connected</h3>
          <CustomGoogleForm />
        </div>
        <div className="md:text-right">
          <h3 className="mb-2 font-bold text-white">Links</h3>
          <ul className="mt-2 space-y-2">
            <li>
              <Link href="https://twitter.com/ada_raffles">Twitter</Link>
            </li>
            {/* <li>
              <a href="https://venom.network/tasks">Discord</a>
            </li> */}
            <li className="flex self-center md:justify-end sm:justify-start">
              <Link
                style={{
                  opacity: "0.5",
                  textDecoration: "none",
                  cursor: "default",
                }}
                href={{}}
                className="disabled:pointer-events-none disabled:opacity-50"
              >
                Guide
              </Link>
              <Label className="ml-2" text="BETA" />
            </li>
          </ul>
        </div>
      </div>
      <div className="container mt-10 flex justify-between p-0">
        <span className="text-white">Privacy Policy</span>
        <span className="text-white">© 2023 ADA RAFFLES.</span>
        <span className="text-white">Cookies</span>
      </div>
    </footer>
  );
};

export default Footer;
