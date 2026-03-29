import { AuthForm } from "../components/AuthForm";
import MainLayout from "../layouts/MainLayout";

export default function LogIn({
  redirect,
  error,
}: {
  redirect?: string;
  error?: string;
}) {
  return (
    <MainLayout>
      <div class="flex justify-center">
        <AuthForm
          action="Log in"
          description="Enter your email below to login to your account."
          redirect={redirect}
          error={error}
        />
      </div>
    </MainLayout>
  );
}
