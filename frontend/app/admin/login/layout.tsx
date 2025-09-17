import { ReactNode } from "react";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
   
      <div className="flex h-screen items-center justify-center bg-gray-100">
        {children}
      </div>
 
  );
}
