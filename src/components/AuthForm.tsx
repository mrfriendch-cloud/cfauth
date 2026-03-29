import Button from "./Button";
import Input from "./Input";

type AuthFormProps = {
  description: string;
  action: "Log in" | "Sign up";
  redirect?: string;
  error?: string;
};

export function AuthForm({
  description,
  action,
  redirect,
  error,
}: AuthFormProps) {
  const targetUrl = `/api/auth/${action === "Log in" ? "login" : "signup"}`;

  return (
    <form class="w-full max-w-sm pt-8" method="POST" action={targetUrl}>
      {redirect && <input type="hidden" name="redirect" value={redirect} />}
      <div class="mb-8">
        <h1 className="text-2xl">{action}</h1>
        <p>{description}</p>
      </div>
      {error && (
        <div class="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {error}
        </div>
      )}
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Input
            name="email"
            placeholder="Email"
            label="email"
            type="email"
            hasBottomMargin
            required
          />
        </div>
        <div className="grid gap-2">
          <Input
            name="password"
            placeholder="Password"
            label="password"
            type="password"
            hasBottomMargin
            required
          />
        </div>
      </div>
      <div>
        <Button type="submit" text={action} />
      </div>
    </form>
  );
}
