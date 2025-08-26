import React from "react";

function UserCard({ user }) {
  // Construct the full URL if it's stored as a filename on your server
const imageUrl = user.id_picture
  ? `http://localhost:3000/uploads/${user.id_picture}`
  : "https://via.placeholder.com/150";


  console.log(imageUrl)
  return (
    <div className="bg-base-100 shadow-lg rounded-lg overflow-hidden">
      <figure className="relative pt-[56.25%]">
        <img
          src={imageUrl}
          alt={`${user.first_name}'s ID`}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </figure>

      <div className="card-body">
        <h2 className="font-tesla text-lg">{user.first_name} {user.last_name}</h2>
        <p className="text-sm text-gray-500">{user.position}</p>
      </div>
    </div>
  );
}

export default UserCard;
