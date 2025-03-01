import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  BarChart3,
  Users,
  Briefcase,
  Shield,
  FileText,
  HelpCircle,
  Layers,
  Settings,
  Zap,
  ChevronRight,
} from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Xalesin CRM</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-sm font-medium hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Product Overview */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Xalesin CRM Documentation & Tutorials
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Welcome to the Xalesin CRM knowledge base. Here you'll find
                comprehensive guides and documentation to help you get the most
                out of your CRM system.
              </p>
              <div className="flex items-center space-x-2 text-primary">
                <BookOpen className="h-5 w-5" />
                <span className="font-medium">
                  Explore our documentation to get started
                </span>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop"
                alt="CRM Dashboard Example"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold mb-8 flex items-center">
            <Zap className="mr-2 h-5 w-5 text-primary" />
            Getting Started with Xalesin CRM
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 p-2 bg-primary/10 rounded-full w-fit">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">1. Account Setup</h3>
                <p className="text-muted-foreground mb-4">
                  Learn how to create your account, set up your organization
                  profile, and invite team members.
                </p>
                <Link
                  to="#"
                  className="text-primary hover:underline flex items-center text-sm"
                >
                  Read the guide <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 p-2 bg-primary/10 rounded-full w-fit">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">2. Managing Contacts</h3>
                <p className="text-muted-foreground mb-4">
                  Discover how to import, organize, and manage your contacts
                  effectively in the system.
                </p>
                <Link
                  to="#"
                  className="text-primary hover:underline flex items-center text-sm"
                >
                  Read the guide <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 p-2 bg-primary/10 rounded-full w-fit">
                  <Layers className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">3. Lead Management</h3>
                <p className="text-muted-foreground mb-4">
                  Learn the best practices for tracking leads through your sales
                  pipeline.
                </p>
                <Link
                  to="#"
                  className="text-primary hover:underline flex items-center text-sm"
                >
                  Read the guide <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="bg-muted/30 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-2">
              Video Tutorial: Quick Start Guide
            </h3>
            <div className="aspect-video bg-black/10 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <FileText className="h-12 w-12 text-primary/50 mx-auto mb-2" />
                <p className="text-muted-foreground">
                  Video tutorial placeholder
                </p>
              </div>
            </div>
            <p className="text-muted-foreground">
              This comprehensive video walks you through the essential features
              of Xalesin CRM to help you get up and running quickly.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features & Tutorials */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold mb-8">Feature Tutorials</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Contact Management</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Importing Contacts</p>
                      <p className="text-sm text-muted-foreground">
                        Learn how to bulk import contacts from CSV files or
                        other CRM systems.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Contact Segmentation</p>
                      <p className="text-sm text-muted-foreground">
                        Create custom fields and tags to organize contacts by
                        categories.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Activity Tracking</p>
                      <p className="text-sm text-muted-foreground">
                        Record and monitor all interactions with your contacts.
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">
                    Analytics & Reporting
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Dashboard Customization</p>
                      <p className="text-sm text-muted-foreground">
                        Create personalized dashboards with the metrics that
                        matter to you.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Sales Performance Reports</p>
                      <p className="text-sm text-muted-foreground">
                        Track team and individual performance with detailed
                        reports.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Data Export</p>
                      <p className="text-sm text-muted-foreground">
                        Export your data in various formats for external
                        analysis.
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">
                    Security & Permissions
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Role-Based Access Control</p>
                      <p className="text-sm text-muted-foreground">
                        Set up user roles and permissions to control data
                        access.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Data Encryption</p>
                      <p className="text-sm text-muted-foreground">
                        Understand how your data is protected with
                        enterprise-grade encryption.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Audit Logs</p>
                      <p className="text-sm text-muted-foreground">
                        Track all system activities for compliance and security
                        purposes.
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">
                    System Configuration
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Custom Fields</p>
                      <p className="text-sm text-muted-foreground">
                        Create and manage custom fields to tailor the CRM to
                        your needs.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Workflow Automation</p>
                      <p className="text-sm text-muted-foreground">
                        Set up automated workflows to streamline your sales
                        processes.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Email Integration</p>
                      <p className="text-sm text-muted-foreground">
                        Connect your email accounts for seamless communication
                        tracking.
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold mb-8 flex items-center">
            <HelpCircle className="mr-2 h-5 w-5 text-primary" />
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-bold mb-2">
                  How do I reset my password?
                </h3>
                <p className="text-muted-foreground">
                  Go to the login page and click on "Forgot Password". Enter
                  your email address and follow the instructions sent to your
                  inbox.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-bold mb-2">
                  Can I import contacts from another CRM?
                </h3>
                <p className="text-muted-foreground">
                  Yes, Xalesin CRM supports importing contacts from CSV files
                  and direct integrations with popular CRM platforms. Go to
                  Contacts → Import to get started.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-bold mb-2">
                  How do I create custom reports?
                </h3>
                <p className="text-muted-foreground">
                  Navigate to the Reports section, click "Create New Report",
                  select your data source, choose metrics and dimensions, and
                  save your configuration.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-bold mb-2">Is my data secure?</h3>
                <p className="text-muted-foreground">
                  Xalesin CRM uses enterprise-grade encryption for all data,
                  both in transit and at rest. We also offer role-based access
                  controls and detailed audit logs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold mb-8">Additional Resources</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 p-2 bg-primary/10 rounded-full w-fit">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">API Documentation</h3>
                <p className="text-muted-foreground mb-4">
                  Comprehensive guides for developers looking to integrate with
                  our API.
                </p>
                <Link
                  to="#"
                  className="text-primary hover:underline flex items-center text-sm"
                >
                  View documentation <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 p-2 bg-primary/10 rounded-full w-fit">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Best Practices Guide</h3>
                <p className="text-muted-foreground mb-4">
                  Learn industry best practices for CRM implementation and
                  usage.
                </p>
                <Link
                  to="#"
                  className="text-primary hover:underline flex items-center text-sm"
                >
                  Download guide <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 p-2 bg-primary/10 rounded-full w-fit">
                  <HelpCircle className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Support Center</h3>
                <p className="text-muted-foreground mb-4">
                  Get help from our support team or browse through common
                  issues.
                </p>
                <Link
                  to="#"
                  className="text-primary hover:underline flex items-center text-sm"
                >
                  Visit support center <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">Documentation</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Getting Started
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    User Guides
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    API Reference
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Release Notes
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Tutorials
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Webinars
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Best Practices
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Community Forum
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Contact Support
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    System Status
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Feature Requests
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Security
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-muted-foreground/20 text-center text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Xalesin CRM. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
