import { useAuthActions } from '@convex-dev/auth/react';

export function SignOut() {
  const { signOut } = useAuthActions();
  return (
    <button
      className="rounded bg-blue-500 p-2 text-white"
      // biome-ignore lint/complexity/noVoid: Void informs that the promise is intentionally ignored
      onClick={() => void signOut()}
      type="button"
    >
      Sign out
    </button>
  );
}
