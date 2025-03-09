import { QueryClient, QueryClientProvider } from "react-query";
import { UserProvider } from "../context/UserContext";
import { NotificationProvider } from "../context/NotificationContext";

const queryClient = new QueryClient();

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default Providers;
