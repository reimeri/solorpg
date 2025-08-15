import { useAuthActions } from '@convex-dev/auth/react';

export function SignIn() {
  const { signIn } = useAuthActions();
  return (
    <button
      className="rounded bg-neutral-950 p-2 text-white"
      // biome-ignore lint/complexity/noVoid: Void informs that the promise is intentionally ignored
      onClick={() => void signIn('github')}
      type="button"
    >
      Sign in with GitHub
    </button>
  );
}
