import connect from "@utils/db"; 
import Medicine from "@models/medicine"; 
import Member from "@models/member"; 
import { NextResponse } from "next/server"; 

export async function POST(req) {
    await connect();

    try {
        const { name, dosage, time, memberId } = await req.json(); // Get data from request body

        // Check if the medicine with the same name already exists
        const existingMedicine = await Medicine.findOne({ name });
        if (existingMedicine) {
            return new NextResponse("Medicine already exists", { status: 400 });
        }

        // Create a new medicine entry
        const newMedicine = new Medicine({ name, dosage, time, member : memberId });
        await newMedicine.save(); // Save the new medicine to the database

        // Link the medicine to the member
        await Member.findByIdAndUpdate(memberId, { $push: { medicines: newMedicine._id } });

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
