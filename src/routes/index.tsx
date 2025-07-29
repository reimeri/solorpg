import { convexQuery, useConvexMutation } from '@convex-dev/react-query';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react';
import { NotebookPen } from 'lucide-react';
import { useState } from 'react';
import { SignIn } from '~/components/SignIn';
import { SignOut } from '~/components/SignOut';
import { cn } from '~/utils/cn';
import { api } from '../../convex/_generated/api';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  // Prefetch the tasks data on the server during SSR
  // Problem with this is that user data is not available during SSR
  // and the tasks are not filtered by user, so all public tasks are
  // briefly visible when the page loads. Can be easily fixed by
  // by loading the data using useQuery instead of useSuspenseQuery.
  // This is just an example of how to use useSuspenseQuery
  const { data } = useSuspenseQuery(convexQuery(api.tasks.get, {}));
  const toggleCompleted = useConvexMutation(api.tasks.toggleCompleted);
  const createTask = useConvexMutation(api.tasks.create);
  const deleteTask = useConvexMutation(api.tasks.deleteTask);
  const [todoText, setTodoText] = useState('');
  const { data: user } = useSuspenseQuery(convexQuery(api.users.me, {}));

  return (
    <div>
      <div className="mx-auto flex max-w-2xl flex-col gap-4 p-4">
        <div className="flex items-center gap-2">
          <NotebookPen className="inline-block h-8 w-8" />
          <h1 className="font-bold text-2xl">Tasks</h1>
        </div>
        <Authenticated>
          <div>📧 {user?.email}</div>
          <div>👤 {user?.name}</div>
          <div>🆔 {user?._id}</div>
          <SignOut />
        </Authenticated>
        <Unauthenticated>
          <SignIn />
        </Unauthenticated>
        <AuthLoading>
          <div>Loading user...</div>
        </AuthLoading>
        <div className="flex gap-2">
          <input
            className="rounded border border-neutral-400 p-2"
            onInput={(e) => setTodoText(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && todoText.trim() !== '') {
                createTask({ text: todoText });
                setTodoText('');
              }
            }}
            placeholder="New task"
            type="text"
            value={todoText}
          />
          <button
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={() => {
              if (todoText.trim() !== '') {
                createTask({ text: todoText });
                setTodoText('');
              }
            }}
            type="button"
          >
            Add Task
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {data?.map(({ _id, text, isCompleted }) => (
            <div className="flex items-center gap-2" key={_id}>
              <button
                className="rounded bg-neutral-100 px-4 py-2 text-white hover:bg-neutral-200"
                onClick={() => toggleCompleted({ id: _id })}
                type="button"
              >
                {isCompleted ? '✅' : '❌'}
              </button>
              <button
                className="rounded bg-red-300 px-4 py-2 text-white hover:bg-red-400"
                onClick={() => deleteTask({ id: _id })}
                type="button"
              >
                🗑️
              </button>
              <div
                // cn for conditional class names
                className={cn('rounded bg-neutral-200 p-2', {
                  'line-through': isCompleted,
                  'text-neutral-500': isCompleted,
                  'text-black': !isCompleted,
                })}
              >
                {text}
              </div>
            </div>
          ))}
        </div>
        <h2 className="font-bold text-xl">Links</h2>
        <Link
          className="text-blue-500 visited:text-purple-500 hover:underline"
          to="/about"
        >
          Go to About
        </Link>
      </div>
    </div>
  );
}
