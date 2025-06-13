import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeftIcon, UserIcon, MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { StarIcon, HomeIcon } from "lucide-react";
import { NavigationBar } from "../../components/NavigationBar";

export const ProfileScreen = (): JSX.Element => {
  // Mock user data
  const user = {
    name: "John Doe",
    email: "john.doe@student.university.edu",
    studentId: "12345678",
    phone: "+1 (555) 123-4567",
    address: "123 University Ave, College Town, ST 12345",
    enrollmentYear: "2022",
    major: "Computer Science",
  };

  return (
    <div className="bg-white min-h-screen max-w-[393px] mx-auto relative">
      {/* Main content */}
      <main className="w-full h-[calc(100vh-60px)] overflow-y-auto p-4">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-black mb-2">Profile</h1>
            <p className="text-gray-500">Manage your account settings</p>
          </div>

          {/* Profile content */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="w-24 h-24 bg-celestial-blue rounded-full mx-auto mb-4 flex items-center justify-center">
                <UserIcon className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-black mb-1">{user.name}</h2>
              <p className="text-gray-600 mb-2">Student ID: {user.studentId}</p>
              <p className="text-gray-600">{user.major}</p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MailIcon className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-black">{user.email}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-black">{user.phone}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center space-x-3">
                  <MapPinIcon className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-black">{user.address}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Academic Information</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Major</p>
                  <p className="text-black font-medium">{user.major}</p>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm text-gray-500">Enrollment Year</p>
                  <p className="text-black font-medium">{user.enrollmentYear}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <NavigationBar />
    </div>
  );
};