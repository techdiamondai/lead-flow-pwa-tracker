
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
  Check,
  Stars,
  BarChart3,
  Users,
  LineChart,
  Settings,
  Globe,
  Layers,
  MessageSquare,
  Zap,
  Award
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("sales");

  const tabs = [
    { id: "sales", label: "Sales" },
    { id: "marketing", label: "Marketing" },
    { id: "service", label: "Service" },
    { id: "operations", label: "Operations" }
  ];

  const features = [
    { 
      icon: <Users className="h-6 w-6 text-blue-600" />, 
      title: "Contact Management", 
      description: "Store and manage your customer contacts all in one place" 
    },
    { 
      icon: <LineChart className="h-6 w-6 text-blue-600" />, 
      title: "Pipeline Management", 
      description: "Visualize your sales pipeline and track opportunities" 
    },
    { 
      icon: <BarChart3 className="h-6 w-6 text-blue-600" />, 
      title: "Insightful Analytics", 
      description: "Get detailed reports and actionable insights" 
    },
    { 
      icon: <Settings className="h-6 w-6 text-blue-600" />, 
      title: "Workflow Automation", 
      description: "Automate repetitive tasks and boost productivity" 
    }
  ];

  const testimonials = [
    {
      quote: "LeadFlow CRM has revolutionized how we manage our customer relationships.",
      author: "Sarah Johnson",
      position: "Sales Director, TechCorp"
    },
    {
      quote: "We've increased our conversion rates by 35% since implementing LeadFlow CRM.",
      author: "Michael Chen",
      position: "CEO, GrowthSmart"
    },
    {
      quote: "The analytics and reporting features provide insights we never had before.",
      author: "Jessica Williams",
      position: "Marketing Head, InnovateX"
    }
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="mb-6">
                <span className="bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                  #1 CRM Software
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Convert More Leads, Close More Deals
              </h1>
              <p className="text-lg md:text-xl mb-8 text-blue-100">
                The complete CRM platform to acquire, manage, and retain customers with ease.
              </p>
              <div className="flex flex-wrap gap-4">
                {isAuthenticated ? (
                  <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 font-medium">
                    <Link to="/dashboard">
                      Go to Dashboard
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 font-medium">
                      <Link to="/register">
                        Start Free Trial
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      <Link to="/login">
                        Sign In
                      </Link>
                    </Button>
                  </>
                )}
              </div>
              <div className="mt-8 flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-blue-300" />
                <span className="text-blue-100">No credit card required</span>
                <span className="mx-2 text-blue-400">•</span>
                <Check className="h-4 w-4 text-blue-300" />
                <span className="text-blue-100">Free 15-day trial</span>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                  alt="Dashboard preview" 
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-blue-600 rounded-full p-6 shadow-lg hidden md:block">
                <Stars className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Banner */}
        <div className="bg-blue-950/70 backdrop-blur-sm py-6">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-1">10,000+</div>
                <div className="text-blue-200">Businesses</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">150+</div>
                <div className="text-blue-200">Countries</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">35%</div>
                <div className="text-blue-200">Avg. Growth</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-blue-200">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">CRM Solutions for Every Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tailored tools and features designed specifically for different departments
            </p>
          </div>

          <div className="flex flex-wrap justify-center mb-10 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`px-6 py-3 rounded-full font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              {activeTab === "sales" && (
                <>
                  <h3 className="text-2xl font-bold mb-4">Boost Your Sales Performance</h3>
                  <p className="text-gray-600 mb-6">
                    Track deals, manage pipelines, and close more sales with our powerful sales CRM tools.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-1 mr-2" />
                      <span>Complete sales pipeline visibility</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-1 mr-2" />
                      <span>Sales forecasting and analytics</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-1 mr-2" />
                      <span>Email tracking and templates</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-1 mr-2" />
                      <span>Automated lead scoring</span>
                    </li>
                  </ul>
                </>
              )}
              {activeTab === "marketing" && (
                <>
                  <h3 className="text-2xl font-bold mb-4">Streamline Your Marketing Efforts</h3>
                  <p className="text-gray-600 mb-6">
                    Capture, nurture and convert leads with integrated marketing automation tools.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-1 mr-2" />
                      <span>Campaign management and tracking</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-1 mr-2" />
                      <span>Email marketing automation</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-1 mr-2" />
                      <span>Lead generation forms</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-1 mr-2" />
                      <span>Marketing analytics and ROI tracking</span>
                    </li>
                  </ul>
                </>
              )}
              {activeTab === "service" && (
                <>
                  <h3 className="text-2xl font-bold mb-4">Deliver Outstanding Customer Service</h3>
                  <p className="text-gray-600 mb-6">
                    Provide exceptional support and build long-lasting customer relationships.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-1 mr-2" />
                      <span>Help desk and ticketing system</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-1 mr-2" />
                      <span>Knowledge base management</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-1 mr-2" />
                      <span>Customer satisfaction surveys</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-1 mr-2" />
                      <span>SLA management and tracking</span>
                    </li>
                  </ul>
                </>
              )}
              {activeTab === "operations" && (
                <>
                  <h3 className="text-2xl font-bold mb-4">Optimize Your Business Operations</h3>
                  <p className="text-gray-600 mb-6">
                    Streamline workflows and improve efficiency across your entire organization.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-1 mr-2" />
                      <span>Process automation tools</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-1 mr-2" />
                      <span>Resource management</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-1 mr-2" />
                      <span>Project tracking and management</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-1 mr-2" />
                      <span>Operational reporting and analytics</span>
                    </li>
                  </ul>
                </>
              )}
              
              <div className="mt-8">
                <Button asChild>
                  <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-lg shadow-lg p-2 md:p-4">
                <img 
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                  alt="Feature preview" 
                  className="w-full h-auto rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Features to Grow Your Business</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your customer relationships effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="mb-4 bg-blue-50 p-3 rounded-lg w-12 h-12 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by Businesses Worldwide</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See what our customers have to say about LeadFlow CRM
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((item, index) => (
              <Card key={index} className="bg-white shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex mb-4 text-yellow-400">
                    <Stars className="h-5 w-5" />
                    <Stars className="h-5 w-5" />
                    <Stars className="h-5 w-5" />
                    <Stars className="h-5 w-5" />
                    <Stars className="h-5 w-5" />
                  </div>
                  <p className="italic mb-6">"{item.quote}"</p>
                  <div>
                    <p className="font-semibold">{item.author}</p>
                    <p className="text-sm text-gray-600">{item.position}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integration and Global Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Connect with Your Favorite Tools</h2>
              <p className="text-lg text-blue-100 mb-6">
                LeadFlow CRM integrates seamlessly with over 100+ business applications, making it easy to connect your entire tech stack.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg flex items-center justify-center">
                  <Globe className="h-8 w-8" />
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg flex items-center justify-center">
                  <Layers className="h-8 w-8" />
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-8 w-8" />
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg flex items-center justify-center">
                  <Zap className="h-8 w-8" />
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg flex items-center justify-center">
                  <Award className="h-8 w-8" />
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg flex items-center justify-center text-lg font-bold">
                  100+
                </div>
              </div>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link to="/register">
                  View All Integrations
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="bg-blue-800 rounded-lg p-8 shadow-xl">
                <h3 className="text-xl font-semibold mb-4">Global CRM Solution</h3>
                <p className="mb-6">
                  Trusted by businesses in over 150 countries around the world.
                </p>
                <div className="aspect-[16/9] bg-blue-700/50 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                    alt="Global map" 
                    className="w-full h-full object-cover opacity-70"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that use LeadFlow CRM to convert more leads and grow their sales.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {isAuthenticated ? (
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Link to="/register">Start Your Free Trial</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/login">Sign In</Link>
                </Button>
              </>
            )}
          </div>
          <div className="mt-6 text-sm text-gray-500">
            No credit card required • 15-day free trial • Cancel anytime
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">LeadFlow CRM</h3>
              <p className="text-gray-400">
                The complete CRM solution for growing businesses
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
                <li><a href="#" className="hover:text-white">Updates</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} LeadFlow CRM. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
