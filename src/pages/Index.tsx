import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { EquipmentShowcase } from "@/components/landing/EquipmentShowcase";
import { DatabaseInitializer } from "@/components/DatabaseInitializer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        <HeroSection />
        <FeaturesSection />
        <EquipmentShowcase />

        {/* Database Setup Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Database Setup
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get started by setting up your database with sample data
              </p>
            </div>
            <DatabaseInitializer />
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Equipment Rental Business?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Join hundreds of equipment rental companies already using
              EquipEase to streamline operations and boost profits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/booking">
                <Button size="lg" variant="secondary" className="group">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-orange-600"
                >
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="bg-orange-500 p-2 rounded-lg">
                    <div className="w-6 h-6 bg-white rounded transform rotate-45"></div>
                  </div>
                  <span className="text-xl font-bold">EquipEase</span>
                </div>
                <p className="text-gray-400">
                  The complete solution for construction equipment rental
                  management.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Features</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Real-time Chat</li>
                  <li>Smart Booking</li>
                  <li>Live Dashboard</li>
                  <li>AI Assistant</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Equipment</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Excavators</li>
                  <li>Cranes</li>
                  <li>Bulldozers</li>
                  <li>Loaders</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Help Center</li>
                  <li>Contact Us</li>
                  <li>API Docs</li>
                  <li>Status Page</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 EquipEase. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
};

export default Index;
