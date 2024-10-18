import connect from "@utils/db"; // Import your DB connection function
import Member from "@models/member"; // Import your Member model
import User from '@models/User'
// Named export for GET request
export async function GET(req) {
    await connect();

    try {
        // Fetch all members from the database
        const members = await Member.find({});
        
        // Send the list of members as JSON
        return new Response(JSON.stringify(members), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching members:', error);
        return new Response(JSON.stringify({ message: 'Error fetching members.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// Named export for POST request
export async function POST(req) {
    await connect();

    // Parse the request body
    const { name, dob, Breakfast, Lunch, Dinner } = await req.json();

    try {
        // Create a new member
        const newMember = new Member({ name, dob, Breakfast, Lunch, Dinner });

        // Save the new member to the database
        await newMember.save();

        // Respond with the created member
        return new Response(JSON.stringify(newMember), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error adding member:', error);
        return new Response(JSON.stringify({ 
            message: 'Error adding member.', 
            error: error.message 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
