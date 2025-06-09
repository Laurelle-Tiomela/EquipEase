import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { EquipmentCatalog } from "@/components/client/EquipmentCatalog";
import { ClientBookingForm } from "@/components/client/ClientBookingForm";
import type { Equipment } from "@/lib/enhanced-types";
import {
  ArrowRight,
  Star,
  Shield,
  Clock,
  Truck,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
} from "lucide-react";

const ClientWebsite = () => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null,
  );

  const handleBookNow = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setShowBookingForm(true);
  };

  const handleBookingSuccess = () => {
    setShowBookingForm(false);
    setSelectedEquipment(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-orange-500 p-2 rounded-lg">
                <div className="w-6 h-6 bg-white rounded transform rotate-45"></div>
              </div>
              <span className="text-xl font-bold text-gray-900">EquipEase</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#equipment"
                className="text-gray-700 hover:text-orange-600 transition-colors"
              >
                Equipment
              </a>
              <a
                href="#services"
                className="text-gray-700 hover:text-orange-600 transition-colors"
              >
                Services
              </a>
              <a
                href="#about"
                className="text-gray-700 hover:text-orange-600 transition-colors"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-orange-600 transition-colors"
              >
                Contact
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>
              <Button
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() => setShowBookingForm(true)}
              >
                Book Equipment
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 to-orange-100 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Rent Professional
                  <span className="text-orange-500 block">
                    Construction Equipment
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Access our comprehensive fleet of heavy-duty construction
                  equipment. From excavators to cranes, we provide reliable
                  machinery for projects of all sizes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white group"
                  onClick={() => setShowBookingForm(true)}
                >
                  Book Now
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="lg">
                  <a href="#equipment">Browse Equipment</a>
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-orange-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Equipment Units</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">24/7</div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">98%</div>
                  <div className="text-sm text-gray-600">Uptime Rate</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img
                  src="/placeholder.svg"
                  alt="Construction Equipment"
                  className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-orange-200 rounded-full blur-3xl opacity-70"></div>
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-orange-300 rounded-full blur-3xl opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose EquipEase?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide reliable, well-maintained equipment with professional
              support to ensure your project success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Modern Fleet</h3>
              <p className="text-gray-600">
                Latest models with advanced features and excellent performance
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fully Insured</h3>
              <p className="text-gray-600">
                Comprehensive insurance coverage for peace of mind
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Round-the-clock technical support and emergency assistance
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality Assured</h3>
              <p className="text-gray-600">
                Regular maintenance and inspection for optimal performance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Catalog Section */}
      <section className="py-20 bg-gray-50" id="equipment">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Equipment Catalog
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse our comprehensive selection of professional-grade
              construction equipment available for rent.
            </p>
          </div>

          <EquipmentCatalog onBookNow={handleBookNow} />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "John Smith",
                company: "Smith Construction Co.",
                rating: 5,
                text: "EquipEase has been our go-to for equipment rental. Their fleet is modern, well-maintained, and their service is exceptional.",
              },
              {
                name: "Maria Rodriguez",
                company: "BuildRight Inc.",
                rating: 5,
                text: "The booking process is seamless and their support team is always available. Highly recommend for any construction project.",
              },
              {
                name: "David Chen",
                company: "Metro Builders",
                rating: 5,
                text: "Reliable equipment, competitive prices, and professional service. They've helped us complete projects on time and on budget.",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-900 text-white" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Contact us today for equipment rental or to discuss your project
                requirements. Our team is ready to help.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-orange-400" />
                  <span>+1 (555) EQUIP-US</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-orange-400" />
                  <span>contact@equipease.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-orange-400" />
                  <span>123 Industrial Ave, City, State 12345</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Quick Contact
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  ></textarea>
                </div>
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-orange-500 p-2 rounded-lg">
                  <div className="w-6 h-6 bg-white rounded transform rotate-45"></div>
                </div>
                <span className="text-xl font-bold">EquipEase</span>
              </div>
              <p className="text-gray-400">
                Professional construction equipment rental for projects of all
                sizes.
              </p>
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
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Equipment Rental</li>
                <li>Delivery & Pickup</li>
                <li>Maintenance</li>
                <li>24/7 Support</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Contact</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EquipEase. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Booking Dialog */}
      <Dialog open={showBookingForm} onOpenChange={setShowBookingForm}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book Equipment Rental</DialogTitle>
            <DialogDescription>
              Complete the form below to request equipment rental. We'll review
              your booking and contact you within 24 hours.
            </DialogDescription>
          </DialogHeader>

          <ClientBookingForm
            equipment={selectedEquipment || undefined}
            onSuccess={handleBookingSuccess}
            onCancel={() => setShowBookingForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientWebsite;
