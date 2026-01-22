import requests
import sys
import json
from datetime import datetime

class SeknuToAPITester:
    def __init__(self, base_url="https://green-service.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if endpoint else f"{self.api_url}/"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    'test': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'test': name,
                'error': str(e)
            })
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test(
            "Root API Endpoint",
            "GET",
            "",
            200
        )

    def test_availability_endpoint(self):
        """Test availability endpoint"""
        return self.run_test(
            "Availability Endpoint",
            "GET",
            "availability",
            200
        )

    def test_pricing_calculator(self):
        """Test pricing calculator"""
        test_data = {
            "service": "lawn_mowing",
            "property_size": 100,
            "condition": "normal",
            "additional_services": ["debris_removal"]
        }
        return self.run_test(
            "Pricing Calculator",
            "POST",
            "pricing/calculate",
            200,
            data=test_data
        )

    def test_booking_creation(self):
        """Test booking creation"""
        test_booking = {
            "service": "lawn_mowing",
            "property_size": 150,
            "condition": "normal",
            "additional_services": ["mulching"],
            "preferred_date": "2025-01-20",
            "preferred_time": "morning",
            "alternative_date": "2025-01-21",
            "customer_name": "Test Zákazník",
            "customer_phone": "+420123456789",
            "customer_email": "test@example.com",
            "property_address": "Testovací ulice 123, Dvůr Králové nad Labem",
            "notes": "Test booking from automated test",
            "estimated_price": 2550,
            "gdpr_consent": True
        }
        success, response = self.run_test(
            "Booking Creation",
            "POST",
            "bookings",
            200,
            data=test_booking
        )
        return success, response.get('id') if success else None

    def test_booking_retrieval(self, booking_id):
        """Test booking retrieval by ID"""
        if not booking_id:
            print("❌ Skipping booking retrieval - no booking ID")
            return False, {}
        
        return self.run_test(
            "Booking Retrieval",
            "GET",
            f"bookings/{booking_id}",
            200
        )

    def test_all_bookings(self):
        """Test getting all bookings"""
        return self.run_test(
            "All Bookings",
            "GET",
            "bookings",
            200
        )

    def test_contact_form(self):
        """Test contact form submission"""
        test_contact = {
            "name": "Test Kontakt",
            "email": "test@example.com",
            "phone": "+420987654321",
            "message": "Toto je testovací zpráva z automatického testu."
        }
        return self.run_test(
            "Contact Form",
            "POST",
            "contact",
            200,
            data=test_contact
        )

    def test_invalid_endpoints(self):
        """Test invalid endpoints return proper errors"""
        success, _ = self.run_test(
            "Invalid Endpoint (404)",
            "GET",
            "nonexistent",
            404
        )
        return success

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting SeknuTo.cz API Tests")
        print("=" * 50)

        # Test basic endpoints
        self.test_root_endpoint()
        self.test_availability_endpoint()
        
        # Test pricing
        self.test_pricing_calculator()
        
        # Test booking flow
        booking_success, booking_id = self.test_booking_creation()
        if booking_success and booking_id:
            self.test_booking_retrieval(booking_id)
        
        # Test other endpoints
        self.test_all_bookings()
        self.test_contact_form()
        
        # Test error handling
        self.test_invalid_endpoints()

        # Print results
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.failed_tests:
            print("\n❌ Failed Tests:")
            for test in self.failed_tests:
                print(f"   - {test}")
        
        return self.tests_passed == self.tests_run

def main():
    tester = SeknuToAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())