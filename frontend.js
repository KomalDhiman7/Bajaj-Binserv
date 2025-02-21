import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [jsonInput, setJsonInput] = useState("{\"data\":[\"A\",\"C\",\"z\"]}");
  const [error, setError] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    document.title = "20BEC0215"; // Setting the page title
  }, []);

  const handleSubmit = async () => {
    try {
      setError("");
      setResponseData(null);

      const parsedData = JSON.parse(jsonInput);
      if (!parsedData.data || !Array.isArray(parsedData.data)) {
        throw new Error("Invalid JSON format: 'data' should be an array");
      }

      const response = await axios.post("http://localhost:3000/bfhl", parsedData);
      setResponseData(response.data);
    } catch (err) {
      setError("Invalid JSON input");
    }
  };

  const handleOptionChange = (event) => {
    const { value, checked } = event.target;
    setSelectedOptions((prev) =>
      checked ? [...prev, value] : prev.filter((option) => option !== value)
    );
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Backend Response Viewer</h1>
      <textarea
        rows="5"
        cols="50"
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder='Enter JSON input'
      />
      <br />
      <button onClick={handleSubmit}>Submit</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {responseData && (
        <>
          <h3>Select Data to Display:</h3>
          <label>
            <input
              type="checkbox"
              value="alphabets"
              onChange={handleOptionChange}
            />
            Alphabets
          </label>
          <label>
            <input
              type="checkbox"
              value="numbers"
              onChange={handleOptionChange}
            />
            Numbers
          </label>
          <label>
            <input
              type="checkbox"
              value="highest_alphabet"
              onChange={handleOptionChange}
            />
            Highest Alphabet
          </label>
          <h3>Filtered Response:</h3>
          <pre>
            {JSON.stringify(
              Object.fromEntries(
                Object.entries(responseData).filter(([key]) =>
                  selectedOptions.includes(key)
                )
              ),
              null,
              2
            )}
          </pre>
        </>
      )}
    </div>
  );
};

export default App;
