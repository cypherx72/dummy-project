import { FaGoogle, FaLinkedinIn } from "react-icons/fa6";
import { Button } from "@/components/ui/button";

const providers = [
  { id: "google", name: "Google", icon: FaGoogle },
  { id: "linkedin", name: "LinkedIn", icon: FaLinkedinIn },
];

export function SocialLoginButtons() {
  const onSubmitHandler = async (provider: string) => {
    // Don't use fetch — use a redirect:
    window.open("http://localhost:4000/auth/google", "_self");
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="border-border border-t w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="gap-3 grid grid-cols-2">
        {providers.map((provider) => (
          <Button
            key={provider.id}
            variant="outline"
            type="button"
            onClick={() => {
              /**
               *revet to this if failure  
                window.location.href = `http://localhost:4000/auth/signin?provider=${provider.id}`;
               */
              onSubmitHandler(provider.id);
            }}
            className="gap-2 h-11 font-medium"
          >
            <provider.icon className="w-4 h-4" />
            {provider.name}
          </Button>
        ))}
      </div>
    </div>
  );
}

// import { FaGoogle, FaLinkedinIn } from "react-icons/fa6";
// import { Button } from "@/components/ui/button";

// import { signInWithOAuth } from "./auth";
// const providers = [
//   { id: "google", name: "Google", icon: FaGoogle },
//   { id: "linkedIn", name: "LinkedIn", icon: FaLinkedinIn },
// ];

// interface SocialLoginButtonsProps {
//   isLoading?: boolean;
// }

// export function SocialLoginButtons({ isLoading }: SocialLoginButtonsProps) {
//   return (
//     <div className="space-y-3">
//       <div className="relative">
//         <div className="absolute inset-0 flex items-center">
//           <span className="border-border border-t w-full" />
//         </div>
//         <div className="relative flex justify-center text-xs uppercase">
//           <span className="bg-card px-2 text-muted-foreground">
//             Or continue with
//           </span>
//         </div>
//       </div>
//       <div className="gap-3 grid grid-cols-2">
//         {providers.map((provider) => (
//           <Button
//             key={provider.id}
//             variant="outline"
//             type="button"
//             disabled={isLoading}
//             onClick={() => {
//               window.location.href = `http://localhost:4000/auth/signin?provider=${provider.id}`;
//             }}
//             className="gap-2 h-11 font-medium"
//           >
//             <provider.icon className="w-4 h-4" />
//             {provider.name}
//           </Button>
//         ))}
//       </div>
//     </div>
//   );
// }
