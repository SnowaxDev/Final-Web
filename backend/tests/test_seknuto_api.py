"""
SeknuTo.cz Backend API Tests
Tests for: Booking, Pricing, Subscription, Coupon, Contact, Availability endpoints
"""
import pytest
import requests
import os
import uuid
from datetime import datetime, timedelta

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealthCheck:
    """API Health Check Tests"""
    
    def test_api_root_returns_running(self):
        """Test that API root endpoint returns running status"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "running"
        assert "SeknuTo" in data["message"]


class TestPricingCalculation:
    """Pricing Calculator API Tests"""
    
    def test_basic_lawn_mowing_price(self):
        """Test basic lawn mowing price calculation (2 Kč/m²)"""
        response = requests.post(f"{BASE_URL}/api/pricing/calculate", json={
            "service": "lawn_mowing",
            "property_size": 100,
            "condition": "normal",
            "additional_services": []
        })
        assert response.status_code == 200
        data = response.json()
        assert data["estimated_price"] == 200  # 100m² × 2 Kč
        assert data["property_size"] == 100
        
    def test_lawn_with_fertilizer_price(self):
        """Test lawn with fertilizer price (3.33 Kč/m²)"""
        response = requests.post(f"{BASE_URL}/api/pricing/calculate", json={
            "service": "lawn_with_fertilizer",
            "property_size": 100,
            "condition": "normal",
            "additional_services": []
        })
        assert response.status_code == 200
        data = response.json()
        assert data["estimated_price"] == 333  # 100m² × 3.33 Kč
        
    def test_overgrown_condition_multiplier(self):
        """Test overgrown condition adds 50% to price"""
        response = requests.post(f"{BASE_URL}/api/pricing/calculate", json={
            "service": "lawn_mowing",
            "property_size": 100,
            "condition": "overgrown",
            "additional_services": []
        })
        assert response.status_code == 200
        data = response.json()
        assert data["estimated_price"] == 300  # 100m² × 2 Kč × 1.5
        assert data["condition_multiplier"] == 1.5
        
    def test_spring_package_tiered_pricing_small(self):
        """Test spring package tiered pricing for small property (≤200m²)"""
        response = requests.post(f"{BASE_URL}/api/pricing/calculate", json={
            "service": "spring_package",
            "property_size": 150,
            "condition": "normal",
            "additional_services": []
        })
        assert response.status_code == 200
        data = response.json()
        assert data["estimated_price"] == 1800  # 150m² × 12 Kč (small tier)
        assert data["tier_info"]["tier"] == "small"
        
    def test_spring_package_tiered_pricing_medium(self):
        """Test spring package tiered pricing for medium property (200-500m²)"""
        response = requests.post(f"{BASE_URL}/api/pricing/calculate", json={
            "service": "spring_package",
            "property_size": 300,
            "condition": "normal",
            "additional_services": []
        })
        assert response.status_code == 200
        data = response.json()
        assert data["estimated_price"] == 3000  # 300m² × 10 Kč (medium tier)
        assert data["tier_info"]["tier"] == "medium"
        
    def test_spring_package_tiered_pricing_large(self):
        """Test spring package tiered pricing for large property (>500m²)"""
        response = requests.post(f"{BASE_URL}/api/pricing/calculate", json={
            "service": "spring_package",
            "property_size": 600,
            "condition": "normal",
            "additional_services": []
        })
        assert response.status_code == 200
        data = response.json()
        assert data["estimated_price"] == 5100  # 600m² × 8.5 Kč (large tier)
        assert data["tier_info"]["tier"] == "large"
        
    def test_additional_services_mulching(self):
        """Test mulching additional service (+0.5 Kč/m²)"""
        response = requests.post(f"{BASE_URL}/api/pricing/calculate", json={
            "service": "lawn_mowing",
            "property_size": 100,
            "condition": "normal",
            "additional_services": ["mulching"]
        })
        assert response.status_code == 200
        data = response.json()
        assert data["estimated_price"] == 250  # 200 + 50 (mulching)
        assert data["additional_services_cost"] == 50
        
    def test_additional_services_debris_removal(self):
        """Test debris removal additional service (+400 Kč fixed)"""
        response = requests.post(f"{BASE_URL}/api/pricing/calculate", json={
            "service": "lawn_mowing",
            "property_size": 100,
            "condition": "normal",
            "additional_services": ["debris_removal"]
        })
        assert response.status_code == 200
        data = response.json()
        assert data["estimated_price"] == 600  # 200 + 400 (debris)
        assert data["additional_services_cost"] == 400


class TestAvailability:
    """Availability API Tests"""
    
    def test_get_available_dates(self):
        """Test that availability returns dates excluding Sundays"""
        response = requests.get(f"{BASE_URL}/api/availability")
        assert response.status_code == 200
        data = response.json()
        assert "available_dates" in data
        assert len(data["available_dates"]) > 0
        
        # Verify no Sundays in available dates
        for date_str in data["available_dates"]:
            date = datetime.fromisoformat(date_str)
            assert date.weekday() != 6, f"Sunday found in available dates: {date_str}"
            
    def test_available_dates_are_future(self):
        """Test that all available dates are in the future"""
        response = requests.get(f"{BASE_URL}/api/availability")
        assert response.status_code == 200
        data = response.json()
        
        today = datetime.now().date()
        for date_str in data["available_dates"]:
            date = datetime.fromisoformat(date_str).date()
            assert date > today, f"Past date found: {date_str}"


class TestEmailSubscription:
    """Newsletter Subscription API Tests"""
    
    def test_subscribe_new_email(self):
        """Test subscribing a new email returns coupon code"""
        unique_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
        response = requests.post(f"{BASE_URL}/api/subscribe", json={
            "email": unique_email
        })
        assert response.status_code == 200
        data = response.json()
        assert "coupon_code" in data
        assert data["coupon_code"].startswith("SEKNU")
        assert "message" in data
        
    def test_subscribe_duplicate_email(self):
        """Test subscribing duplicate email returns existing coupon"""
        unique_email = f"test_dup_{uuid.uuid4().hex[:8]}@example.com"
        
        # First subscription
        response1 = requests.post(f"{BASE_URL}/api/subscribe", json={
            "email": unique_email
        })
        assert response1.status_code == 200
        coupon1 = response1.json()["coupon_code"]
        
        # Second subscription with same email
        response2 = requests.post(f"{BASE_URL}/api/subscribe", json={
            "email": unique_email
        })
        assert response2.status_code == 200
        data2 = response2.json()
        assert data2["already_subscribed"] == True
        assert data2["coupon_code"] == coupon1
        
    def test_subscribe_invalid_email(self):
        """Test subscribing with invalid email returns error"""
        response = requests.post(f"{BASE_URL}/api/subscribe", json={
            "email": "invalid-email"
        })
        assert response.status_code == 422  # Validation error


class TestCouponValidation:
    """Coupon Validation API Tests"""
    
    def test_validate_valid_coupon(self):
        """Test validating a valid coupon code"""
        # First create a coupon via subscription
        unique_email = f"test_coupon_{uuid.uuid4().hex[:8]}@example.com"
        sub_response = requests.post(f"{BASE_URL}/api/subscribe", json={
            "email": unique_email
        })
        coupon_code = sub_response.json()["coupon_code"]
        
        # Validate the coupon
        response = requests.post(f"{BASE_URL}/api/coupons/validate", json={
            "code": coupon_code
        })
        assert response.status_code == 200
        data = response.json()
        assert data["valid"] == True
        assert data["discount_percent"] == 5
        
    def test_validate_invalid_coupon(self):
        """Test validating an invalid coupon code returns 404"""
        response = requests.post(f"{BASE_URL}/api/coupons/validate", json={
            "code": "INVALID123"
        })
        assert response.status_code == 404
        
    def test_validate_coupon_case_insensitive(self):
        """Test coupon validation is case insensitive"""
        unique_email = f"test_case_{uuid.uuid4().hex[:8]}@example.com"
        sub_response = requests.post(f"{BASE_URL}/api/subscribe", json={
            "email": unique_email
        })
        coupon_code = sub_response.json()["coupon_code"]
        
        # Validate with lowercase
        response = requests.post(f"{BASE_URL}/api/coupons/validate", json={
            "code": coupon_code.lower()
        })
        assert response.status_code == 200


class TestBookingCreation:
    """Booking API Tests"""
    
    def test_create_booking_success(self):
        """Test creating a booking successfully"""
        tomorrow = (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d")
        
        booking_data = {
            "service": "lawn_mowing",
            "property_size": 200,
            "condition": "normal",
            "additional_services": [],
            "preferred_date": tomorrow,
            "preferred_time": "morning",
            "customer_name": "TEST_Jan Novák",
            "customer_phone": "+420123456789",
            "customer_email": f"test_{uuid.uuid4().hex[:8]}@example.com",
            "property_address": "Testovací 123, Praha",
            "notes": "Test booking",
            "estimated_price": 400,
            "gdpr_consent": True
        }
        
        response = requests.post(f"{BASE_URL}/api/bookings", json=booking_data)
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "id" in data
        assert data["service"] == "lawn_mowing"
        assert data["property_size"] == 200
        assert data["customer_name"] == "TEST_Jan Novák"
        assert data["status"] == "pending"
        
        return data["id"]
        
    def test_get_booking_by_id(self):
        """Test retrieving a booking by ID"""
        # First create a booking
        tomorrow = (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d")
        booking_data = {
            "service": "lawn_mowing",
            "property_size": 150,
            "condition": "normal",
            "additional_services": [],
            "preferred_date": tomorrow,
            "preferred_time": "afternoon",
            "customer_name": "TEST_Petr Svoboda",
            "customer_phone": "+420987654321",
            "customer_email": f"test_{uuid.uuid4().hex[:8]}@example.com",
            "property_address": "Testovací 456, Brno",
            "notes": "",
            "estimated_price": 300,
            "gdpr_consent": True
        }
        
        create_response = requests.post(f"{BASE_URL}/api/bookings", json=booking_data)
        booking_id = create_response.json()["id"]
        
        # Get the booking
        get_response = requests.get(f"{BASE_URL}/api/bookings/{booking_id}")
        assert get_response.status_code == 200
        data = get_response.json()
        assert data["id"] == booking_id
        assert data["customer_name"] == "TEST_Petr Svoboda"
        
    def test_get_nonexistent_booking(self):
        """Test getting a non-existent booking returns 404"""
        response = requests.get(f"{BASE_URL}/api/bookings/nonexistent-id-12345")
        assert response.status_code == 404
        
    def test_create_booking_with_coupon(self):
        """Test creating a booking with a coupon code"""
        tomorrow = (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d")
        
        # First get a coupon
        unique_email = f"test_booking_coupon_{uuid.uuid4().hex[:8]}@example.com"
        sub_response = requests.post(f"{BASE_URL}/api/subscribe", json={
            "email": unique_email
        })
        coupon_code = sub_response.json()["coupon_code"]
        
        booking_data = {
            "service": "spring_package",
            "property_size": 300,
            "condition": "normal",
            "additional_services": ["mulching"],
            "preferred_date": tomorrow,
            "preferred_time": "anytime",
            "customer_name": "TEST_Marie Coupon",
            "customer_phone": "+420111222333",
            "customer_email": unique_email,
            "property_address": "Slevová 789, Ostrava",
            "notes": "Booking with coupon",
            "estimated_price": 3150,  # 3000 + 150 mulching
            "gdpr_consent": True,
            "coupon_code": coupon_code
        }
        
        response = requests.post(f"{BASE_URL}/api/bookings", json=booking_data)
        assert response.status_code == 200
        data = response.json()
        assert data["coupon_code"] == coupon_code
        
    def test_create_booking_invalid_email(self):
        """Test creating booking with invalid email returns error"""
        tomorrow = (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d")
        
        booking_data = {
            "service": "lawn_mowing",
            "property_size": 100,
            "condition": "normal",
            "additional_services": [],
            "preferred_date": tomorrow,
            "preferred_time": "morning",
            "customer_name": "TEST_Invalid Email",
            "customer_phone": "+420123456789",
            "customer_email": "invalid-email",
            "property_address": "Test 123",
            "notes": "",
            "estimated_price": 200,
            "gdpr_consent": True
        }
        
        response = requests.post(f"{BASE_URL}/api/bookings", json=booking_data)
        assert response.status_code == 422  # Validation error


class TestContactForm:
    """Contact Form API Tests"""
    
    def test_submit_contact_form(self):
        """Test submitting a contact form"""
        response = requests.post(f"{BASE_URL}/api/contact", json={
            "name": "TEST_Contact User",
            "email": f"test_contact_{uuid.uuid4().hex[:8]}@example.com",
            "phone": "+420555666777",
            "message": "This is a test message from automated testing."
        })
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert "Děkujeme" in data["message"]
        
    def test_submit_contact_form_without_phone(self):
        """Test submitting contact form without phone (optional field)"""
        response = requests.post(f"{BASE_URL}/api/contact", json={
            "name": "TEST_No Phone User",
            "email": f"test_nophone_{uuid.uuid4().hex[:8]}@example.com",
            "message": "Test message without phone number."
        })
        assert response.status_code == 200
        
    def test_submit_contact_form_invalid_email(self):
        """Test submitting contact form with invalid email"""
        response = requests.post(f"{BASE_URL}/api/contact", json={
            "name": "TEST_Invalid",
            "email": "not-an-email",
            "message": "Test"
        })
        assert response.status_code == 422


class TestGetAllBookings:
    """Get All Bookings API Test"""
    
    def test_get_all_bookings(self):
        """Test retrieving all bookings"""
        response = requests.get(f"{BASE_URL}/api/bookings")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
