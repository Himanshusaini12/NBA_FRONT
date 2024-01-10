// src/App.js
import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  // State for Stats C, Stats 5, and Stats 10
  const [fileUrls, setFileUrls] = useState({
    statsC: "",
    stats5: "",
    stats10: "",
  });

  // State for file and selected endpoint for Excel processing
  const [file, setFile] = useState(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState(
    "https://nba-api-0ixh.onrender.com/process-excel",
  );

  const fetchData = async (endpoint) => {
    try {
      const response = await axios.get(
        `https://nba-api-0ixh.onrender.com/${endpoint}`,
        {
          responseType: "blob",
        },
      );

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${endpoint}.xlsx`;
      link.click();

      setFileUrls((prevUrls) => ({
        ...prevUrls,
        [endpoint]: link.href,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleEndpointChange = (event) => {
    setSelectedEndpoint(event.target.value);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("excelFile", file);

      const response = await axios.post(selectedEndpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "arraybuffer",
      });

      const endpointName = selectedEndpoint.substring(
        selectedEndpoint.lastIndexOf("/") + 1,
      );
      const fileName = `${endpointName}_result.xlsx`;

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const buttonStyle = {
    background: "#1e90ff",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "5px",
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center" }}>
      <h1 style={{ color: "#1e90ff" }}>NBA Scraper and Excel Processor</h1>

      {/* NBA Scraper Section */}
      <div
        style={{
          margin: "20px",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h2>NBA Scraper</h2>
        {/* Stats C */}
        <h3>Current Stats</h3>
        <button onClick={() => fetchData("stats_c")} style={buttonStyle}>
          Fetch Stats C
        </button>
        {fileUrls.statsC && (
          <a
            href={fileUrls.statsC}
            download
            style={{ ...buttonStyle, marginLeft: "10px" }}
          >
            Download Stats C
          </a>
        )}

        {/* Stats 5 */}
        <h3>Last 5 games Stats</h3>
        <button onClick={() => fetchData("stats_5")} style={buttonStyle}>
          Fetch Stats 5
        </button>
        {fileUrls.stats5 && (
          <a
            href={fileUrls.stats5}
            download
            style={{ ...buttonStyle, marginLeft: "10px" }}
          >
            Download Stats 5
          </a>
        )}

        {/* Stats 10 */}
        <h3>Last 10 games Stats</h3>
        <button onClick={() => fetchData("stats_10")} style={buttonStyle}>
          Fetch Stats 10
        </button>
        {fileUrls.stats10 && (
          <a
            href={fileUrls.stats10}
            download
            style={{ ...buttonStyle, marginLeft: "10px" }}
          >
            Download Stats 10
          </a>
        )}
      </div>

      {/* Excel Processor Section */}
      <div className="App">
        <h2>Excel File Processor</h2>
        <input type="file" accept=".xlsx" onChange={handleFileChange} />

        <label>Props: </label>
        <select value={selectedEndpoint} onChange={handleEndpointChange}>
          <option value="">Select Player Prop</option>
          <option value="https://nba-api-0ixh.onrender.com/PtspRebpAst">
            Pts+Reb+Ast
          </option>
          <option value="https://nba-api-0ixh.onrender.com/points">Points</option>
          <option value="https://nba-api-0ixh.onrender.com/rebounds">
            Rebounds
          </option>
          <option value="https://nba-api-0ixh.onrender.com/assists">
            Assists
          </option>
          <option value="https://nba-api-0ixh.onrender.com/threes">Threes</option>
          <option value="https://nba-api-0ixh.onrender.com/blocks">Blocks</option>
          <option value="https://nba-api-0ixh.onrender.com/steals">Steals</option>
          <option value="https://nba-api-0ixh.onrender.com/turnovers">
            Turnovers
          </option>
          <option value="https://nba-api-0ixh.onrender.com/PtspReb">
            Pts+Reb
          </option>
          <option value="https://nba-api-0ixh.onrender.com/PtspAst">
            Pts+Ast
          </option>
          <option value="https://nba-api-0ixh.onrender.com/RebpAst">
            Reb+Ast
          </option>
          <option value="https://nba-api-0ixh.onrender.com/StlpBlk">
            Stl+Blk
          </option>
          {/* Add more options as needed */}
        </select>

        <button onClick={handleUpload} disabled={!file}>
          Process Excel
        </button>
      </div>
    </div>
  );
};

export default App;
