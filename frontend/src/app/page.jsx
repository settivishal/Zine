import { redirect } from "next/navigation";
import { TagsProvider } from '../hooks/tagsContext';

// use content - user to check if user is logged in and redirect to home if they are
export default function Home() {
  redirect('/landing');

  return (
    <TagsProvider>
      {/* The component will never render because redirect will be called first */}
    </TagsProvider>
  );
}
