import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeftIcon, UserIcon, MailIcon, PhoneIcon, MapPinIcon, MoonIcon, SunIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { StarIcon, HomeIcon } from "lucide-react";
import { NavigationBar } from "../../components/NavigationBar";
import { useDarkMode } from "../../context/DarkModeContext";

export const ProfileScreen = (): JSX.Element => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

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
    <div className={`min-h-screen w-full relative transition-colors duration-200 ${
      isDarkMode ? 'bg-[#36393f]' : 'bg-white'
    }`}>
      {/* Main content */}
      <main className="w-full h-[calc(100vh-60px)] overflow-y-auto p-4">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className={`text-2xl font-semibold mb-2 transition-colors duration-200 ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}>Profile</h1>
            <p className={`transition-colors duration-200 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-500'
            }`}>Manage your account settings</p>
          </div>

          {/* Dark Mode Toggle */}
          <Card className={`border shadow-sm transition-colors duration-200 ${
            isDarkMode ? 'border-[#4f545c] bg-[#2f3136]' : 'border-gray-200 bg-white'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {isDarkMode ? (
                    <MoonIcon className="w-5 h-5 text-blue-400" />
                  ) : (
                    <SunIcon className="w-5 h-5 text-yellow-500" />
                  )}
                  <div>
                    <h3 className={`text-lg font-semibold transition-colors duration-200 ${
                      isDarkMode ? 'text-white' : 'text-black'
                    }`}>Dark Mode</h3>
                    <p className={`text-sm transition-colors duration-200 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      {isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Profile content */}
          <Card className={`border shadow-sm transition-colors duration-200 ${
            isDarkMode ? 'border-[#4f545c] bg-[#2f3136]' : 'border-gray-200 bg-white'
          }`}>
            <CardContent className="p-6 text-center">
              <div className="w-24 h-24 bg-celestial-blue rounded-full mx-auto mb-4 flex items-center justify-center">
                <UserIcon className="w-12 h-12 text-white" />
              </div>
              <h2 className={`text-2xl font-bold mb-1 transition-colors duration-200 ${
                isDarkMode ? 'text-white' : 'text-black'
              }`}>{user.name}</h2>
              <p className={`mb-2 transition-colors duration-200 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Student ID: {user.studentId}</p>
              <p className={`transition-colors duration-200 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>{user.major}</p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className={`border shadow-sm transition-colors duration-200 ${
            isDarkMode ? 'border-[#4f545c] bg-[#2f3136]' : 'border-gray-200 bg-white'
          }`}>
            <CardContent className="p-6">
              <h3 className={`text-lg font-semibold mb-4 transition-colors duration-200 ${
                isDarkMode ? 'text-white' : 'text-black'
              }`}>Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MailIcon className={`w-5 h-5 transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <div>
                    <p className={`text-sm transition-colors duration-200 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Email</p>
                    <p className={`transition-colors duration-200 ${
                      isDarkMode ? 'text-white' : 'text-black'
                    }`}>{user.email}</p>
                  </div>
                </div>
                
                <Separator className={isDarkMode ? 'bg-[#4f545c]' : 'bg-gray-200'} />
                
                <div className="flex items-center space-x-3">
                  <PhoneIcon className={`w-5 h-5 transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <div>
                    <p className={`text-sm transition-colors duration-200 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Phone</p>
                    <p className={`transition-colors duration-200 ${
                      isDarkMode ? 'text-white' : 'text-black'
                    }`}>{user.phone}</p>
                  </div>
                </div>
                
                <Separator className={isDarkMode ? 'bg-[#4f545c]' : 'bg-gray-200'} />
                
                <div className="flex items-center space-x-3">
                  <MapPinIcon className={`w-5 h-5 transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <div>
                    <p className={`text-sm transition-colors duration-200 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Address</p>
                    <p className={`transition-colors duration-200 ${
                      isDarkMode ? 'text-white' : 'text-black'
                    }`}>{user.address}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card className={`border shadow-sm transition-colors duration-200 ${
            isDarkMode ? 'border-[#4f545c] bg-[#2f3136]' : 'border-gray-200 bg-white'
          }`}>
            <CardContent className="p-6">
              <h3 className={`text-lg font-semibold mb-4 transition-colors duration-200 ${
                isDarkMode ? 'text-white' : 'text-black'
              }`}>Academic Information</h3>
              
              <div className="space-y-4">
                <div>
                  <p className={`text-sm transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Major</p>
                  <p className={`font-medium transition-colors duration-200 ${
                    isDarkMode ? 'text-white' : 'text-black'
                  }`}>{user.major}</p>
                </div>
                
                <Separator className={isDarkMode ? 'bg-[#4f545c]' : 'bg-gray-200'} />
                
                <div>
                  <p className={`text-sm transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Enrollment Year</p>
                  <p className={`font-medium transition-colors duration-200 ${
                    isDarkMode ? 'text-white' : 'text-black'
                  }`}>{user.enrollmentYear}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <NavigationBar />

      {/* Admin Mode Link */}
      <div className="absolute bottom-20 left-0 w-full flex justify-center">
        <Link to="/admin">
          <Button 
            variant="outline" 
            className={`transition-colors duration-200 ${
              isDarkMode 
                ? 'text-red-400 border-red-400 hover:bg-red-400/10' 
                : 'text-red-600 border-red-600 hover:bg-red-50'
            }`}
          >
            Admin Mode
          </Button>
        </Link>
      </div>
    </div>
  );
};