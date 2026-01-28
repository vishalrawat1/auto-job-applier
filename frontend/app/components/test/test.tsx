"use client";
import { useState } from "react";

function Test() {
    const [count, setCount] = useState(0);

    function valueincfunc() {
        setCount(prevCount => prevCount + 1);
    }

    return (
        <div className="bg-gray-flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
            <h1 className="text-4xl font-bold text-gray-900">Test</h1>b
            <p className="text-4xl font-bold text-gray-900">{count}</p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={valueincfunc}>click</button>
        </div>
    );
}
export default Test;