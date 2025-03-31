import { redirect } from "next/navigation";
import { TagsProvider } from '../hooks/tagsContext';

// use content - user to check if user is logged in and redirect to home if they are
export default function Home() {
  return (
    <TagsProvider>
      <redirect to="/landing" />
    </TagsProvider>
  );
}
