import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeftIcon, UserIcon, MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";

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
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white overflow-hidden border border-solid border-black w-[393px] h-[852px] relative">
        {/* Header */}
        <header className="absolute w-[393px] h-[60px] top-0 left-0 bg-[#5586c94c] flex items-center px-4">
          <Link to="/" className="mr-4">
            <ArrowLeftIcon className="w-6 h-6 text-black" />
          </Link>
          <h1 className="text-xl font-semibold text-black">Profile</h1>
        </header>

        {/* Profile content */}
        <main className="absolute top-[60px] left-0 w-full h-[732px] overflow-y-auto p-4">
          <div className="space-y-6">
            {/* Profile picture and basic info */}
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

        {/* Navigation bar */}
        <nav className="absolute w-[393px] h-[60px] bottom-0 left-0 bg-[#5586c94c] border-2 border-solid border-[#000000cc] flex justify-around items-center">
          <Link
            className="w-20 h-10 bg-white rounded-[20px] border-2 border-solid border-[#000000cc] flex items-center justify-center"
            to="/favorites"
          >
            <svg className="w-[31px] h-[31px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
            </svg>
          </Link>

          <Link
            className="w-20 h-10 bg-white rounded-[20px] border-2 border-solid border-[#000000cc] flex items-center justify-center"
            to="/"
          >
            <svg className="w-[30px] h-[30px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
          </Link>

          <Button className="w-20 h-10 bg-fern-green rounded-[20px] border-2 border-solid border-[#000000cc] flex items-center justify-center p-0">
            <UserIcon className="w-[30px] h-[30px]" />
          </Button>
        </nav>
      </div>
    </div>
  );
};