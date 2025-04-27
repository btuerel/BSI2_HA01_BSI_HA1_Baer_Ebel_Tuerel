import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        const sortedCountries = response.data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);
      })
      .catch(error => {
        console.error('Fehler beim Abrufen der Länder:', error);
      });
  }, []);

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const styles = {
    app: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      backgroundColor: darkMode ? "#121212" : "#f0f0f0",
      minHeight: "100vh",
      color: darkMode ? "#a855f7" : "#333",
      position: "relative",
      transition: "background-color 0.8s ease, color 0.8s ease",
    },
    container: {
      textAlign: "center",
      maxWidth: "600px",
      width: "90%",
      transition: "all 0.5s ease"
    },
    header: {
      color: darkMode ? "white" : "#111",
      marginBottom: "20px",
      transition: "color 0.5s ease"
    },
    input: {
      padding: "8px",
      marginBottom: "20px",
      width: "100%",
      backgroundColor: darkMode ? "#1e1e1e" : "white",
      border: `1px solid ${darkMode ? "#a855f7" : "#333"}`,
      color: darkMode ? "#a855f7" : "#333",
      borderRadius: "5px",
      transition: "all 0.5s ease"
    },
    button: {
      background: darkMode ? "#a855f7" : "#333",
      color: "white",
      border: "none",
      padding: "8px 12px",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold",
      marginBottom: "10px",
      marginTop: "5px",
      transition: "background 0.5s ease"
    },
    flag: {
      marginTop: "10px",
      width: "200px",
      height: "auto",
      border: `1px solid ${darkMode ? "#a855f7" : "#333"}`,
      borderRadius: "5px",
      backgroundColor: darkMode ? "#1e1e1e" : "white",
      padding: "10px",
      transition: "all 0.5s ease"
    },
    toggleButton: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      background: darkMode ? "white" : "#121212",
      color: darkMode ? "#121212" : "white",
      border: "1px solid",
      padding: "10px 16px",
      borderRadius: "50px",
      cursor: "pointer",
      fontWeight: "bold",
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
      transition: "all 0.5s ease"
    },
    modal: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: darkMode ? "#1e1e1e" : "white",
      color: darkMode ? "#a855f7" : "#333",
      padding: "30px",
      borderRadius: "10px",
      boxShadow: "0 2px 20px rgba(0,0,0,0.4)",
      textAlign: "center",
      zIndex: 1000,
      width: "90%",
      maxWidth: "400px",
      transition: "all 0.5s ease, transform 0.5s ease",
      animation: selectedCountry ? "slideIn 0.5s ease-out" : "",
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 999
    },
    closeButton: {
      position: "absolute",
      bottom: "10px",
      right: "10px",
      background: darkMode ? "#a855f7" : "#333",
      color: "white",
      border: "none",
      padding: "8px 12px",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "background 0.5s ease"
    },
    blurBackground: {
      filter: "blur(5px)",
      pointerEvents: "none",
      transition: "filter 0.5s ease"
    },
    "@keyframes slideIn": {
      "0%": {
        transform: "translate(-50%, 150%)"
      },
      "100%": {
        transform: "translate(-50%, -50%)"
      }
    }
  };

  return (
    <div style={styles.app}>
      {/* Wenn Modal geöffnet, Hintergrund unscharf */}
      {selectedCountry && <div style={styles.overlay} />}

      <div style={{ ...styles.container, ...(selectedCountry ? styles.blurBackground : {}) }}>
        <h1 style={styles.header}>🌍 Länder Liste</h1>

        {/* Suchfeld */}
        <input
          type="text"
          placeholder="Suche nach einem Land..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSelectedCountry(null);
          }}
          style={styles.input}
        />

        {/* Länderübersicht */}
        {filteredCountries.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {filteredCountries.map((country) => (
              <li key={country.cca3}>
                <button
                  onClick={() => setSelectedCountry(country)}
                  style={styles.button}
                >
                  {country.name.common}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Kein Land gefunden.</p>
        )}
      </div>

      {/* Toggle Dark/Light Mode Button */}
      <button
        style={styles.toggleButton}
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      {/* Modal (Popup) */}
      {selectedCountry && (
        <>
          <div style={styles.modal}>
            <h2>{selectedCountry.name.common}</h2>
            <p><strong>Hauptstadt:</strong> {selectedCountry.capital ? selectedCountry.capital[0] : "Keine Hauptstadt vorhanden"}</p>
            {selectedCountry.flags && (
              <img
                src={selectedCountry.flags.svg}
                alt={`Flagge von ${selectedCountry.name.common}`}
                style={styles.flag}
              />
            )}
            <button
              onClick={() => setSelectedCountry(null)}
              style={styles.closeButton}
            >
              Schließen
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
