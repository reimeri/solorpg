import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/about/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 p-4">
      Hello "/about/"!
      <Link
        className="text-blue-500 visited:text-purple-500 hover:underline"
        to="/"
      >
        Go to Home
      </Link>
    </div>
  );
}
