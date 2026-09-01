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
      <div className="flex items-center justify-between border-b border-portal-purple/20 bg-card/60 p-4 backdrop-blur">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              data-testid="menu-trigger"
              className="gap-2 border border-portal-green/40 bg-neutral-900 text-white shadow-[0_0_16px_-4px_rgba(164,226,76,0.6)] hover:bg-neutral-800"
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
            className="flex items-center gap-2 rounded-full border border-portal-blue/30 bg-background px-3 py-1.5 shadow-sm"
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
            className="flex h-9 w-9 items-center justify-center rounded-full border border-portal-purple/30 bg-background text-muted-foreground transition-colors hover:text-portal-purple"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
        <div className="relative flex items-center justify-center">
          <span className="absolute h-64 w-64 animate-[spin_8s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,#A4E24C,#22D3EE,#9D6BFF,#F5D80E,#A4E24C)] opacity-30 blur-2xl" />
          <span className="absolute h-56 w-56 animate-ping rounded-full bg-primary/20" />
          <button
            data-testid="help-button"
            onClick={handleHelp}
            className="relative h-56 w-56 rounded-full bg-primary text-3xl font-extrabold text-primary-foreground shadow-[0_8px_30px_rgba(211,28,28,0.4)] transition-transform active:scale-95"
          >
            הצילו
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-l from-portal-green via-portal-blue to-portal-purple bg-clip-text p-5 text-center text-xl font-extrabold text-transparent">
        helpMe!
      </div>
    </div>
  );
}
