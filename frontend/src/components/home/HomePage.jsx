import { useAuth } from '../../hooks/useAuth';
import HeroSection from './HeroSection';
import UserDashboard from './UserDashboard';

export default function HomePage() {
  const { user } = useAuth();

  return user ? <UserDashboard /> : <HeroSection />;
}
