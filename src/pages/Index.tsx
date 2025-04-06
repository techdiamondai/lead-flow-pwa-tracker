
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
  Check,
  BarChart3,
  Users,
  LineChart,
  Settings,
  Globe,
  MessageSquare,
  Zap,
  Award,
  Star,
  ArrowRight,
  CheckCircle2,
  Layers,
  Mail,
  PhoneCall,
  Building,
  PanelRight
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("sales");

  const features = [
    { 
      icon: <Users className="h-6 w-6 text-blue-600" />, 
      title: "Lead Management", 
      description: "Convert promising leads into loyal customers with ease" 
    },
    { 
      icon: <LineChart className="h-6 w-6 text-blue-600" />, 
      title: "Sales Pipeline", 
      description: "Visualize your sales process from start to finish" 
    },
    { 
      icon: <BarChart3 className="h-6 w-6 text-blue-600" />, 
      title: "Advanced Analytics", 
      description: "Make data-driven decisions with powerful insights" 
    },
    { 
      icon: <Building className="h-6 w-6 text-blue-600" />, 
      title: "Deal Management", 
      description: "Track and manage potential sales opportunities" 
    }
  ];

  const testimonials = [
    {
      quote: "Zoho CRM has transformed how we manage customer relationships and streamlined our sales process.",
      author: "Sarah Johnson",
      position: "VP of Sales, TechCorp",
      company: "TechCorp",
      rating: 5
    },
    {
      quote: "We've seen a 35% increase in our conversion rates since implementing this CRM solution.",
      author: "Michael Chen",
      position: "CEO, GrowthSmart",
      company: "GrowthSmart",
      rating: 5
    },
    {
      quote: "The analytics and reporting features have given us insights we never had access to before.",
      author: "Jessica Williams",
      position: "Marketing Director, InnovateX",
      company: "InnovateX",
      rating: 5
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="mb-2">
                <span className="bg-blue-500/30 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                  #1 CRM Software
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                The Complete CRM Platform for Growing Businesses
              </h1>
              <p className="text-lg md:text-xl mb-8 text-blue-100">
                Your complete customer relationship management solution to convert more leads, close more deals, and build better relationships.
              </p>
              <div className="flex flex-wrap gap-4">
                {isAuthenticated ? (
                  <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-medium">
                    <Link to="/dashboard">
                      Go to Dashboard
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-medium">
                      <Link to="/register">
                        Start Your Free Trial
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
                  alt="CRM Dashboard preview" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Banner */}
        <div className="bg-indigo-900/80 backdrop-blur-sm py-6">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-1">250,000+</div>
                <div className="text-blue-200">Businesses</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">180+</div>
                <div className="text-blue-200">Countries</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">15+</div>
                <div className="text-blue-200">Years of Excellence</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-blue-200">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Tabs */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">One Platform, Multiple Solutions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tailored tools and features to meet the needs of different business teams
            </p>
          </div>

          <Tabs defaultValue="sales" className="max-w-4xl mx-auto">
            <TabsList className="flex justify-center mb-8 bg-transparent w-full border-b overflow-x-auto">
              <TabsTrigger 
                value="sales" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent rounded-none px-5 py-3"
              >
                Sales
              </TabsTrigger>
              <TabsTrigger 
                value="marketing" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent rounded-none px-5 py-3"
              >
                Marketing
              </TabsTrigger>
              <TabsTrigger 
                value="service" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent rounded-none px-5 py-3"
              >
                Customer Service
              </TabsTrigger>
              <TabsTrigger 
                value="operations" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent rounded-none px-5 py-3"
              >
                Operations
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="sales" className="mt-0">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Accelerate Your Sales Process</h3>
                    <p className="text-gray-600 mb-6">
                      Manage your entire sales cycle from lead acquisition to closing deals and beyond.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span>Complete sales pipeline visibility and management</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span>Real-time forecasting and performance analytics</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span>AI-powered lead scoring and opportunity insights</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span>Email tracking, templates, and scheduling tools</span>
                      </li>
                    </ul>
                    
                    <div className="mt-8">
                      <Button asChild className="bg-blue-600 hover:bg-blue-700">
                        <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                          Explore Sales CRM
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
                      <img 
                        src="https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                        alt="Sales dashboard" 
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="marketing" className="mt-0">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Boost Your Marketing ROI</h3>
                    <p className="text-gray-600 mb-6">
                      Manage campaigns, capture and nurture leads, and track marketing performance.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span>Comprehensive campaign management and tracking</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span>Multi-channel marketing automation workflows</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span>Lead capture forms and landing page integration</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span>Marketing analytics and ROI measurement</span>
                      </li>
                    </ul>
                    
                    <div className="mt-8">
                      <Button asChild className="bg-blue-600 hover:bg-blue-700">
                        <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                          Explore Marketing CRM
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
                      <img 
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                        alt="Marketing dashboard" 
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="service" className="mt-0">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Deliver Exceptional Customer Service</h3>
                    <p className="text-gray-600 mb-6">
                      Provide outstanding support and build lasting customer relationships.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span>Unified customer service platform and ticketing system</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span>Knowledge base and self-service portal creation</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span>Customer satisfaction surveys and feedback collection</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span>SLA management and performance metrics</span>
                      </li>
                    </ul>
                    
                    <div className="mt-8">
                      <Button asChild className="bg-blue-600 hover:bg-blue-700">
                        <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                          Explore Service CRM
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
                      <img 
                        src="https://images.unsplash.com/photo-1560264280-88b68371db39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                        alt="Service dashboard" 
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="operations" className="mt-0">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Streamline Business Operations</h3>
                    <p className="text-gray-600 mb-6">
                      Optimize workflows and enhance operational efficiency across your organization.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span>Workflow automation and approval processes</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span>Resource planning and allocation tools</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span>Project tracking and management capabilities</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span>Operational reporting and analytics dashboards</span>
                      </li>
                    </ul>
                    
                    <div className="mt-8">
                      <Button asChild className="bg-blue-600 hover:bg-blue-700">
                        <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                          Explore Operations CRM
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
                      <img 
                        src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                        alt="Operations dashboard" 
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Features to Drive Success</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage customer relationships effectively and grow your business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
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

          <div className="grid md:grid-cols-3 gap-6 mt-10">
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <Mail className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Email Management</h3>
              <p className="text-gray-600">Seamlessly integrate and manage all your email communications</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <PanelRight className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Custom Reports</h3>
              <p className="text-gray-600">Create detailed reports with drag-and-drop simplicity</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <PhoneCall className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Call Center</h3>
              <p className="text-gray-600">Manage inbound and outbound calls with intelligent routing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by Businesses Worldwide</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See what our customers have to say about their experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((item, index) => (
              <Card key={index} className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex mb-4 text-yellow-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <p className="italic mb-6 text-gray-700">"{item.quote}"</p>
                  <div className="flex items-center">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-10 h-10 flex items-center justify-center font-semibold mr-3">
                      {item.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{item.author}</p>
                      <p className="text-sm text-gray-600">{item.position}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              <Link to="#">
                Read More Customer Stories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Integrate With Your Favorite Apps</h2>
              <p className="text-lg text-blue-100 mb-6">
                Connect with 1000+ applications to create a seamless workflow across your entire tech stack.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
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
                  1000+
                </div>
              </div>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link to="/register">
                  Explore All Integrations
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div>
              <div className="bg-blue-800 rounded-lg p-8 shadow-xl">
                <h3 className="text-xl font-semibold mb-4">Why Our Integrations Matter</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 mr-2 flex-shrink-0" />
                    <span>Eliminate data silos and duplicate entry</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 mr-2 flex-shrink-0" />
                    <span>Automatically sync data across applications</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 mr-2 flex-shrink-0" />
                    <span>Create custom workflows between systems</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 mr-2 flex-shrink-0" />
                    <span>Build a truly connected business ecosystem</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section Summary */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Plans That Scale With Your Business</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            From startups to enterprises, we have flexible pricing options to suit your needs
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Card className="w-full max-w-sm border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">Standard</h3>
                <div className="text-3xl font-bold mb-4">$14<span className="text-lg font-normal text-gray-500">/month</span></div>
                <p className="text-gray-600 mb-6">Essential CRM features for small teams</p>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link to="/register">Start Free Trial</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="w-full max-w-sm border-2 border-blue-600 shadow-lg hover:shadow-xl transition-shadow relative">
              <div className="absolute -top-3 left-0 right-0 mx-auto w-fit px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                MOST POPULAR
              </div>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">Professional</h3>
                <div className="text-3xl font-bold mb-4">$25<span className="text-lg font-normal text-gray-500">/month</span></div>
                <p className="text-gray-600 mb-6">Complete CRM solution for growing businesses</p>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link to="/register">Start Free Trial</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="w-full max-w-sm border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">Enterprise</h3>
                <div className="text-3xl font-bold mb-4">$45<span className="text-lg font-normal text-gray-500">/month</span></div>
                <p className="text-gray-600 mb-6">Advanced features for large organizations</p>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link to="/register">Start Free Trial</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join over 250,000 businesses that use our CRM to grow their sales.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {isAuthenticated ? (
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Link to="/register">Start Your Free Trial</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
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
              <h3 className="text-xl font-bold text-white mb-4">ZohoCRM</h3>
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
            <p>&copy; {new Date().getFullYear()} ZohoCRM. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
