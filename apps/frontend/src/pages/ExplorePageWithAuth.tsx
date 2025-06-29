import AuthGuard from "@/components/AuthGuard";
import ExplorePage from "@/pages/ExplorePage";

const ExplorePageWithAuth = () => {
  return (
    <AuthGuard>
      <ExplorePage />
    </AuthGuard>
  );
};

export default ExplorePageWithAuth;
