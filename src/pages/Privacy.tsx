import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";

const Privacy = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/policies", { replace: true });
  }, [navigate]);

  return (
    <Layout>
      <SEO
        title="Privacy Policy | ReBooked Solutions"
        description="Our Privacy Policy compliant with the Protection of Personal Information Act (POPIA)."
        canonical="https://rebookedsolutions.co.za/policies"
      />
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">Redirecting to policies...</p>
      </div>
    </Layout>
  );
};

export default Privacy;
