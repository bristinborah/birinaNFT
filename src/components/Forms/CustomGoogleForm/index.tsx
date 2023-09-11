import { useCallback, useState } from "react";

const CustomGoogleForm = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [isSended, setIsSended] = useState<boolean>(false);

  const isValidEmail = () => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const onSubmit = useCallback(async () => {
    try {
      if (isValidEmail()) {
        setError(false);
        await fetch(
          `https://docs.google.com/forms/d/e/1FAIpQLScZ6vX0UhGzWASDS4oPZO9vSkdQ6diH-BQGZu-0VAq_XpgoDQ/formResponse?${new URLSearchParams(
            {
              emailAddress: email,
              submit: "Submit",
            }
          )}`,
          {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        setIsSended(true);

        setTimeout(() => {
          setIsSended(false);
        }, 3000);
      } else {
        setError(true);
      }
    } catch (e) {
      console.log("GoogleFormError:", e);
    }
  }, [email, error, setError, setIsSended]);

  return (
    <div className="grid w-full items-center gap-3 md:max-w-sm">
      <div>
        <label
          className="text-sm text-white font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="email"
        >
          Email *
        </label>
        <input
          type="email"
          className="border-input text-white ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error ? (
          <span className="text-sm text-red-600">
            &nbsp;&nbsp;Email is not corrected
          </span>
        ) : (
          ""
        )}
      </div>
      {isSended ? (
        <div
          className="flex items-center justify-between rounded bg-slate-300 p-4 text-slate-800"
          role="alert"
        >
          <p className="text-sm">Email successfully sended</p>
        </div>
      ) : (
        ""
      )}
      <button
        type="button"
        onClick={onSubmit}
        className="focus-visible:ring-ring ring-offset-background bg-secondary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        Subscribe
      </button>
    </div>
  );
};

export default CustomGoogleForm;
