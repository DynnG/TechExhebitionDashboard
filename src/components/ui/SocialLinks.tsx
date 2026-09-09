import { Linkedin, Facebook, Instagram, Youtube } from "lucide-react";

export function SocialLinks() {
  const links = [
    {
      href: "https://www.linkedin.com/in/lifewood-admin-ph-37039038a/",
      icon: Linkedin,
      label: "LinkedIn",
    },
    {
      href: "https://www.facebook.com/LifewoodPH",
      icon: Facebook,
      label: "Facebook",
    },
    {
      href: "https://www.instagram.com/lifewoodph",
      icon: Instagram,
      label: "Instagram",
    },
    {
      href: "https://www.youtube.com/@lifewooddatatechnology",
      icon: Youtube,
      label: "YouTube",
    },
  ];

  return (
    <div className="mt-8 pt-6 border-t border-[#D8D2C8] text-center">
      <p className="text-xs font-semibold text-[#666666] mb-3 uppercase tracking-wider">
        VISIT US HERE
      </p>
      <div className="flex items-center justify-center gap-3">
        {links.map((social) => {
          const Icon = social.icon;
          return (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#F9F7F7] hover:bg-[#046241]/10 text-[#133020] hover:text-[#046241] rounded-xl border border-[#D8D2C8] transition flex items-center justify-center"
              aria-label={social.label}
            >
              <Icon className="w-5 h-5" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
