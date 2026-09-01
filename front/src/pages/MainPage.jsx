import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import { Button } from "../components/ui/button.jsx";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../components/ui/dropdown-menu.jsx";
import { CENTERS, DEFAULT_CENTER_ID, getCenterById } from "../utils/centers.js";
import { CENTER_ICONS } from "../utils/centerIcons.jsx";
import { loadSelectedCenterId, saveSelectedCenterId, loadUser, clearUser } from "../utils/storage.js";
import { cn } from "../lib/utils.js";

export default function MainPage() {
  const navigate = useNavigate();
  const user = loadUser();
  const [selectedId, setSelectedId] = useState(loadSelectedCenterId() || DEFAULT_CENTER_ID);

  const center = getCenterById(selectedId);
  const CenterIcon = CENTER_ICONS[center.id];

  function handleSelect(id) {
    setSelectedId(id);
    saveSelectedCenterId(id);
  }

  async function handleHelp() {
    fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: user?.name, centerId: center.id, centerName: center.name, phone: center.phone }),
    }).catch(() => {});
    navigate(`/request/${center.phone}`);
  }

  function handleLogout() {
    if (!window.confirm("להתנתק ולחזור למסך ההרשמה?")) return;
    clearUser();
    navigate("/", { replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-portal-purple/20 bg-card/70 p-4 shadow-[0_4px_30px_-10px_rgba(157,107,255,0.35)] backdrop-blur-xl">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              data-testid="menu-trigger"
              className="gap-2 border border-portal-green/40 bg-neutral-900 text-white shadow-[0_0_16px_-4px_rgba(164,226,76,0.6)] transition-shadow hover:bg-neutral-800 hover:shadow-[0_0_22px_-2px_rgba(164,226,76,0.75)]"
            >
              <Menu className="h-4 w-4" />
              תפריט
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {CENTERS.map((c) => {
              const Icon = CENTER_ICONS[c.id];
              return (
                <DropdownMenuItem
                  key={c.id}
                  className={cn("gap-2", c.id === selectedId && "bg-accent text-accent-foreground")}
                  onSelect={() => handleSelect(c.id)}
                >
                  <Icon className="h-4 w-4" />
                  {c.name}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2">
          <div
            data-testid="center-indicator"
            className="flex items-center gap-2 rounded-full border border-portal-blue/30 bg-background/80 px-3 py-1.5 shadow-[0_0_16px_-6px_rgba(34,211,238,0.8)] transition-shadow"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-portal-blue/15 text-portal-blue">
              <CenterIcon className="h-4 w-4" />
            </span>
            <span className="text-base font-bold">{center.phone}</span>
          </div>

          <button
            data-testid="logout-button"
            onClick={handleLogout}
            aria-label="התנתקות"
            title="התנתקות"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-portal-purple/30 bg-background/80 text-muted-foreground transition-colors hover:border-portal-purple hover:text-portal-purple"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-8 p-6">
        <div className="relative flex items-center justify-center">
          <span className="absolute h-72 w-72 animate-[spin_10s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,#A4E24C,#22D3EE,#9D6BFF,#F5D80E,#A4E24C)] opacity-25 blur-3xl" />
          <span className="absolute h-64 w-64 animate-ping rounded-full bg-primary/15 [animation-duration:2.5s]" />
          <span className="absolute h-56 w-56 animate-ping rounded-full bg-primary/20 [animation-delay:0.6s] [animation-duration:2.5s]" />
          <button
            data-testid="help-button"
            onClick={handleHelp}
            className="relative h-56 w-56 rounded-full bg-primary text-3xl font-extrabold tracking-wide text-primary-foreground shadow-[0_8px_40px_-4px_rgba(211,28,28,0.55)] ring-4 ring-primary/25 transition-all hover:scale-[1.03] hover:shadow-[0_8px_50px_-2px_rgba(211,28,28,0.7)] active:scale-95"
          >
            הצילו
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 border-t border-portal-purple/10 p-5">
        <div className="bg-gradient-to-l from-portal-green via-portal-blue to-portal-purple bg-clip-text text-xl font-extrabold text-transparent">
          helpMe!
        </div>
        <div className="text-xs text-muted-foreground">העזרה כבר בדרך</div>
      </div>
    </div>
  );
}
