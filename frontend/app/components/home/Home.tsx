"use client";

import React from "react";

const Home = () => {
  const [data, setData] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch("http://localhost:5050/router/getinfo")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center p-24 bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Welcome to JobApplier
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Find your dream job today.
      </p>

      <div className="w-full max-w-4x1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {data.map((item: any, index: number) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold text-gray-800">{item.name}</h2>
            <p className="text-gray-600 mt-2">{item.email}</p>
            <p className="text-gray-600">{item.phone}</p>
            <p className="text-gray-500 mt-4 text-sm">{item.location}</p>
          </div>
        ))}
      </div>
      
      {data.length === 0 && (
          <p className="text-gray-500">No records found. Fill the form to add some!</p>
      )}
    </div>
  );
};
export default Home;
