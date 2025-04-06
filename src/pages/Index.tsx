
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, ArrowRight, BarChart3, Users, Shield, Database } from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-transform duration-300 hover:shadow-lg hover:scale-[1.02]">
    <div className="rounded-full w-12 h-12 bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const FeatureItem = ({ title }: { title: string }) => (
  <div className="flex items-center space-x-2">
    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
    <span>{title}</span>
  </div>
);

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <header className="px-4 pt-16 md:pt-24 pb-16 md:pb-20 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="md:w-1/2 md:pr-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Manage Leads Effectively with LeadFlow CRM
            </h1>
            <p className="mt-6 text-xl text-gray-700 max-w-xl">
              A powerful lead management system with real-time updates, complete version history, and offline capabilities.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <Button 
                  size="lg" 
                  asChild 
                  className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-600/40 transition-all"
                >
                  <Link to="/dashboard" className="flex items-center">
                    Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    asChild 
                    className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-600/40 transition-all"
                  >
                    <Link to="/login" className="flex items-center">
                      Get Started <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    asChild 
                    className="text-lg px-8 py-6 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all"
                  >
                    <Link to="/register">
                      Create Account
                    </Link>
                  </Button>
                </>
              )}
            </div>
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-indigo-${i*100} flex items-center justify-center text-white text-xs font-medium`}>
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">500+</span> sales teams trust LeadFlow CRM
              </p>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-3xl blur-3xl transform -rotate-3"></div>
              <div className="relative bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3"></div>
                <img 
                  src="/placeholder.svg" 
                  alt="LeadFlow CRM Dashboard" 
                  className="w-full h-auto"
                  style={{ aspectRatio: '16/9' }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Leads
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              LeadFlow CRM streamlines your sales process from initial contact to closed deals
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={BarChart3}
              title="Lead Management"
              description="Track customer information, contact details, and lead progression through multiple stages."
            />
            <FeatureCard 
              icon={Database}
              title="Version History"
              description="Keep a complete history of all lead changes with full audit trail of who made which changes."
            />
            <FeatureCard 
              icon={Users}
              title="Team Collaboration"
              description="Assign leads to team members and easily transfer ownership as needed."
            />
            <FeatureCard 
              icon={Shield}
              title="Offline Access"
              description="Access and modify leads even without an internet connection. Changes sync when back online."
            />
            <FeatureCard 
              icon={CheckCircle}
              title="Task Management"
              description="Create and assign tasks related to leads to keep your team on track."
            />
            <FeatureCard 
              icon={CheckCircle}
              title="Reporting"
              description="Generate insights with customizable reports on lead status, conversion rates, and team performance."
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="px-4 py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="md:w-2/3">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your lead management?</h2>
              <p className="text-blue-100 text-xl">
                Join thousands of sales teams that use LeadFlow CRM to close more deals
              </p>
              
              <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl">
                <FeatureItem title="Lead tracking" />
                <FeatureItem title="Team management" />
                <FeatureItem title="Offline access" />
                <FeatureItem title="Version history" />
                <FeatureItem title="Task assignments" />
                <FeatureItem title="Analytics" />
              </div>
            </div>
            
            <div className="mt-8 md:mt-0">
              {isAuthenticated ? (
                <Button 
                  size="lg" 
                  asChild
                  className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 shadow-lg"
                >
                  <Link to="/dashboard">
                    Go to Dashboard
                  </Link>
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  asChild
                  className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 shadow-lg"
                >
                  <Link to="/login">
                    Get Started Now
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="px-4 py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-blue-600">LeadFlow CRM</h3>
            <p className="text-gray-600">© 2025 LeadFlow. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
            <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
            <Link to="/register" className="text-gray-600 hover:text-blue-600">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
