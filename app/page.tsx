import UserProfile from "./components/UserProfile";
import AnalyticsBanner from "./components/AnalyticsBanner";

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-gray-900">
      <AnalyticsBanner />
      <div style={{ marginTop: '60px' }}>
        <UserProfile />
      </div>
    </div>
  );
}
