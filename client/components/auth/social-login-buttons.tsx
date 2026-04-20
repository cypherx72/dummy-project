import { FaGoogle, FaLinkedinIn } from "react-icons/fa6";
import { Button } from "@/components/ui/button";

const providers = [
  { id: "google", name: "Google", icon: FaGoogle },
  { id: "linkedin", name: "LinkedIn", icon: FaLinkedinIn },
];

export function SocialLoginButtons() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  
  const onSubmitHandler = async (provider: string) => {
    // Don't use fetch — use a redirect:
    window.open(`${API_URL}/auth/${provider}`, "_self");
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
            onClick={() => onSubmitHandler(provider.id)}
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
