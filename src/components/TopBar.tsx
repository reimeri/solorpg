import { SignOut } from './SignOut';

export const TOP_BAR_HEIGHT = 55;

export function TopBar() {
  return (
    <div
      className="flex items-center justify-between px-4 shadow"
      style={{ height: `${TOP_BAR_HEIGHT}px` }}
    >
      <h1 className="font-bold text-lg">SoloRPG</h1>
      <div className="flex items-center gap-4">
        <a className="hover:underline" href="/">
          Home
        </a>
        <a className="hover:underline" href="/about">
          About
        </a>
        <a
          className="hover:underline"
          href="/campaign/kx7d8hcvw15zavdwp6bh0tt1ys7mx0aw"
        >
          Campaign
        </a>
        <SignOut />
      </div>
    </div>
  );
}
