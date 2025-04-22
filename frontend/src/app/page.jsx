import { redirect } from "next/navigation";
import { TagsProvider } from '../hooks/tagsContext';
import ThemeProvider from '../components/ThemeProvider';

// use content - user to check if user is logged in and redirect to home if they are
export default function Home() {
  redirect('/landing');

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TagsProvider>
        {/* The component will never render because redirect will be called first */}
      </TagsProvider>
    </ThemeProvider>
  );
}
