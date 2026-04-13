import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";

const Terms = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/policies", { replace: true });
  }, [navigate]);

  return (
    <Layout>
      <SEO
        title="Terms and Conditions | ReBooked Solutions"
        description="Read our terms and conditions for buying and selling textbooks in South Africa."
        canonical="https://rebookedsolutions.co.za/policies"
      />
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">Redirecting to policies...</p>
      </div>
    </Layout>
  );
};

export default Terms;
