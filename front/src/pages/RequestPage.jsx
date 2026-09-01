import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button.jsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog.jsx";
import { Card, CardContent } from "../components/ui/card.jsx";
import { Label } from "../components/ui/label.jsx";
import { Input } from "../components/ui/input.jsx";
import { getCenterByPhone } from "../utils/centers.js";
import { CENTER_ICONS } from "../utils/centerIcons.jsx";
import { loadUser } from "../utils/storage.js";

const MAX_ATTEMPTS = 3;

export default function RequestPage() {
  const navigate = useNavigate();
  const { phone } = useParams();
  const user = loadUser();
  const center = getCenterByPhone(phone);
  const CenterIcon = center ? CENTER_ICONS[center.id] : null;

  const [modalOpen, setModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState("");

  function openModal() {
    setPassword("");
    setConfirmPassword("");
    setError("");
    setModalOpen(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const isValid = password === user?.password && confirmPassword === user?.password;

    if (isValid) {
      setModalOpen(false);
      navigate(`/main/${encodeURIComponent(user.name)}`, { replace: true });
      return;
    }

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setPassword("");
    setConfirmPassword("");

    if (nextAttempts >= MAX_ATTEMPTS) {
      setLocked(true);
      setModalOpen(false);
      setError("");
    } else {
      setError(`סיסמה שגויה. נותרו ${MAX_ATTEMPTS - nextAttempts} ניסיונות`);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <Card className="w-full max-w-sm border-portal-blue/30 shadow-[0_0_40px_-10px_rgba(34,211,238,0.3)]">
        <CardContent data-testid="request-info" className="flex flex-col items-center gap-4 pt-6 text-center">
          {CenterIcon && (
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-portal-blue/15 text-portal-blue">
              <CenterIcon className="h-7 w-7" />
            </span>
          )}
          <div className="text-4xl font-extrabold text-primary">{phone}</div>
          <div className="text-lg font-bold">
            {phone} {center?.name}
          </div>
          <div className="text-muted-foreground">{user?.name}</div>

          <Button
            data-testid="cancel-button"
            variant="outline"
            disabled={locked}
            onClick={openModal}
            className="mt-2 w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground disabled:border-muted-foreground disabled:text-muted-foreground"
          >
            ביטול
          </Button>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>אימות ביטול בקשה</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cancel-password">סיסמה</Label>
              <Input
                id="cancel-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cancel-password-confirm">אישור סיסמה</Label>
              <Input
                id="cancel-password-confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {error && (
              <div data-testid="cancel-error" className="text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => setModalOpen(false)}
              >
                חזרה
              </Button>
              <Button type="submit" variant="destructive" className="flex-1">
                אישור
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
