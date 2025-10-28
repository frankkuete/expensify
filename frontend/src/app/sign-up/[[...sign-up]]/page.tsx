import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
  <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        alt="Your Company"
        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
        className="mx-auto h-10 w-auto"
      />
      <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight">Welcome to Expensify</h2>
    </div>

       <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
         <SignUp
           fallbackRedirectUrl="/dashboard"
           forceRedirectUrl="/dashboard"
         />
      </div>
  </div>
  );
}
