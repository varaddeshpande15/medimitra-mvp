import connect from "@utils/db"; // Assuming this is a helper to connect to your MongoDB
// import Medicine from "@models/medicine"; // Import the Medicine model
import Medicine from "@models/medecine";
import { NextResponse } from "next/server";

// Handle GET and POST requests for medicines
export async function POST(req) {
  await connect(); // Ensure you connect to the database

  try {
    const { name, dosage, time } = await req.json(); // Get data from request body

    // Check if the medicine with the same name already exists
    const existingMedicine = await Medicine.findOne({ name });
    if (existingMedicine) {
      return new NextResponse("Medicine already exists", { status: 400 });
    }

    // Create a new medicine entry
    const newMedicine = new Medicine({ name, dosage, time });

    await newMedicine.save(); // Save the new medicine to the database

    return new NextResponse(JSON.stringify(newMedicine), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error adding medicine", error: error.message }),
      { status: 500 }
    );
  }
}

export async function GET() {
  await connect(); // Ensure the database connection

  try {
    const medicines = await Medicine.find(); // Fetch all medicines from the database
    return new NextResponse(JSON.stringify(medicines), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error fetching medicines", error: error.message }),
      { status: 500 }
    );
  }
}
    