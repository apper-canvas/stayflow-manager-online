import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
<main className="pt-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;