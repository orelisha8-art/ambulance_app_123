import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Siren } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card.jsx";
import { Label } from "../components/ui/label.jsx";
import { Input } from "../components/ui/input.jsx";
import { validateFullName, validatePassword } from "../utils/validation.js";
import { saveUser } from "../utils/storage.js";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const nameError = nameTouched ? validateFullName(name) : "";
  const passwordError = passwordTouched ? validatePassword(password) : "";

  useEffect(() => {
    if (!validateFullName(name) && !validatePassword(password)) {
      saveUser({ name, password });
      navigate(`/main/${encodeURIComponent(name)}`, { replace: true });
    }
  }, [name, password, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-sm border-portal-purple/30 shadow-[0_0_40px_-10px_rgba(157,107,255,0.35)]">
        <CardHeader className="items-center text-center">
          <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-portal-green to-portal-blue text-neutral-900">
            <Siren className="h-6 w-6" />
          </div>
          <CardTitle className="bg-gradient-to-l from-portal-green via-portal-blue to-portal-purple bg-clip-text text-transparent">
            helpMe!
          </CardTitle>
          <CardDescription>הרשמה חד-פעמית כדי להתחיל</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">שם מלא</Label>
            <div data-testid="name-error" className="min-h-[16px] text-xs font-medium text-destructive">
              {nameError}
            </div>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setNameTouched(true)}
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">סיסמה</Label>
            <div data-testid="password-error" className="min-h-[16px] text-xs font-medium text-destructive">
              {passwordError}
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setPasswordTouched(true)}
              autoComplete="off"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
