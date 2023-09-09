import CustomGoogleForm from "@/components/Forms/CustomGoogleForm";

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
              <a href="https://venom.network/">Twitter</a>
            </li>
            <li>
              <a href="https://venom.network/tasks">Discord</a>
            </li>
            <li>
              <a href="https://venom.network/faucet">Git Book</a>
            </li>
            <li>
              <a href="https://medium.com/@Venom_network_/mastering-the-venom-testnet-a-comprehensive-guide-to-interacting-with-dapps-nfts-and-defi-7aa90abcce93">
                Guide
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mt-10 p-0 flex justify-between">
        <span className="text-white">Privacy Policy</span>
        <span className="text-white">© 2023 ADA RAFFLES.</span>
        <span className="text-white">Cookies</span>
      </div>
    </footer>
  );
};

export default Footer;
