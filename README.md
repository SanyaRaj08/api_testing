# Car Rental System API

## Setup

1. Clone the repository:
    ```bash
    git clone <repository_url>
    cd car-rental-system
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Run the server:
    ```bash
    node index.js
    ```

## API Endpoints

### User Registration

**Endpoint**: `/api/signup`

**Method**: `POST`

**Request Data**:
```json
{
    "username": "user_name",
    "password": "pass",
    "email": "user@.com",
   "role":"admin"
}
**Response data**
{
    "status": "Account successfully created",
    "status_code": 200,
    "user_id": "123445"
}

User Login
Endpoint: /api/login

Method: POST

Request Data:

json
Copy code
{
    "username": "user_name",
    "password": "pass"
}
Response Data:

On Success:
json
{
    "status": "Login successful",
    "status_code": 200,
    "user_id": "12345",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
}
On Failure:
json
{
    "status": "Incorrect username/password provided. Please retry",
    "status_code": 401
}
Add New Car (Admin Only)
Endpoint: /api/car/create

Method: POST

Headers:

json
{
    "Authorization": "Bearer {token}"
}
Request Data:

json
{
    "category": "SUV",
    "model": "BMW Q3",
    "number_plate": "KA1234",
    "current_city": "bangalore",
    "rent_per_hr": 100,
    "rent_history": []
}
Response Data:

json
{
    "message": "Car added successfully",
    "car_id": "12345",
    "status_code": 200
}
Get Available Rides
Endpoint: /api/car/get-rides

Method: GET

Query Parameters:

origin: str
destination: str
category: str
required_hours: int
Response Data:

json
[
    {
        "car_id": "1234",
        "category": "SUV",
        "model": "BMW Q3",
        "number_plate": "KA1234",
        "current_city": "bangalore",
        "rent_per_hr": 100,
        "rent_history": [
            {
                "origin": "bangalore",
                "destination": "mumbai",
                "amount": 10000
            }
        ],
        "total_payable_amt": 1000
    },
    {
        "car_id": "5678",
        "category": "SUV",
        "model": "BMW Q3",
        "number_plate": "KA1234",
        "current_city": "bangalore",
        "rent_per_hr": 100,
        "rent_history": [],
        "total_payable_amt": 1000
    }
]
Rent a Car
Endpoint: /api/car/rent

Method: POST

Headers:

json
{
    "Authorization": "Bearer {token}"
}
Request Data:

json
{
    "car_id": "12345",
    "origin": "mumbai",
    "destination": "bangalore",
    "hours_requirement": 10
}
Response Data:

On Success:
json
{
    "status": "Car rented successfully",
    "status_code": 200,
    "rent_id": "54321",
    "total_payable_amt": 1000
}
On Failure:
json
{
    "status": "No car is available at the moment",
    "status_code": 400
}
Ride Completion (Admin Only)
Endpoint: /api/car/update-rent-history

Method: POST

Headers:

json
{
    "Authorization": "Bearer {token}" // Has to be admin's token
}
Request Data:

json
{
    "car_id": "12345",
    "ride_details": {
        "origin": "mumbai",
        "destination": "bangalore",
        "hours_requirement": 10
    }
}
Response Data:

json
{
    "status": "Car's rent history updated successfully",
    "status_code": 200
}

