
import AuthGuard from '@/components/AuthGuard';
import HomePage from '@/pages/HomePage';

const Index = () => {
  return (
    <AuthGuard>
      <HomePage />
    </AuthGuard>
  );
};

export default Index;
