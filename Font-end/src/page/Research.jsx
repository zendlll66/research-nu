// import React, { useState, useEffect } from "react";
// import { fetchResearchData } from "../api";

// const Research = () => {
//   const [researchData, setResearchData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const getResearchData = async () => {
//       try {
//         const data = await fetchResearchData();
//         setResearchData(data); // เก็บข้อมูลใน state
//       } catch (err) {
//         setError("Failed to fetch research data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     getResearchData();
//   }, []);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div>
//       {/* <h1>Research hi</h1>
//       <ul>
//         {researchData.map((item, index) => (
//           <li key={index}>
//             <h2>{item.title}</h2>
//             <p>{item.description}</p>
//           </li>
//         ))}
//       </ul> */}


//       <div className="h-[200px] w-[200px] bg-black">

//       </div>
//     </div>
//   );
// };

// export default Research;


import React from 'react'

const Research = () => {
  return (
    <div>
      research
    </div>
  )
}

export default Research
